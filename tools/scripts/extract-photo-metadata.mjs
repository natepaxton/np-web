#!/usr/bin/env node
/**
 * Extract EXIF metadata from Yellowstone trip photos.
 *
 * Usage:
 *   node tools/scripts/extract-photo-metadata.mjs <source-folder> <output-json>
 *
 * Example:
 *   node tools/scripts/extract-photo-metadata.mjs C:/workspace/yellowstone apps/yellowstone/src/app/data/photos.json
 *
 * The script expects subfolders named after camera owners (e.g., nate, laura, travis).
 * It extracts GPS coordinates, date/time, and generates Cloudinary URLs.
 */

import { readdir, stat, writeFile } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';
import pkg from 'exif';
const { ExifImage } = pkg;
import { promisify } from 'node:util';

const CLOUDINARY_CLOUD_NAME = 'fdacst4d';
const CLOUDINARY_FOLDER = 'yellowstone'; // folder in Cloudinary where images will be uploaded

// People on the trip for tagging
const PEOPLE = ['Nate', 'Laura', 'Greg', 'Nancy', 'Travis', 'Amy', 'Kennedy'];

// Date ranges for categorization
const YELLOWSTONE_START = new Date('2026-08-30');
const YELLOWSTONE_END = new Date('2026-09-05');

function getExifData(imagePath) {
  return new Promise((resolve, reject) => {
    new ExifImage({ image: imagePath }, (error, exifData) => {
      if (error) {
        // Some images may not have EXIF data
        resolve(null);
      } else {
        resolve(exifData);
      }
    });
  });
}

function convertDMSToDecimal(dms, ref) {
  if (!dms || dms.length !== 3) return null;
  const [degrees, minutes, seconds] = dms;
  let decimal = degrees + minutes / 60 + seconds / 3600;
  if (ref === 'S' || ref === 'W') {
    decimal = -decimal;
  }
  return decimal;
}

function parseExifDate(dateStr) {
  if (!dateStr) return null;
  // EXIF date format: "YYYY:MM:DD HH:MM:SS"
  const [datePart, timePart] = dateStr.split(' ');
  if (!datePart) return null;
  const [year, month, day] = datePart.split(':');
  if (!year || !month || !day) return null;

  if (timePart) {
    const [hour, minute, second] = timePart.split(':');
    return new Date(year, month - 1, day, hour || 0, minute || 0, second || 0);
  }
  return new Date(year, month - 1, day);
}

function categorizeDate(date) {
  if (!date) return 'unknown';
  if (date < YELLOWSTONE_START) return 'trip-out';
  if (date > YELLOWSTONE_END) return 'trip-back';
  return 'yellowstone';
}

function getCloudinaryUrl(cameraOwner, filename, transform = '') {
  const publicId = `${CLOUDINARY_FOLDER}/${cameraOwner}/${basename(filename, extname(filename))}`;
  const transformPart = transform ? `${transform}/` : '';
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformPart}${publicId}`;
}

async function processImage(imagePath, cameraOwner) {
  const filename = basename(imagePath);

  try {
    const exif = await getExifData(imagePath);

    let lat = null;
    let lng = null;
    let dateTaken = null;

    if (exif) {
      // Extract GPS coordinates
      if (exif.gps && exif.gps.GPSLatitude && exif.gps.GPSLongitude) {
        lat = convertDMSToDecimal(exif.gps.GPSLatitude, exif.gps.GPSLatitudeRef);
        lng = convertDMSToDecimal(exif.gps.GPSLongitude, exif.gps.GPSLongitudeRef);
      }

      // Extract date taken
      const dateStr = exif.exif?.DateTimeOriginal || exif.exif?.CreateDate || exif.image?.ModifyDate;
      dateTaken = parseExifDate(dateStr);
    }

    return {
      id: `${cameraOwner}-${filename}`,
      filename,
      cameraOwner: cameraOwner.charAt(0).toUpperCase() + cameraOwner.slice(1),
      lat,
      lng,
      dateTaken: dateTaken ? dateTaken.toISOString() : null,
      dateCategory: categorizeDate(dateTaken),
      people: [], // To be filled in manually
      geothermals: [], // To be filled in manually: geyser, spring, paint-pot, mudpot, fumarole
      wildlife: [], // To be filled in manually: bison, bear, moose, elk, fox, wolf, deer, pronghorn, prairie-dog, bighorn-sheep, other
      vehicles: [], // To be filled in manually: camper, subaru
      npsSites: [], // To be filled in manually: mammoth-cave, ste-genevieve, ulysses-grant, harry-truman, brown-v-board, homestead, minuteman-missile, badlands, wind-cave, jewel-cave, mount-rushmore, devils-tower, yellowstone, grand-teton, little-bighorn, theodore-roosevelt, knife-river, indiana-dunes
      attractions: [], // To be filled in manually: wall-drug, needles-highway
      thumbnail: getCloudinaryUrl(cameraOwner, filename, 'c_fill,w_200,h_200,q_auto'),
      medium: getCloudinaryUrl(cameraOwner, filename, 'c_limit,w_800,q_auto'),
      full: getCloudinaryUrl(cameraOwner, filename, 'q_auto'),
    };
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error.message);
    return null;
  }
}

async function findJpegFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findJpegFiles(fullPath)));
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      if (ext === '.jpg' || ext === '.jpeg') {
        files.push(fullPath);
      }
    }
  }

  return files;
}

async function main() {
  const [, , sourceFolder, outputPath] = process.argv;

  if (!sourceFolder || !outputPath) {
    console.error('Usage: node extract-photo-metadata.mjs <source-folder> <output-json>');
    console.error('Example: node extract-photo-metadata.mjs C:/workspace/yellowstone apps/yellowstone/src/app/data/photos.json');
    process.exit(1);
  }

  console.log(`Scanning ${sourceFolder} for images...`);

  const photos = [];
  const cameraOwners = await readdir(sourceFolder);

  for (const owner of cameraOwners) {
    const ownerPath = join(sourceFolder, owner);
    const ownerStat = await stat(ownerPath);

    if (!ownerStat.isDirectory()) continue;

    console.log(`Processing ${owner}'s photos...`);
    const jpegFiles = await findJpegFiles(ownerPath);
    console.log(`  Found ${jpegFiles.length} JPEG files`);

    let processed = 0;
    for (const file of jpegFiles) {
      const photo = await processImage(file, owner);
      if (photo) {
        photos.push(photo);
        processed++;
        if (processed % 50 === 0) {
          console.log(`  Processed ${processed}/${jpegFiles.length}`);
        }
      }
    }
    console.log(`  Completed: ${processed} photos`);
  }

  // Sort by date
  photos.sort((a, b) => {
    if (!a.dateTaken) return 1;
    if (!b.dateTaken) return -1;
    return new Date(a.dateTaken) - new Date(b.dateTaken);
  });

  // Summary stats
  const withGps = photos.filter(p => p.lat && p.lng).length;
  const withDate = photos.filter(p => p.dateTaken).length;
  const byCategory = photos.reduce((acc, p) => {
    acc[p.dateCategory] = (acc[p.dateCategory] || 0) + 1;
    return acc;
  }, {});

  console.log('\n--- Summary ---');
  console.log(`Total photos: ${photos.length}`);
  console.log(`With GPS data: ${withGps}`);
  console.log(`With date data: ${withDate}`);
  console.log(`By category:`, byCategory);

  // Write output
  const output = {
    metadata: {
      generatedAt: new Date().toISOString(),
      cloudinaryCloudName: CLOUDINARY_CLOUD_NAME,
      people: PEOPLE,
      yellowstoneStart: YELLOWSTONE_START.toISOString().split('T')[0],
      yellowstoneEnd: YELLOWSTONE_END.toISOString().split('T')[0],
    },
    photos,
  };

  await writeFile(outputPath, JSON.stringify(output, null, 2));
  console.log(`\nOutput written to ${outputPath}`);
  console.log('\nNext steps:');
  console.log('1. Upload images to Cloudinary under the "yellowstone/<owner>" folders');
  console.log('2. Edit the JSON to add people tags to each photo');
}

main().catch(console.error);
