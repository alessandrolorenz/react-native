# Spec 01 — Aplicativo multitema e pacote “Símbolos da Fé Católica”

Status: implementada; conteúdo sujeito a revisão catequética  
Produto: Jogo da Memória  
Tema existente: Santos  
Primeiro novo tema: Símbolos da Fé Católica

## 1. Decisão de produto

O produto será um único aplicativo com vários temas. O “Jogo da Memória dos Santos” continuará sendo o primeiro pacote oficial e deverá preservar sua experiência atual durante a refatoração.

O código do jogo será transformado em um motor genérico. Cada tema fornecerá conteúdo, textos, filtros, identidade visual opcional e conteúdo de conclusão por meio de uma configuração própria.

O primeiro tema usado para validar essa arquitetura será “Símbolos da Fé Católica”.

## 2. Por que este será o primeiro tema

“Símbolos da Fé Católica” atende aos critérios do primeiro pacote:

- possui mais de 14 elementos, quantidade mínima exigida pela quarta fase atual;
- permite ilustrações simples, coloridas e visualmente distintas;
- tem conteúdo leve e apropriado para crianças e famílias;
- permite explicações curtas sem histórias difíceis ou assustadoras;
- continua coerente com a identidade católica do aplicativo;
- testa filtros e perfis diferentes dos usados no tema Santos;
- permite reutilizar integralmente fases, pontuação, animação e regras do jogo.

O tema deve ser apresentado como educativo e introdutório. As descrições não devem sugerir que um símbolo substitui a realidade da fé ou do sacramento que representa.

## 3. Objetivos

1. Manter o tema Santos funcionando sem alterações perceptíveis para o jogador.
2. Permitir que o jogador escolha um tema dentro do mesmo aplicativo.
3. Reutilizar o mesmo motor de fases, baralho, pontuação e progresso.
4. Fazer com que um novo tema seja adicionado principalmente por configuração, conteúdo e imagens.
5. Isolar o progresso de cada tema.
6. Validar a arquitetura com um segundo pacote contendo pelo menos 18 itens.

## 4. Fora do escopo desta primeira versão

- compras dentro do aplicativo;
- download remoto de temas;
- contas, login ou sincronização na nuvem;
- tradução para outros idiomas;
- áudio e narração;
- criação de fases exclusivas por tema;
- alteração das regras de pontuação;
- persistência do progresso após fechar o aplicativo.

Esses recursos podem ser acrescentados posteriormente sem fazer parte da primeira migração.

## 5. Experiência do jogador

### 5.1 Entrada no aplicativo

A tela inicial continuará destacando “Jogo da Memória”. Ela deverá oferecer acesso a uma seleção de temas antes de iniciar uma campanha.

Temas disponíveis inicialmente:

1. Santos — disponível e selecionado por padrão para jogadores atuais.
2. Símbolos da Fé — novo pacote.

Cada tema será representado por um cartão com:

- nome;
- subtítulo curto;
- imagem ou ícone de capa;
- progresso da campanha;
- ação “Jogar”.

### 5.2 Campanha

Os dois temas usarão as quatro fases atuais:

| Fase | Grade | Pares | Cartas |
| --- | --- | ---: | ---: |
| 1 | 4 × 4 | 8 | 16 |
| 2 | 5 × 4 | 10 | 20 |
| 3 | 6 × 4 | 12 | 24 |
| 4 | 7 × 4 | 14 | 28 |

Os itens continuam sendo sorteados a cada partida. Um tema precisa ter no mínimo 14 itens habilitados para usar todas as fases.

### 5.3 Galeria

A galeria exibirá somente os itens do tema selecionado.

Exemplos de títulos:

- Santos: “Galeria dos Santos”.
- Símbolos: “Galeria dos Símbolos”.

A busca usará o nome do item. Os filtros serão definidos pelo tema, sem uma lista fixa no componente de interface.

### 5.4 Perfil

Todo item poderá apresentar:

- imagem;
- nome;
- descrição curta;
- explicação em pequenos parágrafos;
- curiosidade;
- metadados configurados pelo tema.

No tema Símbolos, a seção equivalente a “História” será chamada “O que significa?”. A seção “Você sabia?” continuará disponível.

### 5.5 Conclusão

Ao concluir uma fase, o jogador verá um dos itens encontrados e sua explicação.

Ao concluir toda a campanha:

- Santos continuará exibindo uma oração;
- Símbolos exibirá uma mensagem educativa sobre reconhecer os sinais da fé;
- nenhum texto do modal deverá presumir que o item é um santo;
- o conteúdo final será fornecido pela configuração do tema.

## 6. Contrato de um tema

Estrutura conceitual proposta:

```js
{
  id: 'symbols',
  title: 'Símbolos da Fé',
  subtitle: 'Descubra os sinais que contam a nossa fé',
  coverImage: require('...'),
  copy: {
    galleryTitle: 'Galeria dos Símbolos',
    searchPlaceholder: 'Buscar símbolo…',
    profileStoryTitle: 'O que significa?',
    factTitle: 'Você sabia?',
  },
  filters: [
    { key: 'category', label: 'Categoria' },
    { key: 'context', label: 'Onde encontramos' },
  ],
  completion: {
    title: 'Campanha concluída!',
    message: 'Agora você reconhece muitos sinais da nossa fé.',
    sectionTitle: 'Para recordar',
  },
  appearance: {
    cardBackGlyph: '✦',
  },
  items: SYMBOLS,
}
```

Campos obrigatórios do tema:

- `id` único;
- textos principais;
- lista de filtros, que pode estar vazia;
- conteúdo de conclusão;
- coleção de itens.

As cores específicas serão opcionais. Na ausência delas, o tema usará o design system padrão do aplicativo.

## 7. Contrato de um item

```js
{
  id: 'dove',
  name: 'Pomba',
  shortDescription: 'Um sinal que recorda o Espírito Santo.',
  image: require('...'),
  emoji: '🕊️',
  story: [
    'Na Bíblia, a pomba aparece em momentos de paz e esperança.',
    'No Batismo de Jesus, o Espírito Santo desceu como uma pomba.',
  ],
  fact: 'Por isso ela aparece em muitas igrejas e imagens do Batismo.',
  metadata: {
    category: 'Espírito Santo',
    context: 'Bíblia e sacramentos',
  },
}
```

Campos mínimos obrigatórios:

- `id`;
- `name`;
- `image`.

Campos opcionais:

- `shortDescription`;
- `emoji`;
- `story`;
- `fact`;
- `metadata`;
- conteúdo final específico do item.

As telas devem omitir com elegância qualquer seção opcional vazia.

## 8. Catálogo inicial de Símbolos da Fé

O pacote inicial terá 18 itens. Isso oferece variedade suficiente para sortear os 14 pares da última fase sem exigir um catálogo grande demais para a primeira versão.

| ID | Nome | Ideia visual principal | Categoria sugerida |
| --- | --- | --- | --- |
| `cross` | Cruz | cruz simples | Jesus Cristo |
| `bible` | Bíblia | livro aberto | Palavra de Deus |
| `chalice` | Cálice | cálice dourado | Liturgia |
| `host` | Hóstia | hóstia com raios | Eucaristia |
| `fish` | Peixe cristão | contorno do peixe | Primeiros cristãos |
| `lamb` | Cordeiro | cordeiro branco | Jesus Cristo |
| `dove` | Pomba | pomba branca | Espírito Santo |
| `rosary` | Rosário | contas e pequena cruz | Oração |
| `sacred-heart` | Sagrado Coração | coração com chama | Jesus Cristo |
| `alpha-omega` | Alfa e Ômega | letras Α e Ω | Jesus Cristo |
| `chi-rho` | Chi-Rho | monograma ☧ | Primeiros cristãos |
| `anchor` | Âncora | âncora | Esperança |
| `keys` | Chaves de São Pedro | duas chaves cruzadas | Igreja |
| `lily` | Lírio | lírio branco | Pureza e Maria |
| `paschal-candle` | Círio Pascal | vela com cruz | Páscoa e liturgia |
| `baptismal-water` | Água do Batismo | água e pequenas ondas | Sacramentos |
| `incense` | Incenso | turíbulo com fumaça | Liturgia e oração |
| `boat` | Barca da Igreja | pequena barca | Igreja |

Antes da publicação, nomes, explicações e associações catequéticas deverão passar por revisão de conteúdo católico.

## 9. Direção de conteúdo

Público principal: crianças e famílias.

Cada item deve ter:

- uma descrição curta de aproximadamente 6 a 14 palavras;
- dois ou três parágrafos ou frases curtas de explicação;
- uma curiosidade de uma ou duas frases;
- vocabulário simples;
- tom acolhedor e educativo;
- nenhuma afirmação supersticiosa sobre objetos ou símbolos.

Quando houver mais de uma interpretação legítima, o texto deve usar expressões como “recorda”, “representa” ou “é usado como sinal de”, evitando apresentar associações devocionais como definições exclusivas.

## 10. Direção visual

- Manter o estilo infantil, suave e acolhedor do pacote Santos.
- Usar fundo simples e composição centralizada em todas as cartas.
- Evitar texto dentro das ilustrações, exceto quando ele for o próprio símbolo, como Alfa e Ômega.
- Garantir silhuetas diferentes para facilitar o reconhecimento das cartas pequenas.
- Evitar excesso de dourado em todos os itens litúrgicos; cada carta precisa ser distinguível rapidamente.
- Manter proporção quadrada e área segura ao redor do elemento principal.
- Criar uma capa própria do pacote, sem alterar o ícone geral do aplicativo nesta versão.

## 11. Mudanças técnicas necessárias

### 11.1 Núcleo genérico

- trocar nomes internos de domínio de `saint` para `item`;
- fazer `buildDeck` receber a coleção do tema ativo;
- remover importações diretas de `SAINTS` nas telas;
- preservar as regras atuais do reducer e da pontuação.

### 11.2 Registro de temas

Estrutura esperada:

```text
src/themes/
  index.js
  saints/
    config.js
    items.js
  symbols/
    config.js
    items.js
```

As imagens continuarão usando `require()` estático para serem empacotadas corretamente pelo Expo/Metro.

### 11.3 Interface genérica

- transformar nomes de componentes específicos de santos em nomes genéricos;
- receber textos e labels pelo tema;
- gerar filtros dinamicamente;
- renderizar metadados dinamicamente;
- permitir conteúdo final com oração ou mensagem educativa.

### 11.4 Progresso

O estado será separado por `themeId`:

```js
{
  activeThemeId: 'saints',
  byTheme: {
    saints: {
      unlockedPhase: 1,
      completedPhases: {},
      totalScore: 0,
    },
    symbols: {
      unlockedPhase: 1,
      completedPhases: {},
      totalScore: 0,
    },
  },
}
```

## 12. Ordem de implementação

1. Introduzir o contrato e o registro de temas.
2. Converter o conteúdo atual dos santos em um pacote sem mudar sua aparência.
3. Tornar baralho, jogo e cartas independentes de santos.
4. Tornar galeria, perfil e filtros configuráveis.
5. Tornar os modais de conclusão configuráveis.
6. Separar o progresso por tema.
7. Adicionar a seleção de temas na interface.
8. Criar o pacote Símbolos com conteúdo provisório e imagens temporárias.
9. Fazer revisão catequética e substituir as imagens temporárias.
10. Validar os dois temas nas quatro fases.

## 13. Critérios de aceite

- O tema Santos funciona como antes da refatoração.
- O aplicativo permite escolher Santos ou Símbolos.
- Cada tema possui campanha e pontuação independentes.
- As quatro fases funcionam nos dois temas.
- Nenhuma tela genérica contém textos fixos que presumam um santo.
- A galeria mostra busca, filtros e conteúdo do tema ativo.
- O perfil não quebra quando campos opcionais estiverem ausentes.
- A conclusão de Santos exibe oração.
- A conclusão de Símbolos exibe mensagem educativa, sem oração obrigatória.
- Todos os temas são validados para ter itens suficientes para suas fases.
- Um terceiro tema pode ser criado sem duplicar as telas ou o motor do jogo.

## 14. Riscos e cuidados

- Renomear tudo de uma vez pode introduzir regressões; a migração deve ser feita em etapas pequenas.
- O projeto ainda não possui testes automatizados, então as funções puras mais importantes devem receber cobertura durante a refatoração.
- Símbolos parecidos visualmente podem dificultar o jogo; as ilustrações precisam ser avaliadas no tamanho real das cartas.
- O estado atual não é persistente. O isolamento por tema deve ser implementado agora, mesmo que a persistência continue para uma versão futura.
- Conteúdo religioso deve passar por revisão antes de ser tratado como definitivo.

## 15. Resultado esperado

Ao final desta spec, Santos será apenas o primeiro pacote de um aplicativo multitema. “Símbolos da Fé Católica” provará que novos temas podem ser acrescentados por meio de conteúdo, imagens e configuração, sem copiar o aplicativo nem reimplementar suas regras.
