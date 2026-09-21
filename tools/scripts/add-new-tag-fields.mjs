#!/usr/bin/env node
/**
 * Add new tag fields (vehicles, npsSites, attractions) to existing photos.json
 *
 * Usage:
 *   node tools/scripts/add-new-tag-fields.mjs
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PHOTOS_JSON_PATH = join(__dirname, '../../apps/yellowstone/src/app/data/photos.json');

async function main() {
  console.log('Reading photos.json...');
  const data = JSON.parse(await readFile(PHOTOS_JSON_PATH, 'utf-8'));

  let updated = 0;
  for (const photo of data.photos) {
    let changed = false;

    if (!Array.isArray(photo.vehicles)) {
      photo.vehicles = [];
      changed = true;
    }
    if (!Array.isArray(photo.npsSites)) {
      photo.npsSites = [];
      changed = true;
    }
    if (!Array.isArray(photo.attractions)) {
      photo.attractions = [];
      changed = true;
    }

    if (changed) updated++;
  }

  console.log(`Updated ${updated} photos with new fields`);

  // Reorder fields in each photo for consistency
  data.photos = data.photos.map(photo => ({
    id: photo.id,
    filename: photo.filename,
    cameraOwner: photo.cameraOwner,
    lat: photo.lat,
    lng: photo.lng,
    dateTaken: photo.dateTaken,
    dateCategory: photo.dateCategory,
    people: photo.people,
    geothermals: photo.geothermals,
    wildlife: photo.wildlife,
    vehicles: photo.vehicles,
    npsSites: photo.npsSites,
    attractions: photo.attractions,
    thumbnail: photo.thumbnail,
    medium: photo.medium,
    full: photo.full,
  }));

  // Update generation timestamp
  data.metadata.generatedAt = new Date().toISOString();

  await writeFile(PHOTOS_JSON_PATH, JSON.stringify(data, null, 2));
  console.log('Saved updated photos.json');
}

main().catch(console.error);
