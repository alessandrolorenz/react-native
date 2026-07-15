# Spec 04 — Pacote “Milagres de Jesus”

Status: implementada com arte final integrada; conteúdo sujeito a revisão bíblica, catequética e de linguagem inclusiva  
Produto: Jogo da Memória  
Tipo: quinto pacote do aplicativo multitema  
Temas anteriores: Santos, Símbolos da Fé, Lugares Bíblicos e Parábolas de Jesus  
Ordem recomendada: implementar depois de “Parábolas de Jesus”

## 1. Visão do produto

“Milagres de Jesus” será uma campanha sobre os sinais e gestos poderosos narrados nos Evangelhos. Cada par apresentará uma cena reconhecível e o perfil explicará o que aconteceu, o que o sinal revela sobre Jesus e onde ler o relato na Bíblia.

O tema não apresentará os milagres como truques ou magia. O centro editorial será o encontro de Jesus com as pessoas, sua compaixão, o convite à confiança e os sinais do Reino de Deus.

## 2. Por que este tema

- reúne relatos conhecidos e muito atraentes para crianças e famílias;
- oferece grande variedade visual: água, barcos, pães, encontros e gestos de cuidado;
- cria uma sequência natural depois de “Parábolas”: palavras e ações de Jesus;
- permite 18 cartas distintas, suficientes para todas as fases;
- acrescenta os quatro Evangelhos aos filtros do aplicativo;
- aprofunda o conteúdo cristológico sem mudar a mecânica do jogo;
- pode ensinar compaixão e esperança quando escrito com cuidado.

Este pacote deverá vir depois de “Parábolas”, porque relatos de doença, deficiência e morte exigem uma revisão editorial mais rigorosa.

## 3. Objetivos

1. Adicionar 18 milagres com cenas visualmente distintas.
2. Apresentar cada acontecimento com fidelidade ao Evangelho e linguagem adequada à idade.
3. Explicar brevemente o que cada sinal revela sobre Jesus.
4. Permitir busca e filtros por tipo, Evangelho e ensinamento.
5. Evitar associações indevidas entre doença, deficiência, pecado e falta de fé.
6. Manter progresso e pontuação independentes dos demais temas.
7. Reutilizar integralmente a arquitetura multitema existente.

## 4. Fora do escopo inicial

- catálogo completo de todos os milagres narrados nos Evangelhos;
- harmonização detalhada de relatos paralelos;
- debates médicos ou explicações naturalistas;
- promessas de cura no presente;
- representações gráficas de doença, ferimentos ou morte;
- milagres fora dos Evangelhos;
- questionários, áudio ou narração;
- regras ou fases exclusivas do tema.

## 5. Experiência do jogador

### 5.1 Cartão do tema

Dados sugeridos:

- Título: “Milagres de Jesus”
- Subtítulo: “Descubra os sinais de amor e esperança!”
- Descrição: “Conheça encontros e sinais que revelam a compaixão e o poder de Jesus.”
- Glifo de capa provisório: `✨`
- Ação da galeria: “✦ Galeria dos Milagres”

Ao chegar a cinco temas, a tela inicial não deverá depender de todos os cartões expandidos. A biblioteca precisa oferecer rolagem clara, destaque do tema selecionado e indicadores independentes de progresso.

### 5.2 Campanha

O tema utilizará as quatro fases compartilhadas:

| Fase | Grade | Pares | Cartas |
| --- | --- | ---: | ---: |
| 1 | 4 × 4 | 8 | 16 |
| 2 | 5 × 4 | 10 | 20 |
| 3 | 6 × 4 | 12 | 24 |
| 4 | 7 × 4 | 14 | 28 |

Os milagres serão sorteados a cada partida. O catálogo inicial terá 18 itens.

### 5.3 Galeria

- Título: “✦ Galeria dos Milagres”
- Busca: “Buscar milagre…”
- Estado vazio: “Nenhum milagre encontrado.”
- Cada cartão exibe a cena principal e seu nome curto.
- A galeria mostra somente os itens deste tema.

### 5.4 Perfil

O perfil deverá apresentar:

- ilustração;
- nome do acontecimento;
- descrição curta;
- Evangelho e tipo de milagre;
- seção “O que aconteceu?”;
- seção “O que este sinal revela?”;
- referência bíblica principal e, quando útil, relatos paralelos.

O texto deve privilegiar a pessoa e o encontro. Uma condição de saúde não pode ser usada como identidade total do personagem.

### 5.5 Conclusão

Conclusão de fase:

- “Você encontrou todos os milagres!”
- revelar um dos acontecimentos da partida;
- mostrar sua mensagem central.

Conclusão da campanha:

- Kicker: “🎉 Sinais descobertos! 🎉”
- Título: “Você conheceu os Milagres de Jesus!”
- Mensagem: “Os sinais de Jesus revelam sua compaixão, convidam à confiança e anunciam vida nova.”
- Seção final: “O que este sinal revela?”
- Ação: voltar ao início.

## 6. Contrato do tema

```js
{
  id: 'miracles',
  title: 'Milagres de Jesus',
  displayTitle: 'dos Milagres de Jesus',
  subtitle: 'Descubra os sinais de amor e esperança!',
  description: 'Conheça encontros e sinais que revelam a compaixão e o poder de Jesus.',
  coverGlyph: '✨',
  items: MIRACLE_ITEMS,
  copy: {
    galleryButton: '✦ Galeria dos Milagres',
    galleryTitle: '✦ Galeria dos Milagres',
    searchPlaceholder: 'Buscar milagre…',
    emptySearch: 'Nenhum milagre encontrado.',
    profileStoryTitle: '✦ O QUE ACONTECEU?',
    factTitle: 'O que este sinal revela?',
    resultSectionTitle: 'Conheça este milagre',
  },
  filters: [
    { key: 'miracleType', label: 'Tipo' },
    { key: 'gospel', label: 'Evangelho' },
    { key: 'teaching', label: 'Mensagem' },
  ],
  profile: {
    metaFields: [
      { key: 'miracleType', label: 'Tipo' },
      { key: 'gospel', label: 'Evangelho' },
      { key: 'teaching', label: 'Mensagem' },
    ],
    tagField: { key: 'references', label: '✦ LEIA NA BÍBLIA' },
  },
  appearance: {
    cardBackGlyph: '✨',
  },
  completion: {
    kicker: '🎉 Sinais descobertos! 🎉',
    title: 'Você conheceu os Milagres de Jesus!',
    message: 'Os sinais de Jesus revelam sua compaixão, convidam à confiança e anunciam vida nova.',
    sectionTitle: () => 'O que este sinal revela?',
    sectionText: (item) => item.fact,
    finalMessage: () => 'Continue caminhando com Jesus e levando esperança a quem encontrar! ✨',
  },
}
```

## 7. Contrato de um milagre

```js
{
  id: 'calming-storm',
  name: 'Jesus Acalma a Tempestade',
  shortDescription: 'Jesus traz paz em meio ao vento e às ondas.',
  image: require('../../../assets/miracles/03-calming-storm.png'),
  story: [
    'Jesus atravessava o lago com os discípulos quando uma forte tempestade começou.',
    'Eles ficaram com medo e pediram ajuda. Jesus acalmou o vento e o mar.',
    'O relato convida os discípulos a confiar nele mesmo nos momentos difíceis.',
  ],
  fact: 'O sinal revela a autoridade de Jesus e sua presença junto dos discípulos amedrontados.',
  metadata: {
    miracleType: 'Natureza',
    gospel: 'Marcos',
    teaching: 'Confiança',
    references: ['Marcos 4,35–41'],
  },
}
```

Campos obrigatórios:

- `id`;
- `name`;
- `shortDescription`;
- `image` ou representação visual provisória;
- `story`;
- `fact`;
- `metadata.miracleType`;
- `metadata.gospel`;
- `metadata.teaching`;
- `metadata.references`.

## 8. Catálogo inicial

| ID | Milagre | Tipo | Referência principal | Elemento visual distintivo |
| --- | --- | --- | --- | --- |
| `water-into-wine` | Água Transformada em Vinho em Caná | Providência | Jo 2,1–11 | seis jarros e festa de casamento |
| `miraculous-catch` | Pesca Milagrosa | Providência | Lc 5,1–11 | barco e rede cheia de peixes |
| `calming-storm` | Jesus Acalma a Tempestade | Natureza | Mc 4,35–41 | barco entre ondas que se acalmam |
| `multiplication-loaves` | Multiplicação dos Pães | Providência | Jo 6,1–15 | cinco pães, dois peixes e multidão |
| `walking-on-water` | Jesus Caminha sobre as Águas | Natureza | Mt 14,22–33 | Jesus sobre o lago junto ao barco |
| `paralytic` | Cura do Homem Levado pelos Amigos | Cura | Mc 2,1–12 | maca descendo pelo teto |
| `man-born-blind` | Cura do Homem que Não Enxergava desde o Nascimento | Cura | Jo 9,1–12 | encontro junto ao tanque e luz |
| `leper-cleansed` | Jesus Acolhe e Cura um Homem com Lepra | Cura | Mt 8,1–4 | gesto respeitoso de proximidade |
| `centurion-servant` | Cura do Servo do Centurião | Cura | Mt 8,5–13 | centurião conversando com Jesus |
| `woman-healed` | Cura da Mulher que Tocou o Manto de Jesus | Cura | Mc 5,25–34 | mão tocando a borda do manto |
| `jairus-daughter` | Filha de Jairo Volta à Vida | Vida restaurada | Mc 5,21–43 | Jesus segurando a mão da menina |
| `lazarus` | Lázaro Volta à Vida | Vida restaurada | Jo 11,1–44 | Lázaro saindo do túmulo para a luz |
| `deaf-man` | Cura de um Homem que Não Ouvia Bem | Cura | Mc 7,31–37 | gesto de atenção e diálogo |
| `ten-lepers` | Cura dos Dez Homens com Lepra | Cura | Lc 17,11–19 | dez viajantes e um que retorna agradecido |
| `widow-nain-son` | Filho da Viúva de Naim Volta à Vida | Vida restaurada | Lc 7,11–17 | mãe e filho reunidos diante da cidade |
| `peters-mother-in-law` | Cura da Sogra de Pedro | Cura | Mt 8,14–15 | mulher levantando-se para acolher |
| `withered-hand` | Cura do Homem com a Mão Paralisada | Cura | Mc 3,1–6 | mão estendida em uma sinagoga |
| `coin-in-fish` | A Moeda Encontrada no Peixe | Providência | Mt 17,24–27 | peixe, moeda e anzol |

## 9. Sistema de filtros

### 9.1 Tipo

Valores sugeridos:

- Cura;
- Natureza;
- Providência;
- Vida restaurada.

“Vida restaurada” diferencia os relatos em que alguém volta à vida das curas de enfermidades. “Providência” reúne alimento e recursos para evitar um filtro com apenas um item.

### 9.2 Evangelho

Valores iniciais:

- Mateus;
- Marcos;
- Lucas;
- João.

Quando um acontecimento aparece em mais de um Evangelho, o filtro usará o relato principal adotado para o conteúdo. Os paralelos poderão aparecer em `references`.

### 9.3 Mensagem

Valores sugeridos:

- Compaixão;
- Confiança;
- Gratidão;
- Partilha;
- Vida nova;
- Fé.

Cada item receberá uma mensagem principal, embora o perfil possa mencionar outros aspectos do relato.

## 10. Direção editorial

Público principal: crianças e famílias.

Cada milagre deve ter:

- descrição curta de 5 a 12 palavras;
- dois ou três parágrafos simples em `story`;
- uma frase sobre o que o sinal revela;
- referência principal e, quando úteis, relatos paralelos;
- linguagem respeitosa e centrada na pessoa;
- tom de esperança sem promessas indevidas.

### 10.1 Regras de precisão e cuidado

- Não apresentar milagre como truque, mágica ou recompensa automática por bom comportamento.
- Não afirmar que doença ou deficiência é causada por pecado. O relato do homem que não enxergava desde o nascimento rejeita essa associação.
- Não sugerir que uma pessoa permanece doente hoje por ter pouca fé.
- Não definir personagens somente por sua condição; preferir “homem que não enxergava” a rótulos, sem impedir o uso de títulos bíblicos conhecidos quando necessário para busca.
- Não tratar deficiência como falta de valor, dignidade ou plenitude humana.
- Manter o foco na compaixão, na dignidade do encontro e no sinal revelado.
- Distinguir cura, libertação e retorno à vida; não fundir relatos diferentes.
- Nos relatos da filha de Jairo, de Lázaro e do filho da viúva de Naim, evitar detalhes de morte e luto que assustem crianças pequenas.
- Na multiplicação dos pães, preservar tanto a ação de Jesus quanto a dimensão de partilha e abundância, sem reduzir o relato a uma lição genérica.
- Em Caná, falar da alegria da festa e do primeiro sinal; a arte não deve destacar consumo de bebida.
- Escolher um Evangelho principal para cada item e conferir cuidadosamente nomes, quantidades e sequência dos fatos.

### 10.2 Referências editoriais iniciais

Fontes prioritárias:

- Evangelhos na tradução católica adotada pelo projeto;
- Catecismo da Igreja Católica para o sentido dos sinais de Jesus;
- orientação de pastoral inclusiva para linguagem sobre deficiência e saúde;
- revisão bíblica e catequética antes da publicação.

Passagens-base para o catálogo incluem [João 2](https://bible.usccb.org/bible/john/2), [João 6](https://bible.usccb.org/bible/john/6), [Mateus 8](https://bible.usccb.org/bible/matthew/8), [Marcos 5](https://bible.usccb.org/bible/mark/5), [João 9](https://bible.usccb.org/bible/john/9) e [João 11](https://bible.usccb.org/bible/john/11).

## 11. Direção visual

O estilo deverá comunicar cuidado, surpresa e esperança — nunca espetáculo ou sofrimento.

Regras gerais:

- mostrar o momento do encontro ou da restauração, não sintomas;
- usar expressões serenas e gestos respeitosos;
- não usar feridas, sangue, corpos sem vida ou imagens médicas;
- evitar brilhos exagerados que façam o milagre parecer feitiço;
- usar luz com moderação para destacar Jesus e a mudança da cena;
- distinguir água, alimento, cura e vida restaurada por composição e paleta;
- evitar texto dentro das cartas;
- avaliar cada imagem no tamanho mínimo da fase 4.

### 11.1 Grupos visuais

- Natureza: barco, ondas, céu e movimento amplo.
- Providência: pão, peixe, jarros, redes e gestos de partilha.
- Cura: encontro próximo, mãos, olhar e acolhimento.
- Vida restaurada: reencontro familiar, luz suave e alegria, sem dramatização da morte.

## 12. Estrutura técnica

```text
src/themes/miracles/
  config.js
  items.js

assets/miracles/
  01-water-into-wine.png
  02-miraculous-catch.png
  ...
  18-coin-in-fish.png
```

Mudanças esperadas:

1. Criar `MIRACLE_ITEMS` com 18 entradas.
2. Criar `miraclesTheme` seguindo o contrato existente.
3. Registrar o tema em `src/themes/index.js` depois de “Parábolas de Jesus”.
4. Reutilizar telas, baralho, reducer, pontuação e modais genéricos.
5. Garantir que `references` apareça pelo `tagField` do perfil.
6. Reutilizar a biblioteca responsiva de temas criada para Parábolas.
7. Adicionar imagens estáticas por `require()` quando a arte final estiver disponível.

Não deve ser necessário alterar as regras do jogo nem adicionar condicionais específicas para milagres.

## 13. Ordem de implementação

1. Concluir e estabilizar o pacote “Parábolas de Jesus”.
2. Aprovar o catálogo, os títulos e a referência editorial de cada milagre.
3. Definir valores exatos dos filtros.
4. Escrever o conteúdo provisório.
5. Fazer revisão bíblica, catequética e de linguagem inclusiva.
6. Criar configuração e itens do tema.
7. Adicionar glifos ou placeholders provisórios.
8. Produzir as 18 ilustrações finais.
9. Testar busca, filtros, perfis e quatro fases.
10. Validar Android e iOS.

## 14. Critérios de aceite

- “Milagres de Jesus” aparece como quinto tema.
- O pacote contém exatamente 18 itens na primeira versão.
- Todos os itens possuem nome, descrição, relato, mensagem e referência.
- Busca e os três filtros funcionam corretamente.
- As referências aparecem no perfil.
- As quatro fases podem ser concluídas.
- Pontuação e progresso são independentes dos demais temas.
- As telas genéricas não recebem condicionais específicas para milagres.
- A biblioteca inicial continua clara e responsiva com cinco temas.
- As imagens são respeitosas e distinguíveis na fase 4.
- O bundle Android e o bundle iOS incluem todas as imagens.
- O conteúdo recebe revisão bíblica, catequética e de linguagem inclusiva antes da publicação.

## 15. Riscos e cuidados

- Muitas curas podem parecer visualmente iguais; cada cena precisa de composição própria.
- Linguagem descuidada pode reforçar estigmas sobre deficiência, doença ou fé.
- Relatos paralelos possuem diferenças de detalhe; cada item precisa de uma fonte principal.
- Cenas de retorno à vida podem assustar; a arte deve mostrar reencontro e esperança.
- Brilhos e efeitos excessivos podem transformar sinais em espetáculo mágico.
- O tema precisa revelar quem é Jesus, e não apenas colecionar acontecimentos extraordinários.

## 16. Resultado esperado

Depois de “Parábolas de Jesus”, o aplicativo ganhará uma campanha complementar sobre as ações e os sinais de Jesus. Juntos, os dois pacotes formarão uma dupla coerente: aquilo que Jesus ensinou e aquilo que Jesus realizou, mantendo a experiência leve, educativa e apropriada para famílias.
