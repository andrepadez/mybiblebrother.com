import path from 'node:path';
import { readdir, stat } from 'node:fs/promises';

export const templates: any = {};

const templateDir = path.resolve(__dirname, '..', 'emails');
const files = await readdir(templateDir);

for (let file of files) {
  const fpath = path.join(templateDir, file);
  const [name, ext] = file.split('.');
  const fsStat = await stat(fpath);
  if (!fsStat.isDirectory() && ext === 'tsx') {
    const { default: template } = await import(fpath);
    templates[name] = template;
  }
}
