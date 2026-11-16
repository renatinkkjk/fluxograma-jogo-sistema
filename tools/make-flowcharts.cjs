/**
 * Gera os dois fluxogramas do projeto em PNG (Jimp).
 *
 * Símbolos usados (notação padrão de fluxograma):
 *   oval            -> início / fim
 *   retângulo       -> processo (ação)
 *   losango         -> decisão (condição) com caminhos SIM/NÃO
 *   paralelogramo   -> entrada / saída de dados
 *   seta            -> fluxo
 *
 * Uso: node tools/make-flowcharts.cjs
 */
const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'docs');

const C = {
  bg: 0xffffffff,
  ink: 0x1c2340ff,
  fill: 0xeef2ffff,
  fillDec: 0xfff6d6ff,
  fillIo: 0xe4fff2ff,
  fillEnd: 0xffe6f0ff,
  arrow: 0x2a3560ff,
  race: 0xffe6eeff,
};

let F = {};

/** Escreve texto (Jimp 0.22: alinhamento dentro do objeto text). */
function printText(img, font, x, y, text, align = 'left', maxWidth = img.bitmap.width, maxHeight = Infinity) {
  const alignmentX =
    align === 'center'
      ? Jimp.HORIZONTAL_ALIGN_CENTER
      : align === 'right'
        ? Jimp.HORIZONTAL_ALIGN_RIGHT
        : Jimp.HORIZONTAL_ALIGN_LEFT;
  img.print(
    font,
    Math.round(x),
    Math.round(y),
    { text: String(text), alignmentX, alignmentY: Jimp.VERTICAL_ALIGN_TOP },
    maxWidth,
    maxHeight,
  );
}

/** Texto centralizado numa caixa. */
function textIn(img, text, x, y, w, h, font = F.label, lineH = 18) {
  const lines = String(text).split('\n');
  const startY = Math.round(y + h / 2 - ((lines.length - 1) * lineH) / 2);
  lines.forEach((line, i) => {
    printText(img, font, x, startY + i * lineH, line, 'center', w, lineH);
  });
}

/** Retângulo com borda. */
function rect(img, x, y, w, h, fill = C.fill) {
  img.scan(x, y, w, h, (px, py, idx) => {
    const border = px < x + 2 || px >= x + w - 2 || py < y + 2 || py >= y + h - 2;
    const c = border ? C.ink : fill;
    img.bitmap.data[idx] = (c >> 24) & 0xff;
    img.bitmap.data[idx + 1] = (c >> 16) & 0xff;
    img.bitmap.data[idx + 2] = (c >> 8) & 0xff;
    img.bitmap.data[idx + 3] = c & 0xff;
  });
}

/** Oval (terminador: início / fim). */
function oval(img, x, y, w, h, fill = C.fillEnd) {
  const rx = w / 2;
  const ry = h / 2;
  const cx = x + rx;
  const cy = y + ry;
  img.scan(x, y, w, h, (px, py, idx) => {
    const nx = (px + 0.5 - cx) / rx;
    const ny = (py + 0.5 - cy) / ry;
    const d = nx * nx + ny * ny;
    if (d > 1) return;
    const c = d > 0.86 ? C.ink : fill;
    img.bitmap.data[idx] = (c >> 24) & 0xff;
    img.bitmap.data[idx + 1] = (c >> 16) & 0xff;
    img.bitmap.data[idx + 2] = (c >> 8) & 0xff;
    img.bitmap.data[idx + 3] = c & 0xff;
  });
}

/** Losango (decisão). */
function diamond(img, x, y, w, h, fill = C.fillDec) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  img.scan(x, y, w, h, (px, py, idx) => {
    const nx = Math.abs(px + 0.5 - cx) / (w / 2);
    const ny = Math.abs(py + 0.5 - cy) / (h / 2);
    if (nx + ny > 1) return;
    const c = nx + ny > 0.88 ? C.ink : fill;
    img.bitmap.data[idx] = (c >> 24) & 0xff;
    img.bitmap.data[idx + 1] = (c >> 16) & 0xff;
    img.bitmap.data[idx + 2] = (c >> 8) & 0xff;
    img.bitmap.data[idx + 3] = c & 0xff;
  });
}

/** Paralelogramo (entrada / saída). */
function parallel(img, x, y, w, h, fill = C.fillIo) {
  const skew = Math.round(h * 0.35);
  img.scan(x, y, w, h, (px, py, idx) => {
    const inset = Math.round(((h - (py - y)) / h) * skew);
    if (px < x + inset || px >= x + w - (skew - inset)) return;
    const border = px < x + inset + 2 || px >= x + w - (skew - inset) - 2 || py < y + 2 || py >= y + h - 2;
    const c = border ? C.ink : fill;
    img.bitmap.data[idx] = (c >> 24) & 0xff;
    img.bitmap.data[idx + 1] = (c >> 16) & 0xff;
    img.bitmap.data[idx + 2] = (c >> 8) & 0xff;
    img.bitmap.data[idx + 3] = c & 0xff;
  });
}

/** Seta (linha com ponta). */
function arrow(img, x1, y1, x2, y2, label) {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) * 2;
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const px = Math.round(x1 + (x2 - x1) * t);
    const py = Math.round(y1 + (y2 - y1) * t);
    if (px >= 0 && py >= 0 && px < img.bitmap.width && py < img.bitmap.height) {
      const idx = (py * img.bitmap.width + px) * 4;
      img.bitmap.data[idx] = (C.arrow >> 24) & 0xff;
      img.bitmap.data[idx + 1] = (C.arrow >> 16) & 0xff;
      img.bitmap.data[idx + 2] = (C.arrow >> 8) & 0xff;
      img.bitmap.data[idx + 3] = C.arrow & 0xff;
    }
  }
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const size = 13;
  img.scan(Math.round(x2 - size), Math.round(y2 - size), size * 2, size * 2, (px, py, idx) => {
    const vx = px - x2;
    const vy = py - y2;
    const rx = vx * Math.cos(-ang) - vy * Math.sin(-ang);
    const ry = vx * Math.sin(-ang) + vy * Math.cos(-ang);
    if (rx < 0 || ry > size * 0.9) return;
    const c = C.arrow;
    img.bitmap.data[idx] = (c >> 24) & 0xff;
    img.bitmap.data[idx + 1] = (c >> 16) & 0xff;
    img.bitmap.data[idx + 2] = (c >> 8) & 0xff;
    img.bitmap.data[idx + 3] = c & 0xff;
  });
  if (label) {
    printText(img, F.small, (x1 + x2) / 2 + 10, (y1 + y2) / 2 - 8, label, 'left');
  }
}

/** Caminho em L (vertical -> horizontal -> vertical). */
function elbow(img, x1, y1, x2, y2, x3, y3) {
  arrow(img, x1, y1, x2, y2, null);
  arrow(img, x2, y2, x3, y3, null);
}

/** Cabeçalho do quadro. */
function header(img, title, subtitle) {
  printText(img, F.title, 40, 26, title, 'left');
  printText(img, F.small, 40, 72, subtitle, 'left');
  img.scan(40, 96, img.bitmap.width - 80, 2, (x, y, idx) => {
    img.bitmap.data[idx] = 0xc8;
    img.bitmap.data[idx + 1] = 0xd0;
    img.bitmap.data[idx + 2] = 0xe4;
    img.bitmap.data[idx + 3] = 0xff;
  });
}

/** Legenda dos símbolos. */
function legend(img, x, y, w, items) {
  const boxH = 40 + items.length * 26;
  rect(img, x, y, w, boxH, 0xf7f9ffff);
  printText(img, F.label, x + 16, y + 12, 'LEGENDA DOS SIMBOLOS', 'left');
  items.forEach((item, i) => {
    const iy = y + 44 + i * 26;
    const cx = x + 28;
    const cy = iy + 8;
    if (item.type === 'oval') oval(img, cx - 18, cy - 9, 36, 18, C.fillEnd);
    else if (item.type === 'decision') diamond(img, cx - 13, cy - 10, 26, 20, C.fillDec);
    else if (item.type === 'io') parallel(img, cx - 18, cy - 9, 36, 18, C.fillIo);
    else rect(img, cx - 18, cy - 9, 36, 18, C.fill);
    printText(img, F.small, x + 62, iy, item.label, 'left');
  });
}

function bullets(img, x, y, title, lines) {
  printText(img, F.label, x, y, title, 'left');
  lines.forEach((n, i) => {
    printText(img, F.small, x, y + 28 + i * 22, n, 'left');
  });
}

// ------------------------------------------------------------------
// FLUXOGRAMA 1 — SISTEMA ESCOLAR
// ------------------------------------------------------------------
async function flowchartEscolar() {
  const W = 1180;
  const H = 1500;
  const img = new Jimp(W, H, C.bg);
  header(
    img,
    'FLUXOGRAMA - SISTEMA ESCOLAR',
    'Autenticacao · Menu principal · Funcionalidades · Encerramento',
  );

  const spine = 340;
  const right = 800;

  oval(img, spine - 110, 130, 220, 58, C.fillEnd);
  textIn(img, 'INICIO', spine - 110, 130, 220, 58);

  parallel(img, spine - 175, 225, 350, 66, C.fillIo);
  textIn(img, 'Entrar com usuario\ne senha', spine - 175, 225, 350, 66, F.label, 20);

  diamond(img, spine - 165, 335, 330, 150, C.fillDec);
  textIn(img, 'Credenciais\nvalidas?', spine - 140, 355, 280, 110, F.label, 20);

  rect(img, right - 175, 360, 350, 80, C.fill);
  textIn(img, 'Mostrar "acesso negado"\ne pedir novo login', right - 175, 360, 350, 80, F.small, 16);
  arrow(img, spine + 165, 410, right - 175, 400, 'NAO');

  rect(img, spine - 175, 540, 350, 66, C.fill);
  textIn(img, 'MENU PRINCIPAL', spine - 175, 540, 350, 66);

  diamond(img, spine - 180, 650, 360, 160, C.fillDec);
  textIn(img, 'Qual modulo\nescolheu?', spine - 155, 675, 310, 110, F.label, 20);

  const mods = [
    { y: 640, label: '1. MATRICULA\nCadastrar / paginar' },
    { y: 760, label: '2. NOTAS\nLancar / consultar' },
    { y: 880, label: '3. FINANCEIRO\nEmitir boleto / consultar' },
  ];
  mods.forEach((m, i) => {
    rect(img, right - 180, m.y, 360, 76, C.fill);
    textIn(img, m.label, right - 180, m.y, 360, 76, F.small, 16);
    arrow(img, spine + 180, 700 + i * 32, right - 180, m.y + 38, i === 0 ? 'SIM' : null);
    elbow(img, right, m.y + 76, spine + 235, m.y + 76, spine + 235, 573);
    arrow(img, spine + 235, m.y + 76, spine + 235, 573, null);
    arrow(img, spine + 235, 573, spine + 175, 573, null);
  });

  diamond(img, spine - 150, 880, 300, 140, C.fillDec);
  textIn(img, 'Escolheu\n"Sair"?', spine - 130, 900, 260, 100, F.label, 20);
  arrow(img, spine, 810, spine, 880, 'NAO');

  rect(img, spine - 175, 1075, 350, 70, C.fill);
  textIn(img, 'Encerrar sessao\n(logout)', spine - 175, 1075, 350, 70, F.small, 16);
  arrow(img, spine, 1020, spine, 1075, 'SIM');

  oval(img, spine - 110, 1190, 220, 58, C.fillEnd);
  textIn(img, 'FIM', spine - 110, 1190, 220, 58);
  arrow(img, spine, 1145, spine, 1190, null);

  elbow(img, right + 175, 400, right + 175, 258, spine + 175, 258);

  legend(img, 40, 1280, 520, [
    { type: 'oval', label: 'Oval: inicio / fim do programa' },
    { type: 'process', label: 'Retangulo: processo (acao)' },
    { type: 'decision', label: 'Losango: decisao (condicao)' },
    { type: 'io', label: 'Paralelogramo: entrada / saida de dados' },
  ]);

  bullets(img, 600, 1300, 'Regras principais:', [
    '· A autenticacao acontece antes de qualquer menu.',
    '· Login invalido mostra o aviso e volta a tela de entrada.',
    '· Cada modulo devolve o usuario ao Menu Principal.',
    '· Somente a opcao "Sair" encerra a sessao e chega ao FIM.',
  ]);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  await img.writeAsync(path.join(OUT_DIR, 'fluxograma-sistema-escolar.png'));
  console.log('docs/fluxograma-sistema-escolar.png');
}

// ------------------------------------------------------------------
// FLUXOGRAMA 2 — LOGICA DO JOGO (NITRO HORIZON)
// ------------------------------------------------------------------
async function flowchartJogo() {
  const W = 1180;
  const H = 1560;
  const img = new Jimp(W, H, C.bg);
  header(
    img,
    'FLUXOGRAMA - LOGICA DO JOGO NITRO HORIZON',
    'Inicio · Acoes do jogador · Decisoes · Vitoria / Derrota · Encerramento',
  );

  const spine = 330;
  const right = 810;

  oval(img, spine - 110, 130, 220, 58, C.fillEnd);
  textIn(img, 'INICIO', spine - 110, 130, 220, 58);

  rect(img, spine - 175, 225, 350, 66, C.fill);
  textIn(img, 'Carregar o jogo\n(tela inicial)', spine - 175, 225, 350, 66, F.small, 16);

  diamond(img, spine - 170, 330, 340, 150, C.fillDec);
  textIn(img, 'Modo de\njogo?', spine - 145, 350, 290, 110, F.label, 20);

  rect(img, right - 185, 340, 370, 80, C.fill);
  textIn(img, 'MODO HISTORIA\nNarrativa → escolher carro → 3 rodadas', right - 185, 340, 370, 80, F.small, 16);
  arrow(img, spine + 170, 405, right - 185, 380, 'HISTORIA');

  parallel(img, spine - 175, 525, 350, 66, C.fillIo);
  textIn(img, 'Escolher carro e pista', spine - 175, 525, 350, 66);

  rect(img, spine - 170, 635, 340, 62, C.fill);
  textIn(img, 'Contagem regressiva 3-2-1', spine - 170, 635, 340, 62, F.small, 16);

  rect(img, spine - 195, 740, 390, 96, C.race);
  textIn(
    img,
    'CORRIDA\nAcoes: acelerar, frear, nitro (ESPACO),\nolhar para tras (R)',
    spine - 195,
    740,
    390,
    96,
    F.small,
    16,
  );

  diamond(img, spine - 185, 880, 370, 155, C.fillDec);
  textIn(img, 'Cruzou a linha\nde chegada?', spine - 160, 905, 320, 110, F.label, 20);

  diamond(img, right - 180, 890, 360, 155, C.fillDec);
  textIn(img, 'Tempo esgotou /\nperdeu demais?', right - 160, 915, 320, 110, F.label, 20);
  arrow(img, spine + 185, 957, right - 180, 967, 'NAO');

  rect(img, right - 185, 1100, 370, 66, C.fill);
  textIn(img, 'DERROTA\nMostrar resultado', right - 185, 1100, 370, 66, F.small, 16);
  arrow(img, right, 1045, right, 1100, 'SIM');

  elbow(img, right - 180, 967, right - 255, 967, right - 255, 788);
  arrow(img, right - 255, 788, spine + 195, 788, 'NAO');

  rect(img, spine - 175, 1090, 350, 66, C.fill);
  textIn(img, 'VITORIA! Mostrar resultado', spine - 175, 1090, 350, 66, F.small, 16);
  arrow(img, spine, 1035, spine, 1090, 'SIM');

  diamond(img, spine - 165, 1200, 330, 145, C.fillDec);
  textIn(img, 'Modo historia?', spine - 140, 1225, 280, 95, F.label, 20);
  arrow(img, spine, 1156, spine, 1200, null);

  rect(img, right - 185, 1235, 370, 76, C.fill);
  textIn(img, 'Somar pontos do campeonato\n(faltam rodadas?)', right - 185, 1235, 370, 76, F.small, 16);
  arrow(img, spine + 165, 1272, right - 185, 1273, 'SIM');

  oval(img, spine - 110, 1400, 220, 58, C.fillEnd);
  textIn(img, 'FIM', spine - 110, 1400, 220, 58);
  arrow(img, spine, 1345, spine, 1400, 'NAO');
  elbow(img, right + 185, 1273, right + 185, 1400, spine + 110, 1400);

  legend(img, 40, 1270, 520, [
    { type: 'oval', label: 'Oval: inicio / fim do jogo' },
    { type: 'process', label: 'Retangulo: processo (acao)' },
    { type: 'decision', label: 'Losango: decisao do jogo' },
    { type: 'io', label: 'Paralelogramo: acao do jogador' },
  ]);

  bullets(img, 600, 1290, 'Regras principais:', [
    '· O jogador escolhe o modo, o carro e a pista.',
    '· Na corrida: acelerar, frear, nitro e olhar tras.',
    '· Cruzou a linha = VITORIA; tempo esgotou = DERROTA.',
    '· No modo historia os pontos somam e o campeonato continua.',
  ]);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  await img.writeAsync(path.join(OUT_DIR, 'fluxograma-jogo.png'));
  console.log('docs/fluxograma-jogo.png');
}

async function main() {
  F.title = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
  F.label = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
  F.small = await Jimp.loadFont(Jimp.FONT_SANS_12_BLACK);
  F.tiny = await Jimp.loadFont(Jimp.FONT_SANS_10_BLACK);
  await flowchartEscolar();
  await flowchartJogo();
}

main().catch((e) => { console.error(e); process.exit(1); });
