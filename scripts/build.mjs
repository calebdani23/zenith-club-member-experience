import { mkdir, cp, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
await mkdir(dist, {recursive:true});
for (const file of ['index.html','styles.css','app.js','data.js','band3d.js','manifest.webmanifest','.nojekyll']) {
  await copyFile(path.join(root,file),path.join(dist,file));
}
for (const dir of ['assets','vendor']) await cp(path.join(root,dir),path.join(dist,dir),{recursive:true});
console.log('Built static Zenith app in dist/. No build dependencies required.');
