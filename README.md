# Jogo da Memória

Aplicativo católico infantil de jogo da memória, construído com **React Native + Expo**. Um único motor oferece campanhas temáticas com fases, pontuação, galeria educativa e perfis de conteúdo.

Temas disponíveis:

- **Santos** — histórias, curiosidades e oração final;
- **Símbolos da Fé** — 18 sinais presentes na Bíblia, na oração e na liturgia;
- **Lugares Bíblicos** — 18 cidades, montes, águas e regiões da história da salvação;
- **Parábolas de Jesus** — 18 histórias sobre o Reino, a misericórdia e a vida cristã;
- **Milagres de Jesus** — 18 sinais de compaixão, confiança e vida nova.

## Execução local

```bash
npm install
npx expo start
```

Depois disso:

- pressione `a` para o emulador Android;
- pressione `i` para o simulador iOS;
- pressione `w` para web;
- ou leia o QR code com o Expo Go.

## Arquitetura

```text
App.js                         navegação simples, tema ativo e progresso por tema
src/
  components/
    Card.js                    carta genérica com animação de virada
    GameBoard.js               tabuleiro responsivo às fases
    ItemArtwork.js             imagem ou glifo provisório do item
    GalleryTile.js             item genérico da galeria
    ResultModal.js             conclusão de fase configurável
    CampaignCompleteModal.js   conclusão de campanha configurável
  screens/
    HomeScreen.js              seleção de temas
    GameScreen.js              reducer e regras compartilhadas
    GalleryScreen.js           busca e filtros fornecidos pelo tema
    ItemProfileScreen.js       perfil configurável de qualquer item
  themes/
    index.js                   registro e validação dos temas
    saints/                    adaptador do conteúdo original dos santos
    symbols/                   configuração e conteúdo dos símbolos
    biblical-places/           configuração e conteúdo dos lugares bíblicos
  data/
    saints.js                  fonte editorial do pacote Santos
    prayers.js                 orações do pacote Santos
    phases.js                  quatro fases compartilhadas
  utils/
    deck.js                    formação genérica do baralho
    itemFilters.js             busca e filtros sobre metadados
    scoring.js                 regras de pontuação
```

O motor não importa conteúdo religioso diretamente. `App.js` seleciona um tema do registro e injeta seus itens e textos nas telas.

## Campanha

Cada tema usa as quatro fases atuais:

| Fase | Grade | Pares |
| --- | --- | ---: |
| 1 | 4 × 4 | 8 |
| 2 | 5 × 4 | 10 |
| 3 | 6 × 4 | 12 |
| 4 | 7 × 4 | 14 |

Por isso, todo tema precisa fornecer pelo menos 14 itens. A validação em `src/themes/index.js` interrompe a renderização com uma mensagem clara quando o contrato não é atendido.

## Adicionando um tema

1. Crie `src/themes/<id>/items.js` com pelo menos 14 itens.
2. Crie `src/themes/<id>/config.js` com textos, filtros, perfil e conclusão.
3. Registre a configuração em `src/themes/index.js`.
4. Teste busca, filtros, as quatro fases e a conclusão da campanha.

Um item pode usar uma imagem estática ou um glifo provisório:

```js
{
  id: 'dove',
  name: 'Pomba',
  shortDescription: 'Um sinal que recorda o Espírito Santo.',
  image: require('../../../assets/themes/symbols/dove.webp'),
  // ou: visual: { glyph: '🕊', backgroundColor: '#DCECF6' },
  story: ['...'],
  fact: '...',
  metadata: {
    category: 'Espírito Santo',
    context: 'Bíblia e sacramentos',
  },
}
```

Imagens locais devem continuar usando `require()` estático para serem incluídas pelo Metro.

## Conteúdo e arte dos santos

As ilustrações ficam em `assets/saints/`. Para acrescentar um santo:

1. adicione a imagem ao diretório;
2. acrescente a entrada correspondente em `src/data/saints.js`;
3. opcionalmente, acrescente sua oração em `src/data/prayers.js`.

Para regenerar os placeholders existentes:

```bash
npm run generate:placeholders
```

## Escopo atual

- progresso separado por tema, mantido apenas em memória;
- sem backend, autenticação ou analytics;
- sem compras ou download remoto de temas;
- animações com `Animated` e `useNativeDriver: true`;
- estado do jogo em um único `useReducer`;
- cartas memorizadas com `React.memo`.

Especificações:

- [`docs/SPEC_MULTI_THEME_SYMBOLS.md`](docs/SPEC_MULTI_THEME_SYMBOLS.md)
- [`docs/SPEC_THEME_BIBLICAL_PLACES.md`](docs/SPEC_THEME_BIBLICAL_PLACES.md)
