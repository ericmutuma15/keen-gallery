import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const assetsDir = path.resolve('./src/assets');

async function convertFile(file) {
  const full = path.join(assetsDir, file);
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;
  const base = path.basename(file, ext);
  const out = path.join(assetsDir, `${base}.webp`);
  if (fs.existsSync(out)) {
    console.log('skipping existing', out);
    return;
  }
  try {
    await sharp(full).webp({ quality: 80 }).toFile(out);
    console.log('converted', file, '->', `${base}.webp`);
  } catch (err) {
    console.error('failed', file, err);
  }
}

async function run() {
  const files = fs.readdirSync(assetsDir);
  for (const f of files) {
    await convertFile(f);
  }
}

run().catch((e) => { console.error(e); process.exit(1); });
