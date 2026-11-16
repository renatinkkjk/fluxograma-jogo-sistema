const Jimp = require('jimp');
const path = require('path');

/** Miniatura em texto (visão geral do layout). */
async function thumb(file, cols = 96) {
  const img = await Jimp.read(path.join(__dirname, '..', 'docs', file));
  const rows = Math.round((img.bitmap.height / img.bitmap.width) * cols * 0.5);
  console.log('=== ' + file + ' (' + img.bitmap.width + 'x' + img.bitmap.height + ')');
  const d = img.bitmap.data;
  for (let r = 0; r < rows; r += 1) {
    let line = '';
    for (let c = 0; c < cols; c += 1) {
      const x = Math.floor((c / cols) * img.bitmap.width);
      const y = Math.floor((r / rows) * img.bitmap.height);
      const i = (y * img.bitmap.width + x) * 4;
      const R = d[i], G = d[i + 1], B = d[i + 2];
      const mx = Math.max(R, G, B), mn = Math.min(R, G, B);
      if (mx < 90 && mn < 100) line += '#';            // borda / seta / texto
      else if (R > 240 && G > 235 && B > 240) line += ' ';  // branco
      else if (R > 245 && G > 225 && B < 170) line += 'D';  // decisao (amarelo)
      else if (R > 245 && G < 240 && B > 220) line += 'T';  // terminador (rosa)
      else if (B > 235 && G > 235) line += 'I';      // entrada/saida (ciano)
      else if (mx - mn < 30) line += '.';             // processo (azul claro)
      else line += '*';
    }
    console.log(line);
  }
}

async function main() {
  await thumb('fluxograma-sistema-escolar.png');
  await thumb('fluxograma-jogo.png');
}
main().catch((e) => { console.error(e); process.exit(1); });
