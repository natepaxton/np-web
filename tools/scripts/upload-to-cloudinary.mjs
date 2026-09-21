#!/usr/bin/env node
/**
 * Upload Yellowstone photos to Cloudinary with correct public IDs.
 *
 * Prerequisites:
 * 1. Create a .env file in the repo root with:
 *    CLOUDINARY_API_KEY=your_api_key
 *    CLOUDINARY_API_SECRET=your_api_secret
 *
 * 2. Run: node tools/scripts/upload-to-cloudinary.mjs <source-folder>
 *    Example: node tools/scripts/upload-to-cloudinary.mjs C:/workspace/yellowstone
 *
 * The script expects subfolders named after camera owners (nate, laura, travis).
 */

import { readdir, stat, readFile } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';
import { v2 as cloudinary } from 'cloudinary';

// Load .env file manually (Node 20+ has loadEnvFile but let's be compatible)
async function loadEnv() {
  try {
    const envPath = new URL('../../.env', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
    const envContent = await readFile(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        process.env[key.trim()] = value;
      }
    }
  } catch (err) {
    // .env file doesn't exist, rely on existing env vars
  }
}

const CLOUD_NAME = 'fdacst4d';
const CLOUDINARY_FOLDER = 'yellowstone';

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

async function uploadPhoto(filePath, cameraOwner) {
  const filename = basename(filePath);
  const publicId = `${CLOUDINARY_FOLDER}/${cameraOwner}/${basename(filename, extname(filename))}`;

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      overwrite: true,
      resource_type: 'image',
    });
    return { success: true, publicId, url: result.secure_url };
  } catch (error) {
    return { success: false, publicId, error: error.message };
  }
}

async function main() {
  await loadEnv();

  const [, , sourceFolder] = process.argv;

  if (!sourceFolder) {
    console.error('Usage: node upload-to-cloudinary.mjs <source-folder>');
    console.error('Example: node upload-to-cloudinary.mjs C:/workspace/yellowstone');
    process.exit(1);
  }

  // Check for credentials
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiKey || !apiSecret) {
    console.error('Missing Cloudinary credentials!');
    console.error('Create a .env file in the repo root with:');
    console.error('  CLOUDINARY_API_KEY=your_api_key');
    console.error('  CLOUDINARY_API_SECRET=your_api_secret');
    process.exit(1);
  }

  // Configure Cloudinary
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  console.log(`Scanning ${sourceFolder} for images...`);

  const cameraOwners = await readdir(sourceFolder);
  let totalUploaded = 0;
  let totalFailed = 0;

  for (const owner of cameraOwners) {
    const ownerPath = join(sourceFolder, owner);
    const ownerStat = await stat(ownerPath);

    if (!ownerStat.isDirectory()) continue;

    const ownerLower = owner.toLowerCase();
    console.log(`\nProcessing ${owner}'s photos...`);

    const jpegFiles = await findJpegFiles(ownerPath);
    console.log(`  Found ${jpegFiles.length} JPEG files`);

    let uploaded = 0;
    let failed = 0;

    for (let i = 0; i < jpegFiles.length; i++) {
      const file = jpegFiles[i];
      const result = await uploadPhoto(file, ownerLower);

      if (result.success) {
        uploaded++;
        totalUploaded++;
      } else {
        failed++;
        totalFailed++;
        console.error(`  Failed: ${basename(file)} - ${result.error}`);
      }

      // Progress update every 10 files
      if ((i + 1) % 10 === 0 || i === jpegFiles.length - 1) {
        process.stdout.write(`\r  Uploaded ${uploaded}/${jpegFiles.length}...`);
      }
    }

    console.log(`\n  Completed: ${uploaded} uploaded, ${failed} failed`);
  }

  console.log(`\n--- Summary ---`);
  console.log(`Total uploaded: ${totalUploaded}`);
  console.log(`Total failed: ${totalFailed}`);
}

main().catch(console.error);
