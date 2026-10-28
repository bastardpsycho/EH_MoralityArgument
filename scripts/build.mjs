import {readFile, writeFile} from 'node:fs/promises';
import {renderPage} from '../_application/page.mjs';
import {boardSpecs,renderBoardSvg} from '../_application/topical-art.mjs';
import {runtimeAssets, __version__} from '../_application/scaffold.mjs';

const root = new URL('../_application/', import.meta.url);
for(const board of boardSpecs)await writeFile(new URL(`morality-${board.room}.svg`,root),renderBoardSvg(board));
await writeFile(new URL('index.html', root), renderPage());
for (const file of runtimeAssets) {
  if (!/^[a-z0-9-]+\.(html|svg|css|mjs|jpg)$/.test(file)) throw Error(`Invalid asset: ${file}`);
  if (!(await readFile(new URL(file, root))).length) throw Error(`Empty asset: ${file}`);
}
console.log(`MORARG ${__version__}: generated reading guide; verified ${runtimeAssets.length} local assets.`);
