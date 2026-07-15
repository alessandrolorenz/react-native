# Spec 03 — Pacote “Parábolas de Jesus”

Status: implementada com arte final integrada; conteúdo sujeito a revisão bíblica e catequética  
Produto: Jogo da Memória  
Tipo: quarto pacote do aplicativo multitema  
Temas anteriores: Santos, Símbolos da Fé e Lugares Bíblicos  
Ordem recomendada: implementar antes de “Milagres de Jesus”

## 1. Visão do produto

“Parábolas de Jesus” será um tema sobre histórias breves usadas por Jesus para ensinar. O jogador reconhecerá personagens, objetos, animais e cenas marcantes e, ao encontrar os pares, descobrirá o ensinamento central e onde ler a parábola na Bíblia.

O pacote reutilizará integralmente o motor existente de campanha, pontuação, galeria e perfis. Seu tom será alegre, acolhedor e contemplativo, adequado para crianças e famílias.

## 2. Por que este deve ser o próximo tema

- possui muitas narrativas conhecidas e pelo menos 18 imagens claramente distinguíveis;
- é leve e educativo, sem depender de descrições de sofrimento;
- combina pessoas, animais, natureza, alimentos e objetos, criando boa variedade visual;
- complementa “Lugares Bíblicos”: o jogador passa do cenário para os ensinamentos de Jesus;
- permite textos curtos com uma mensagem central fácil de recordar;
- aproveita toda a arquitetura multitema sem alterar as regras do jogo;
- tem menos riscos editoriais que “Milagres de Jesus”, sendo a melhor quarta campanha.

## 3. Objetivos

1. Adicionar 18 parábolas com identidade visual própria.
2. Apresentar uma mensagem central fiel ao texto bíblico e compreensível para crianças.
3. Exibir a referência bíblica principal de cada parábola.
4. Permitir busca e filtros por Evangelho, ensinamento e elemento visual.
5. Manter progresso e pontuação independentes dos demais temas.
6. Validar que o perfil genérico também funciona para narrativas e ensinamentos.
7. Preparar a biblioteca de temas para receber uma quarta opção sem poluir a tela inicial.

## 4. Fora do escopo inicial

- reproduzir integralmente o texto bíblico;
- comentários exegéticos extensos;
- comparar versões da mesma parábola entre os Evangelhos;
- questionários, áudio ou narração;
- animações exclusivas para cada história;
- novas regras de pontuação ou fases;
- conteúdo remoto;
- definir uma interpretação única para todos os detalhes simbólicos.

## 5. Experiência do jogador

### 5.1 Cartão do tema

Dados sugeridos:

- Título: “Parábolas de Jesus”
- Subtítulo: “Descubra as histórias que Jesus contou!”
- Descrição: “Encontre cenas e ensinamentos sobre o Reino, a misericórdia e o amor.”
- Glifo de capa provisório: `🌱`
- Ação da galeria: “✦ Galeria das Parábolas”

Como este será o quarto tema, a tela inicial deverá apresentar os pacotes em uma lista ou carrossel vertical compacto. O tema selecionado pode continuar expandido, mas os quatro cartões precisam ser acessíveis em telas pequenas sem sobreposição.

### 5.2 Campanha

O tema utilizará as quatro fases compartilhadas:

| Fase | Grade | Pares | Cartas |
| --- | --- | ---: | ---: |
| 1 | 4 × 4 | 8 | 16 |
| 2 | 5 × 4 | 10 | 20 |
| 3 | 6 × 4 | 12 | 24 |
| 4 | 7 × 4 | 14 | 28 |

As parábolas serão sorteadas a cada partida. O catálogo de 18 itens oferece quatro alternativas além das 14 necessárias na fase final.

### 5.3 Galeria

- Título: “✦ Galeria das Parábolas”
- Busca: “Buscar parábola…”
- Estado vazio: “Nenhuma parábola encontrada.”
- Cada cartão exibe a cena principal e o nome curto da parábola.
- A galeria mostra somente os itens deste tema.

### 5.4 Perfil

O perfil deverá apresentar:

- ilustração;
- nome da parábola;
- descrição curta;
- Evangelho e tema principal;
- seção “O que Jesus ensina?”;
- seção “Para recordar”;
- referência bíblica em chip.

O perfil não deverá transformar a parábola em uma simples fábula. O texto deve deixar claro que se trata de um ensinamento de Jesus e preservar sua relação com o Reino de Deus.

### 5.5 Conclusão

Conclusão de fase:

- “Você encontrou todas as parábolas!”
- revelar uma das parábolas da partida;
- mostrar seu ensinamento central.

Conclusão da campanha:

- Kicker: “🎉 Ensinamentos descobertos! 🎉”
- Título: “Você conheceu as Parábolas de Jesus!”
- Mensagem: “As histórias de Jesus nos convidam a amar, confiar e colocar sua Palavra em prática.”
- Seção final: “Para recordar”
- Ação: voltar ao início.

## 6. Contrato do tema

```js
{
  id: 'parables',
  title: 'Parábolas de Jesus',
  displayTitle: 'das Parábolas de Jesus',
  subtitle: 'Descubra as histórias que Jesus contou!',
  description: 'Encontre cenas e ensinamentos sobre o Reino, a misericórdia e o amor.',
  coverGlyph: '🌱',
  items: PARABLE_ITEMS,
  copy: {
    galleryButton: '✦ Galeria das Parábolas',
    galleryTitle: '✦ Galeria das Parábolas',
    searchPlaceholder: 'Buscar parábola…',
    emptySearch: 'Nenhuma parábola encontrada.',
    profileStoryTitle: '✦ O QUE JESUS ENSINA?',
    factTitle: 'Para recordar',
    resultSectionTitle: 'Conheça esta parábola',
  },
  filters: [
    { key: 'gospel', label: 'Evangelho' },
    { key: 'teaching', label: 'Ensinamento' },
    { key: 'mainElement', label: 'Elemento' },
  ],
  profile: {
    metaFields: [
      { key: 'gospel', label: 'Evangelho' },
      { key: 'teaching', label: 'Ensinamento' },
      { key: 'mainElement', label: 'Elemento' },
    ],
    tagField: { key: 'references', label: '✦ LEIA NA BÍBLIA' },
  },
  appearance: {
    cardBackGlyph: '🌱',
  },
  completion: {
    kicker: '🎉 Ensinamentos descobertos! 🎉',
    title: 'Você conheceu as Parábolas de Jesus!',
    message: 'As histórias de Jesus nos convidam a amar, confiar e colocar sua Palavra em prática.',
    sectionTitle: () => 'Para recordar',
    sectionText: (item) => item.fact,
    finalMessage: () => 'Continue ouvindo Jesus e fazendo o bem com alegria! ✨',
  },
}
```

## 7. Contrato de uma parábola

```js
{
  id: 'good-samaritan',
  name: 'O Bom Samaritano',
  shortDescription: 'Um viajante escolhe cuidar de quem precisava.',
  image: require('../../../assets/parables/01-good-samaritan.png'),
  story: [
    'Jesus contou sobre um homem ferido que foi encontrado no caminho.',
    'Um samaritano se aproximou, cuidou dele e garantiu que estivesse seguro.',
    'Jesus nos ensina a ser próximos de toda pessoa que precisa de ajuda.',
  ],
  fact: 'O amor ao próximo aparece em atitudes concretas de cuidado e misericórdia.',
  metadata: {
    gospel: 'Lucas',
    teaching: 'Misericórdia',
    mainElement: 'Pessoa',
    references: ['Lucas 10,25–37'],
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
- `metadata.gospel`;
- `metadata.teaching`;
- `metadata.mainElement`;
- `metadata.references`.

## 8. Catálogo inicial

| ID | Parábola | Ensinamento principal | Referência | Elemento visual distintivo |
| --- | --- | --- | --- | --- |
| `good-samaritan` | Bom Samaritano | misericórdia e amor ao próximo | Lc 10,25–37 | viajante ajudando junto ao caminho |
| `merciful-father` | Pai Misericordioso | perdão e alegria pelo reencontro | Lc 15,11–32 | pai abraçando o filho |
| `sower` | Semeador | acolher e fazer frutificar a Palavra | Mt 13,1–23 | sementes em quatro tipos de solo |
| `lost-sheep` | Ovelha Perdida | Deus procura e acolhe quem se perdeu | Lc 15,1–7 | pastor com uma ovelha |
| `lost-coin` | Moeda Perdida | alegria por reencontrar o que estava perdido | Lc 15,8–10 | lamparina, vassoura e moeda |
| `mustard-seed` | Grão de Mostarda | o Reino começa pequeno e cresce | Mt 13,31–32 | pequena semente e grande arbusto |
| `leaven` | Fermento na Massa | o Reino transforma por dentro | Mt 13,33 | mulher preparando pão |
| `hidden-treasure` | Tesouro Escondido | a alegria de escolher o Reino | Mt 13,44 | baú encontrado no campo |
| `precious-pearl` | Pérola Preciosa | reconhecer o valor do Reino | Mt 13,45–46 | mercador segurando uma pérola |
| `house-on-rock` | Casa sobre a Rocha | ouvir e praticar a Palavra | Mt 7,24–27 | duas casas sob chuva e vento |
| `talents` | Talentos | usar com responsabilidade os dons recebidos | Mt 25,14–30 | moedas confiadas a servos |
| `ten-virgins` | Dez Jovens com Lamparinas | vigilância e preparação | Mt 25,1–13 | lamparinas acesas e apagadas |
| `pharisee-tax-collector` | Fariseu e Cobrador de Impostos | oração humilde | Lc 18,9–14 | duas pessoas rezando no templo |
| `rich-fool` | Rico Insensato | a vida vale mais que acumular riquezas | Lc 12,13–21 | celeiros cheios de grãos |
| `watchful-servants` | Servos Vigilantes | estar pronto para fazer o bem | Lc 12,35–48 | servos com luzes acesas |
| `great-banquet` | Grande Banquete | o convite de Deus alcança a todos | Lc 14,15–24 | mesa preparada e convidados chegando |
| `wheat-weeds` | Trigo e Joio | paciência, discernimento e esperança | Mt 13,24–30.36–43 | trigo e ervas crescendo juntos |
| `fishing-net` | Rede Lançada ao Mar | escolhas e plenitude do Reino | Mt 13,47–50 | rede cheia de peixes |

## 9. Sistema de filtros

### 9.1 Evangelho

Valores iniciais:

- Mateus;
- Lucas.

O valor indica a referência editorial principal adotada pelo item. O catálogo inicial não deverá exibir opções vazias apenas para representar os quatro Evangelhos.

### 9.2 Ensinamento

Valores sugeridos:

- Misericórdia;
- Reino de Deus;
- Palavra em prática;
- Oração e humildade;
- Responsabilidade;
- Vigilância.

Cada item terá um único ensinamento principal para permanecer compatível com o filtro exato atual. Outros aspectos podem aparecer no texto do perfil.

### 9.3 Elemento

Valores sugeridos:

- Pessoa;
- Animal;
- Natureza;
- Objeto;
- Alimento.

O elemento deve corresponder ao foco visual da carta, e não a todos os elementos mencionados na parábola.

## 10. Direção editorial

Público principal: crianças e famílias.

Cada parábola deve ter:

- descrição curta de 5 a 12 palavras;
- dois ou três parágrafos simples em `story`;
- ensinamento final em uma ou duas frases;
- referência bíblica principal;
- título conhecido em português e coerente com a tradução católica adotada;
- linguagem concreta e acolhedora.

### 10.1 Regras de precisão e cuidado

- Basear a explicação no conjunto da parábola, sem atribuir significado arbitrário a cada objeto.
- Não reduzir o ensinamento a “ser bonzinho”; conservar sua relação com Deus, o Reino e a conversão.
- Distinguir o ensinamento de Jesus de uma curiosidade histórica ou moral genérica.
- Na parábola do Pai Misericordioso, não caricaturar nenhum dos filhos; o centro é o amor do pai que acolhe e convida.
- Em “Trigo e Joio”, “Rede”, “Dez Jovens” e “Talentos”, falar de escolhas, responsabilidade e preparação sem imagens assustadoras.
- Em “Talentos”, explicar que o nome da parábola se refere originalmente a uma medida de dinheiro; a aplicação aos dons deve ser apresentada como ensinamento, não como tradução literal.
- Não representar grupos religiosos ou povos como vilões.
- Quando houver paralelos em outro Evangelho, adotar uma referência principal e listar paralelos somente se ajudarem a leitura.

### 10.2 Referências editoriais iniciais

Fontes prioritárias:

- Evangelhos na tradução católica adotada pelo projeto;
- notas bíblicas e Catecismo da Igreja Católica quando ajudarem a esclarecer o ensinamento;
- revisão catequética antes da publicação.

Passagens-base para o catálogo incluem [Mateus 13](https://bible.usccb.org/bible/matthew/13), [Lucas 10](https://bible.usccb.org/bible/luke/10), [Lucas 15](https://bible.usccb.org/bible/luke/15) e [Mateus 25](https://bible.usccb.org/bible/matthew/25).

## 11. Direção visual

O estilo deverá ser infantil, suave, luminoso e narrativo.

Regras gerais:

- usar uma única ação principal por imagem;
- manter o elemento decisivo grande e legível no centro;
- evitar texto, números e detalhes pequenos nas cartas;
- variar cenário, silhueta e cor dominante;
- representar personagens com dignidade e diversidade;
- evitar caricaturas culturais ou religiosas;
- evitar fogo ameaçador, punições e sofrimento gráfico;
- avaliar toda arte no menor tamanho usado pela fase 4.

### 11.1 Grupos visuais

- Misericórdia: gestos de abraço, procura, cuidado e acolhida.
- Reino de Deus: sementes, árvore, pão, tesouro, pérola e rede.
- Responsabilidade: moedas, celeiros, lamparinas e portas.
- Palavra em prática: semeadura, construção e caminhos.
- Oração: composição calma, luz e postura humilde.

## 12. Estrutura técnica

```text
src/themes/parables/
  config.js
  items.js

assets/parables/
  01-good-samaritan.png
  02-merciful-father.png
  ...
  18-fishing-net.png
```

Mudanças esperadas:

1. Criar `PARABLE_ITEMS` com 18 entradas.
2. Criar `parablesTheme` seguindo o contrato existente.
3. Registrar o tema em `src/themes/index.js` depois de “Lugares Bíblicos”.
4. Reutilizar telas, baralho, reducer, pontuação e modais genéricos.
5. Garantir que `references` apareça pelo `tagField` do perfil.
6. Ajustar a seleção inicial para comportar quatro temas de modo responsivo.
7. Adicionar imagens estáticas por `require()` quando a arte final estiver disponível.

Não deve ser necessário criar condicionais específicas para parábolas nas telas compartilhadas.

## 13. Ordem de implementação

1. Aprovar o catálogo e a nomenclatura das 18 parábolas.
2. Definir os valores exatos dos três filtros.
3. Escrever descrições, histórias, mensagens e referências provisórias.
4. Realizar revisão bíblica e catequética.
5. Criar configuração e itens do tema.
6. Adaptar a biblioteca de temas da tela inicial para quatro pacotes.
7. Adicionar glifos ou placeholders provisórios.
8. Produzir e inserir as 18 ilustrações finais.
9. Testar busca, filtros, perfis e quatro fases.
10. Validar Android e iOS.

## 14. Critérios de aceite

- “Parábolas de Jesus” aparece como quarto tema.
- O pacote contém exatamente 18 itens na primeira versão.
- Todos os itens possuem nome, descrição, explicação, mensagem e referência.
- Busca e os três filtros funcionam corretamente.
- As referências aparecem no perfil.
- As quatro fases podem ser concluídas.
- Pontuação e progresso são independentes dos demais temas.
- As telas genéricas não recebem condicionais específicas para parábolas.
- A tela inicial continua utilizável em aparelhos pequenos com quatro temas.
- As imagens permanecem distinguíveis no tamanho da fase 4.
- O bundle Android e o bundle iOS incluem todas as imagens.
- O conteúdo recebe revisão catequética antes da publicação.

## 15. Riscos e cuidados

- Algumas parábolas possuem imagens parecidas; a direção de arte deve separar sementes, grãos, trigo e campos.
- Títulos variam entre traduções; o projeto deve adotar uma convenção editorial.
- Uma explicação curta pode simplificar demais a mensagem; a revisão precisa preservar o sentido central.
- Parábolas sobre vigilância e julgamento exigem tom sereno e adequado à idade.
- Quatro temas podem deixar a seleção inicial longa; a biblioteca precisa ser responsiva antes de o pacote entrar.

## 16. Resultado esperado

O aplicativo ganhará uma campanha leve e visualmente variada, centrada nas palavras e nos ensinamentos de Jesus. “Parábolas de Jesus” deverá ser a próxima implementação e também servirá como base editorial para, em seguida, adicionar “Milagres de Jesus”.
