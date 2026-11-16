const Jimp = require('jimp');
const path = require('path');

function hex(idx, d) {
  return '#' + [d[idx], d[idx + 1], d[idx + 2]].map((v) => v.toString(16).padStart(2, '0')).join('');
}

async function check(file, probes) {
  const img = await Jimp.read(path.join(__dirname, '..', 'docs', file));
  const d = img.bitmap.data;
  console.log('===', file, img.bitmap.width + 'x' + img.bitmap.height);
  for (const p of probes) {
    const idx = (p.y * img.bitmap.width + p.x) * 4;
    const alpha = d[idx + 3];
    console.log('  ', p.nome.padEnd(26), hex(idx, d), 'alpha=' + alpha);
  }
  // contagem de cores das bordas (linhas escuras = formas desenhadas)
  let dark = 0;
  let pink = 0;
  let yellow = 0;
  let cyan = 0;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    if (r < 60 && g < 70 && b < 90) dark += 1;
    if (r > 200 && g < 120 && b > 150) pink += 1;
    if (r > 240 && g > 230 && b < 160) yellow += 1;
    if (r < 220 && g > 220 && b > 240) cyan += 1;
  }
  console.log('   pixels escuros (bordas):', dark, '| rosa (terminadores):', pink, '| amarelo (decisoes):', yellow, '| ciano (entrada/saida):', cyan);
}

async function main() {
  await check('fluxograma-sistema-escolar.png', [
    { nome: 'titulo', x: 45, y: 30 },
    { nome: 'oval INICIO (centro)', x: 340, y: 159 },
    { nome: 'paralelogramo login', x: 340, y: 250 },
    { nome: 'losango credenciais', x: 340, y: 360 },
    { nome: 'retangulo menu', x: 340, y: 570 },
    { nome: 'modulo matricula', x: 800, y: 670 },
    { nome: 'losango sair', x: 340, y: 930 },
    { nome: 'oval FIM (centro)', x: 340, y: 1219 },
    { nome: 'legenda (vazio)', x: 300, y: 1440 },
  ]);
  await check('fluxograma-jogo.png', [
    { nome: 'titulo', x: 45, y: 30 },
    { nome: 'oval INICIO', x: 330, y: 159 },
    { nome: 'losango modo', x: 330, y: 350 },
    { nome: 'paralelogramo acao', x: 330, y: 555 },
    { nome: 'bloco CORRIDA', x: 330, y: 785 },
    { nome: 'losango chegada', x: 330, y: 900 },
    { nome: 'losango derrota', x: 810, y: 915 },
    { nome: 'bloco vitoria', x: 330, y: 1120 },
    { nome: 'oval FIM', x: 330, y: 1429 },
  ]);
}

main().catch((e) => { console.error(e); process.exit(1); });
