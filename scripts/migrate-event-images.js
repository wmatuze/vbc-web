/**
 * migrate-event-images.js
 *
 * Fixes Media documents (and any direct event imageUrl fields) that still
 * point to local /uploads/ paths:
 *  - File exists on disk → upload to Cloudinary, update path in Media doc
 *  - File is missing     → clear path so the UI shows a placeholder
 *
 * Usage:
 *   node scripts/migrate-event-images.js
 */

require("dotenv").config();

const path     = require("path");
const fs       = require("fs");
const mongoose = require("mongoose");
const { uploadBuffer } = require("../config/cloudinary");

const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

// Matches /uploads/... or http(s)://anything/uploads/...
const isLocalUpload = (p) =>
  p && (p.includes("/uploads/") && !p.startsWith("https://res.cloudinary.com"));

function extractFilename(p) {
  // Strip any leading hostname so we always get just the filename
  return path.basename(p.replace(/^https?:\/\/[^/]+/, ""));
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB_NAME || "vbc_web",
  });
  console.log("Connected to MongoDB\n");

  const db = mongoose.connection.db;

  // ── 1. Migrate Media collection ──────────────────────────────────────────
  const mediaDocs = await db.collection("media")
    .find({ path: { $exists: true } })
    .toArray();

  const localMedia = mediaDocs.filter((m) => isLocalUpload(m.path));
  console.log(`Media docs with local upload paths: ${localMedia.length}`);

  let migrated = 0;
  let cleared  = 0;

  for (const doc of localMedia) {
    const filename  = extractFilename(doc.path);
    const localPath = path.join(UPLOADS_DIR, filename);

    if (fs.existsSync(localPath)) {
      try {
        const buffer = fs.readFileSync(localPath);
        const result = await uploadBuffer(buffer, {
          folder:        "vbc/events",
          public_id:     filename.replace(/\.[^.]+$/, ""),
          resource_type: "image",
        });
        await db.collection("media").updateOne(
          { _id: doc._id },
          { $set: { path: result.secure_url, url: result.secure_url } }
        );
        console.log(`  ✓ Migrated  ${filename} → ${result.secure_url}`);
        migrated++;
      } catch (err) {
        console.error(`  ✗ Upload failed for ${filename}: ${err.message}`);
      }
    } else {
      await db.collection("media").updateOne(
        { _id: doc._id },
        { $set: { path: null } }
      );
      console.log(`  — Cleared   ${filename} (not on disk)`);
      cleared++;
    }
  }

  // ── 2. Fix any event.imageUrl fields that are local paths ─────────────────
  const events = await db.collection("events")
    .find({ imageUrl: { $exists: true } })
    .toArray();

  const localEvents = events.filter((e) => isLocalUpload(e.imageUrl));
  console.log(`\nEvents with local imageUrl paths: ${localEvents.length}`);

  for (const ev of localEvents) {
    const filename  = extractFilename(ev.imageUrl);
    const localPath = path.join(UPLOADS_DIR, filename);

    if (fs.existsSync(localPath)) {
      try {
        const buffer = fs.readFileSync(localPath);
        const result = await uploadBuffer(buffer, {
          folder:        "vbc/events",
          public_id:     filename.replace(/\.[^.]+$/, ""),
          resource_type: "image",
        });
        await db.collection("events").updateOne(
          { _id: ev._id },
          { $set: { imageUrl: result.secure_url } }
        );
        console.log(`  ✓ Migrated  "${ev.title}" → ${result.secure_url}`);
        migrated++;
      } catch (err) {
        console.error(`  ✗ Upload failed for "${ev.title}": ${err.message}`);
      }
    } else {
      await db.collection("events").updateOne(
        { _id: ev._id },
        { $set: { imageUrl: null } }
      );
      console.log(`  — Cleared   "${ev.title}" (file not found: ${filename})`);
      cleared++;
    }
  }

  console.log(`\nDone. Migrated: ${migrated} | Cleared: ${cleared}`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
