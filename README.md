# 🎮 Fluxogramas — Nitro Horizon

Documentação visual de **dois sistemas** com fluxogramas:

1. **Sistema escolar** — autenticação, menu principal, funcionalidades e encerramento
2. **Lógica do jogo Nitro Horizon** — início, ações do jogador, decisões, vitória/derrota e encerramento

Jogo: **https://renatinkkjk.github.io/nitro-horizon/**
Código do jogo: **https://github.com/renatinkkjk/nitro-horizon**

---

## 📸 Os fluxogramas em imagem

### 1. Sistema escolar

![Fluxograma do sistema escolar](docs/fluxograma-sistema-escolar.png)

**Arquivo:** [`docs/fluxograma-sistema-escolar.png`](docs/fluxograma-sistema-escolar.png)

### 2. Lógica do jogo (Nitro Horizon)

![Fluxograma da lógica do jogo](docs/fluxograma-jogo.png)

**Arquivo:** [`docs/fluxograma-jogo.png`](docs/fluxograma-jogo.png)

---

## 🔷 Símbolos usados (notação padrão)

| Símbolo | Significado | Onde aparece |
|---|---|---|
| ⭕ **Oval** | Início / Fim | Início do programa, FIM |
| ▭ **Retângulo** | Processo (ação) | Executar uma tarefa |
| ◇ **Losango** | Decisão (condição) | "Credenciais válidas?", "Cruzou a linha?" |
| ▱ **Paralelogramo** | Entrada / saída de dados | Login, escolha do jogador |
| ➡️ **Seta** | Fluxo / caminho | SIM, NÃO, HISTÓRIA... |

---

## 1️⃣ Fluxograma — Sistema escolar

```mermaid
flowchart TD
    A([INÍCIO]) --> B[/Digite usuário e senha/]
    B --> C{Credenciais válidas?}
    C -->|NÃO| D[Mostrar acesso negado]
    D --> B
    C -->|SIM| E[MENU PRINCIPAL]
    E --> F{Escolher módulo}
    F -->|1| G[MATRÍCULA<br/>Cadastrar aluno]
    F -->|2| H[NOTAS<br/>Lançar e consultar]
    F -->|3| I[FINANCEIRO<br/>Emitir boleto]
    G --> R[Retornar ao menu]
    H --> R
    I --> R
    R --> E
    E -->|Sair| J[SAIR<br/>Encerrar sessão]
    J --> L([FIM])

    classDef inicio fill:#ffe6f0,stroke:#c2185b,stroke-width:2px,color:#6a1b3a
    classDef processo fill:#eef2ff,stroke:#3949ab,stroke-width:1.5px,color:#1a237e
    classDef decisao fill:#fff6d6,stroke:#f9a825,stroke-width:1.5px,color:#5d4037
    classDef io fill:#e4fff2,stroke:#00897b,stroke-width:1.5px,color:#004d40
    classDef saida fill:#ede7f6,stroke:#5e35b1,stroke-width:1.5px,color:#311b92

    class A,L inicio
    class B io
    class C,F decisao
    class E,G,H,I,R processo
    class D,J saida
```

**Regras principais**

- A **autenticação** acontece antes de qualquer menu.
- Login inválido → mostra o aviso e **volta** para a tela de entrada.
- Cada módulo (Matrícula, Notas, Financeiro) **devolve** o usuário ao Menu Principal.
- **Só a opção "Sair"** encerra a sessão e chega ao FIM.

### Resumo das etapas

| Etapa | Símbolo | Descrição |
|---|---|---|
| 1 | Oval | Início |
| 2 | Paralelogramo | Entrada: usuário e senha |
| 3 | Losango | Credenciais válidas? |
| 4 | Retângulo | Acesso negado → volta ao login |
| 5 | Retângulo | Menu principal |
| 6 | Losango | Escolher módulo (1, 2 ou 3) |
| 7 | Retângulo | Matrícula / Notas / Financeiro |
| 8 | Retângulo | Retornar ao menu (volta ao passo 5) |
| 9 | Retângulo | Sair → encerrar sessão |
| 10 | Oval | Fim |

---

## 2️⃣ Fluxograma — Lógica do jogo (Nitro Horizon)

```mermaid
flowchart TD
    A([INÍCIO]) --> B[Abrir o jogo<br/>Tela inicial]
    B --> C{Escolher modo}
    C -->|HISTÓRIA| D[Narração da história<br/>Escolher o carro]
    C -->|RÁPIDA| E[/Escolher carro e pista/]
    D --> E
    E --> F[Contagem regressiva<br/>3 - 2 - 1]
    F --> G[CORRIDA<br/>Acelerar · Frear · Nitro ESPAÇO]
    G --> H{Cruzou a linha<br/>de chegada?}
    H -->|SIM| I[VITÓRIA<br/>Mostrar resultado]
    H -->|NÃO| J{Tempo esgotou?}
    J -->|SIM| K[DERROTA<br/>Mostrar resultado]
    J -->|NÃO| G
    I --> L{Modo história?}
    L -->|SIM| M[Somar pontos do campeonato]
    M --> F
    L -->|NÃO| N([FIM])
    K --> N

    classDef inicio fill:#ffe6f0,stroke:#c2185b,stroke-width:2px,color:#6a1b3a
    classDef processo fill:#eef2ff,stroke:#3949ab,stroke-width:1.5px,color:#1a237e
    classDef decisao fill:#fff6d6,stroke:#f9a825,stroke-width:1.5px,color:#5d4037
    classDef io fill:#e4fff2,stroke:#00897b,stroke-width:1.5px,color:#004d40
    classDef corrida fill:#ffe6ee,stroke:#c2185b,stroke-width:2px,color:#880e4f
    classDef resultado fill:#e8f5e9,stroke:#2e7d32,stroke-width:1.5px,color:#1b5e20
    classDef derrota fill:#ffebee,stroke:#c62828,stroke-width:1.5px,color:#b71c1c

    class A,N inicio
    class B,D,F,M processo
    class C,H,J,L decisao
    class E io
    class G corrida
    class I resultado
    class K derrota
```

**Regras principais**

- O jogador escolhe o **modo**, o **carro** e a **pista**.
- Durante a corrida: acelerar, frear, nitro (ESPAÇO) e olhar para trás (R).
- **Cruzou a linha = VITÓRIA.** Tempo esgotou / perdeu demais = **DERROTA**.
- No modo história os pontos somam e o campeonato continua até o fim.

### Resumo das etapas

| Etapa | Símbolo | Descrição |
|---|---|---|
| 1 | Oval | Início |
| 2 | Retângulo | Abrir o jogo (tela inicial) |
| 3 | Losango | Escolher modo (história / rápida) |
| 4 | Retângulo | Narração da história · escolher o carro |
| 5 | Paralelogramo | Escolher carro e pista (entrada) |
| 6 | Retângulo | Contagem regressiva 3-2-1 |
| 7 | Retângulo | Corrida (acelerar, frear, nitro) |
| 8 | Losango | Cruzou a linha de chegada? |
| 9 | Losango | Tempo esgotou? |
| 10 | Retângulo | Vitória (verde) / Derrota (vermelho) |
| 11 | Losango | Modo história? (continuar campeonato) |
| 12 | Oval | Fim |

---

## 🗺️ Mapa detalhado das telas do jogo

O diagrama abaixo detalha **cada tela** do jogo (é a mesma máquina de estados
implementada em `src/game.ts`):

```mermaid
flowchart TD
    A([Início do app]) --> B[TITLE<br/>Menu principal]

    B -->|ENTER · CORRIDA RÁPIDA| C[CAR<br/>Escolher carro]
    B -->|ENTER · MODO HISTÓRIA| D[STORY_INTRO<br/>Narração 1]
    B -->|ENTER · COMO JOGAR| E[HELP<br/>Como jogar]
    B -->|ENTER · OPÇÕES| F[OPTIONS<br/>Volumes]

    D -->|ENTER| D2[STORY_INTRO<br/>Narração 2]
    D2 -->|ENTER| C
    D -->|ESC| B
    D2 -->|ESC| B

    E -->|ENTER / ESC| B
    F -->|ENTER / ESC| B

    C -->|ENTER| G[TRACK<br/>Escolher pista]
    C -->|ESC| B
    G -->|ENTER| H[RACE<br/>Corrida]
    G -->|ESC| C

    H -->|corrida terminou| I[RESULTS<br/>Resultado]
    I -->|ENTER · corrida rápida| B
    I -->|ENTER · história| J[STORY<br/>Classificação parcial]
    J -->|ENTER| H
    J -->|ESC| B
    I -->|fim das 3 rodadas| K[STORY_END<br/>Campeão]
    K -->|ENTER / ESC| B

    style A fill:#3dff8b,stroke:#0b0d17,color:#0b0d17
    style B fill:#22e0ff,stroke:#0b0d17,color:#0b0d17
    style H fill:#ff3d7f,stroke:#0b0d17,color:#fff
    style K fill:#ffd23f,stroke:#0b0d17,color:#0b0d17
```

### Transições

| De | Para | Controle |
|---|---|---|
| `title` | `car` | ENTER (CORRIDA RÁPIDA) |
| `title` | `storyIntro` | ENTER (MODO HISTÓRIA) |
| `title` | `help` | ENTER (COMO JOGAR) |
| `title` | `options` | ENTER (OPÇÕES) |
| `storyIntro` | `storyIntro` | ENTER (avança a narração) |
| `storyIntro` | `car` | ENTER (fim da narração) |
| `car` | `track` | ENTER |
| `car` | `title` | ESC |
| `track` | `race` | ENTER |
| `track` | `car` | ESC |
| `race` | `results` | a corrida termina |
| `results` | `title` | ENTER (corrida rápida) |
| `results` | `story` / `storyEnd` | ENTER (história) |
| `story` | `race` | ENTER (próxima rodada) |
| `story` / `storyEnd` | `title` | ESC |

### Menu de pausa (dentro da corrida)

```mermaid
flowchart LR
    P[PAUSA<br/>ESC / P] --> P1[CONTINUAR]
    P --> P2[REINICIAR CORRIDA]
    P --> P3[SAIR PARA O MENU]
    P --> P4[TELA CHEIA · F]
    P1 --> R[Volta a correr]
    P2 --> R
    P3 --> T[Menu principal]
    P4 --> R
```

### Pontuação do campeonato (modo história)

| 1º | 2º | 3º | 4º | 5º | 6º | 7º | 8º | 9º | 10º |
|---|---|---|---|---|---|---|---|---|---|
| 15 | 12 | 10 | 8 | 6 | 5 | 4 | 3 | 2 | 1 |

### Controles

| Ação | Teclado | Toque |
|---|---|---|
| Direita / esquerda | ← → ou A / D | ◀ ▶ |
| Acelerar | ↑ ou W | **GÁS** |
| Frear | ↓ ou S | **FREIO** |
| Nitro | **ESPAÇO** | **N₂O** |
| Olhar para trás | **R** | **RÉ** |
| Subir / descer marcha | SHIFT / CTRL (ou E / Q) | — |
| Confirmar | **ENTER** | **OK** |
| Voltar / pausar | **ESC** ou **P** | **II** |
| Tela cheia | **F** | **⛶** |

---

## 🛠️ Como as imagens foram geradas

Os dois PNGs são gerados por código (sem editor gráfico) a partir das fontes
Mermaid em [`fluxogramas/`](fluxogramas/), renderizadas pelo **Mermaid CLI**
(`mmdc`) com o Chromium/Edge do próprio sistema:

```bash
npm install       # instala @mermaid-js/mermaid-cli + jimp
npm run gerar     # recria os dois PNGs em docs/
npm run verificar  # confere as caixas/tipos de cada imagem
```

O tema, a fonte (Arial) e o espaçamento dos nós são definidos no próprio
arquivo `.mmd` (diretiva `%%{init ...}%%`), então o resultado é sempre igual.

| Arquivo | O que é |
|---|---|
| `fluxogramas/01-sistema-escolar.mmd` | Fonte do fluxograma do sistema escolar |
| `fluxogramas/02-logica-do-jogo.mmd` | Fonte do fluxograma da lógica do jogo |
| `tools/puppeteer.config.json` | Faz o renderizador usar o Edge do sistema |
| `tools/mapa.cjs` | Verificação: lista as caixas por tipo/cor |
| `tools/thumb.cjs` | Verificação: miniatura em ASCII das imagens |
| `tools/ordem.cjs` | Verificação: ordem horizontal dos nós coloridos |

---

Feito com 🏎️ por [renatinkkjk](https://github.com/renatinkkjk)
