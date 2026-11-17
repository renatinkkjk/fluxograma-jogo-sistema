const Jimp = require('jimp');

const ALVOS = {
  MATRICULA: [0xff, 0x22, 0x22],
  NOTAS: [0x22, 0xcc, 0x44],
  FINANCEIRO: [0x22, 0x66, 0xff],
  SAIR: [0xcc, 0x22, 0xcc],
};

async function main() {
  const img = await Jimp.read(process.argv[2]);
  const { width: W, height: H, data: d } = img.bitmap;
  const res = {};
  for (const k in ALVOS) res[k] = { x0: W, x1: 0, y0: H, y1: 0, n: 0 };
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      const i = (y * W + x) * 4;
      for (const k in ALVOS) {
        const c = ALVOS[k];
        if (Math.abs(d[i] - c[0]) < 12 && Math.abs(d[i + 1] - c[1]) < 12 && Math.abs(d[i + 2] - c[2]) < 12) {
          const r = res[k];
          r.n += 1;
          if (x < r.x0) r.x0 = x;
          if (x > r.x1) r.x1 = x;
          if (y < r.y0) r.y0 = y;
          if (y > r.y1) r.y1 = y;
        }
      }
    }
  }
  console.log('imagem ' + W + 'x' + H);
  const ordem = Object.keys(res)
    .map((k) => ({ k, ...res[k], centro: Math.round((res[k].x0 + res[k].x1) / 2) }))
    .filter((r) => r.n > 500)
    .sort((a, b) => a.centro - b.centro);
  ordem.forEach((r, i) => {
    console.log(
      `  ${i + 1}º lugar  ${r.k.padEnd(11)} x=${r.x0}..${r.x1} centro=${r.centro}  y=${r.y0}..${r.y1}  pixels=${r.n}`,
    );
  });
  console.log('  ordem (esquerda -> direita): ' + ordem.map((r) => r.k).join(' > '));
}

main().catch((e) => { console.error(e); process.exit(1); });
