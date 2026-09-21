#!/usr/bin/env node
/**
 * Delete photos from Cloudinary using the exported deleted-photos.json.
 *
 * Prerequisites:
 * 1. Export deleted photos from the photo tagger tool (deleted-photos.json)
 * 2. Create a .env file in the repo root with:
 *    CLOUDINARY_API_KEY=your_api_key
 *    CLOUDINARY_API_SECRET=your_api_secret
 *
 * Usage: node tools/scripts/delete-from-cloudinary.mjs <deleted-photos.json>
 * Example: node tools/scripts/delete-from-cloudinary.mjs ~/Downloads/deleted-photos.json
 */

import { readFile } from 'node:fs/promises';
import { v2 as cloudinary } from 'cloudinary';

const CLOUD_NAME = 'fdacst4d';

// Load .env file manually
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

async function deletePhoto(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
      invalidate: true, // Invalidate CDN cache
    });
    return { success: result.result === 'ok', publicId, result: result.result };
  } catch (error) {
    return { success: false, publicId, error: error.message };
  }
}

async function main() {
  await loadEnv();

  const [, , deletedPhotosFile] = process.argv;

  if (!deletedPhotosFile) {
    console.error('Usage: node delete-from-cloudinary.mjs <deleted-photos.json>');
    console.error('Example: node delete-from-cloudinary.mjs ~/Downloads/deleted-photos.json');
    console.error('\nExport deleted-photos.json from the photo tagger tool first.');
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

  // Load deleted photos list
  let deletedPhotos;
  try {
    const content = await readFile(deletedPhotosFile, 'utf-8');
    deletedPhotos = JSON.parse(content);
  } catch (err) {
    console.error(`Failed to read ${deletedPhotosFile}: ${err.message}`);
    process.exit(1);
  }

  if (!Array.isArray(deletedPhotos) || deletedPhotos.length === 0) {
    console.log('No photos to delete.');
    process.exit(0);
  }

  console.log(`Found ${deletedPhotos.length} photo(s) to delete from Cloudinary.\n`);

  // Show what will be deleted
  console.log('Photos to delete:');
  for (const photo of deletedPhotos) {
    console.log(`  - ${photo.filename} (${photo.cameraOwner}) → ${photo.publicId}`);
  }
  console.log('');

  // Confirm
  const readline = await import('node:readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const answer = await new Promise((resolve) => {
    rl.question('Proceed with deletion? (yes/no): ', resolve);
  });
  rl.close();

  if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
    console.log('Aborted.');
    process.exit(0);
  }

  console.log('\nDeleting...\n');

  let deleted = 0;
  let failed = 0;
  const failures = [];

  for (const photo of deletedPhotos) {
    const result = await deletePhoto(photo.publicId);

    if (result.success) {
      deleted++;
      console.log(`✓ Deleted: ${photo.filename}`);
    } else {
      failed++;
      failures.push({ photo, error: result.error || result.result });
      console.error(`✗ Failed: ${photo.filename} - ${result.error || result.result}`);
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`Deleted: ${deleted}`);
  console.log(`Failed: ${failed}`);

  if (failures.length > 0) {
    console.log('\nFailed deletions:');
    for (const f of failures) {
      console.log(`  - ${f.photo.publicId}: ${f.error}`);
    }
  }

  if (deleted > 0) {
    console.log("\nDon't forget to clear the deleted photos list in the tagger tool.");
  }
}

main().catch(console.error);
