#!/usr/bin/env node
/**
 * Infer GPS locations for photos without GPS data based on timestamps.
 *
 * Logic:
 * - Nate's camera has GPS data
 * - Laura was with Nate the whole trip, so her photos can use Nate's GPS
 * - Travis was with them during Yellowstone days only
 *
 * For each photo without GPS, find the closest Nate photo by timestamp
 * and use that location.
 */

import { readFile, writeFile } from 'node:fs/promises';

const YELLOWSTONE_START = new Date('2026-08-30');
const YELLOWSTONE_END = new Date('2026-09-05');

// Maximum time difference (in minutes) to consider a match
const MAX_TIME_DIFF_MINUTES = 120;

async function main() {
  const dataPath = 'apps/yellowstone/src/app/data/photos.json';
  const data = JSON.parse(await readFile(dataPath, 'utf-8'));

  // Get Nate's photos with GPS, sorted by date
  const nateWithGps = data.photos
    .filter(p => p.cameraOwner === 'Nate' && p.lat !== null && p.dateTaken)
    .sort((a, b) => new Date(a.dateTaken) - new Date(b.dateTaken));

  console.log(`Reference photos (Nate with GPS): ${nateWithGps.length}`);

  let inferred = 0;
  let skipped = 0;
  let tooFar = 0;

  for (const photo of data.photos) {
    // Skip if already has GPS
    if (photo.lat !== null) continue;

    // Skip if no date
    if (!photo.dateTaken) {
      skipped++;
      continue;
    }

    const photoDate = new Date(photo.dateTaken);

    // For Travis, only infer during Yellowstone days
    if (photo.cameraOwner === 'Travis') {
      if (photoDate < YELLOWSTONE_START || photoDate > YELLOWSTONE_END) {
        skipped++;
        continue;
      }
    }

    // Find closest Nate photo by timestamp
    let closestPhoto = null;
    let closestDiff = Infinity;

    for (const natePhoto of nateWithGps) {
      const nateDate = new Date(natePhoto.dateTaken);
      const diff = Math.abs(photoDate - nateDate);

      if (diff < closestDiff) {
        closestDiff = diff;
        closestPhoto = natePhoto;
      }
    }

    if (closestPhoto) {
      const diffMinutes = closestDiff / (1000 * 60);

      if (diffMinutes <= MAX_TIME_DIFF_MINUTES) {
        photo.lat = closestPhoto.lat;
        photo.lng = closestPhoto.lng;
        inferred++;

        if (inferred <= 10) {
          console.log(`  ${photo.cameraOwner} ${photo.filename}: inferred from ${closestPhoto.filename} (${diffMinutes.toFixed(1)} min apart)`);
        }
      } else {
        tooFar++;
        if (tooFar <= 5) {
          console.log(`  Skipped ${photo.cameraOwner} ${photo.filename}: closest is ${diffMinutes.toFixed(0)} min away`);
        }
      }
    }
  }

  console.log(`\nResults:`);
  console.log(`  Inferred: ${inferred}`);
  console.log(`  Skipped (no date or Travis outside Yellowstone): ${skipped}`);
  console.log(`  Too far from reference (>${MAX_TIME_DIFF_MINUTES} min): ${tooFar}`);

  // Count final stats
  const withGps = data.photos.filter(p => p.lat !== null).length;
  console.log(`\nFinal: ${withGps}/${data.photos.length} photos with GPS`);

  // Write updated data
  await writeFile(dataPath, JSON.stringify(data, null, 2));
  console.log(`\nUpdated ${dataPath}`);
}

main().catch(console.error);
