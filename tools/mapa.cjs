const Jimp = require('jimp');

// cores de preenchimento usadas nos dois fluxogramas
const CORES = {
  'INICIO/FIM': [0xff, 0xe6, 0xf0],
  DECISAO: [0xff, 0xf6, 0xd6],
  ENTRADA: [0xe4, 0xff, 0xf2],
  PROCESSO: [0xee, 0xf2, 0xff],
  SAIDA: [0xed, 0xe7, 0xf6],
  CORRIDA: [0xff, 0xe6, 0xee],
  VITORIA: [0xe8, 0xf5, 0xe9],
  DERROTA: [0xff, 0xeb, 0xee],
};

function iguais(d, i, c) {
  return Math.abs(d[i] - c[0]) < 6 && Math.abs(d[i + 1] - c[1]) < 6 && Math.abs(d[i + 2] - c[2]) < 6;
}

async function mapa(file) {
  const img = await Jimp.read(file);
  const { width: W, height: H, data: d } = img.bitmap;
  console.log('=== ' + file + '  ' + W + 'x' + H);

  const rotulo = new Int32Array(W * H).fill(-1);
  const caixas = [];
  const alvos = Object.keys(CORES);

  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      const p = y * W + x;
      if (rotulo[p] !== -1) continue;
      let cor = -1;
      const i = p * 4;
      for (let k = 0; k < alvos.length; k += 1) {
        if (iguais(d, i, CORES[alvos[k]])) { cor = k; break; }
      }
      if (cor === -1) continue;
      // flood fill
      const fila = [p];
      rotulo[p] = caixas.length;
      let minx = x, maxx = x, miny = y, maxy = y, n = 0;
      while (fila.length) {
        const q = fila.pop();
        const qx = q % W;
        const qy = (q / W) | 0;
        n += 1;
        if (qx < minx) minx = qx;
        if (qx > maxx) maxx = qx;
        if (qy < miny) miny = qy;
        if (qy > maxy) maxy = qy;
        const viz = [q - 1, q + 1, q - W, q + W];
        for (const v of viz) {
          if (v < 0 || v >= W * H) continue;
          if (rotulo[v] !== -1) continue;
          const vx = v % W;
          if (Math.abs(vx - qx) > 1) continue;
          if (!iguais(d, v * 4, CORES[alvos[cor]])) continue;
          rotulo[v] = caixas.length;
          fila.push(v);
        }
      }
      if (n > 3000) caixas.push({ nome: alvos[cor], minx, maxx, miny, maxy, n });
    }
  }

  caixas
    .sort((a, b) => a.miny - b.miny || a.minx - b.minx)
    .forEach((c) => {
      console.log(
        `  ${c.nome.padEnd(11)} x=${String(c.minx).padStart(4)}..${String(c.maxx).padStart(4)}` +
          `  y=${String(c.miny).padStart(4)}..${String(c.maxy).padStart(4)}` +
          `  (${c.maxx - c.minx}x${c.maxy - c.miny})`,
      );
    });
}

async function main() {
  for (const f of process.argv.slice(2)) await mapa(f);
}
main().catch((e) => { console.error(e); process.exit(1); });
