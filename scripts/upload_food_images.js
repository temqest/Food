const fs = require('fs');
const path = require('path');
const { createClient } = require(path.resolve(__dirname, '../frontend/node_modules/@supabase/supabase-js'));

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hncwrjcilvfqaczwlglk.supabase.co';
// Support passing SERVICE_ROLE_KEY via environment variable if available, else fallback to anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_rn5YLWLNxtbjOP3AwzSf0Q__17FM_FA';

const supabase = createClient(supabaseUrl, supabaseKey);

const DISHES_DIR = path.resolve(__dirname, '../frontend/assets/images/dishes');

const MIME_MAP = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

async function uploadAllImages() {
  console.log('--- Starting Food Images Upload to Supabase Storage ---');
  console.log(`Connecting to: ${supabaseUrl}`);
  console.log(`Scanning local assets directory: ${DISHES_DIR}\n`);

  if (!fs.existsSync(DISHES_DIR)) {
    console.error(`Directory not found: ${DISHES_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(DISHES_DIR).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });

  console.log(`Found ${files.length} dish images to upload.`);

  let successCount = 0;
  let failCount = 0;

  for (const filename of files) {
    const filePath = path.join(DISHES_DIR, filename);
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filename).toLowerCase();
    const contentType = MIME_MAP[ext] || 'application/octet-stream';

    process.stdout.write(`Uploading ${filename}... `);

    const { data, error } = await supabase.storage
      .from('food-images')
      .upload(filename, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.log(`FAILED ❌ (${error.message || error})`);
      failCount++;
    } else {
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/food-images/${filename}`;
      console.log(`SUCCESS ✅ -> ${publicUrl}`);
      successCount++;
    }
  }

  console.log(`\n--- Upload Finished ---`);
  console.log(`Uploaded: ${successCount} | Failed: ${failCount}`);

  if (failCount > 0) {
    console.log('\nTip: If uploads failed with 403 / AccessDenied:');
    console.log('1. Go to your Supabase Dashboard -> SQL Editor.');
    console.log('2. Run the script: supabase_update_food_images.sql to create the "food-images" bucket and grant upload permissions.');
    console.log('3. Re-run: node scripts/upload_food_images.js');
  }
}

uploadAllImages().catch(console.error);

