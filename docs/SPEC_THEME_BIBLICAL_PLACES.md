# Spec 02 — Pacote “Lugares Bíblicos”

Status: implementada com arte provisória; conteúdo sujeito a revisão catequética  
Produto: Jogo da Memória  
Tipo: novo pacote para o aplicativo multitema  
Temas anteriores: Santos e Símbolos da Fé

## 1. Visão do produto

“Lugares Bíblicos” será o terceiro tema do aplicativo. O jogador percorrerá cidades, montes, águas e regiões ligadas à história da salvação, usando o mesmo motor de fases, pontuação, galeria e perfis já utilizado pelos outros temas.

O pacote deve ser apresentado como uma viagem educativa pelas terras da Bíblia. O conteúdo será introdutório, adequado para crianças e famílias e baseado prioritariamente no texto bíblico.

## 2. Por que este tema

- possui quantidade suficiente de lugares para as quatro fases atuais;
- acrescenta uma categoria nova ao aplicativo: ambientes, em vez de pessoas ou objetos;
- permite ilustrações variadas de cidades, montanhas, rios, mar, deserto e ilha;
- ajuda a criança a relacionar acontecimentos bíblicos com seus contextos geográficos;
- permite histórias leves, curtas e reconhecíveis;
- reaproveita completamente o motor multitema existente;
- prepara a arquitetura para temas futuros com referências, mapas e jornadas.

## 3. Objetivos

1. Adicionar um terceiro tema sem duplicar telas ou regras do jogo.
2. Oferecer 18 lugares, garantindo variedade para a fase de 14 pares.
3. Apresentar cada lugar por meio de um acontecimento bíblico principal.
4. Permitir busca e filtros específicos do tema.
5. Exibir referências bíblicas no perfil de cada lugar.
6. Manter progresso e pontuação independentes dos outros temas.
7. Criar uma experiência visual de viagem e descoberta.

## 4. Fora do escopo inicial

- mapas interativos;
- geolocalização;
- rotas de peregrinação atuais;
- reconstruções arqueológicas com pretensão científica;
- mapas políticos modernos;
- áudio ou narração;
- download remoto de conteúdo;
- fases com regras exclusivas do tema;
- questionários sobre os lugares;
- localização exata de sítios cuja identificação histórica é discutida.

## 5. Experiência do jogador

### 5.1 Cartão do tema

Dados sugeridos:

- Título: “Lugares Bíblicos”
- Subtítulo: “Viaje pelas terras e histórias da Bíblia!”
- Descrição: “Descubra cidades, montes, rios e caminhos da história da salvação.”
- Glifo de capa provisório: `🗺️`
- Ação da galeria: “✦ Galeria dos Lugares”

### 5.2 Campanha

O tema utilizará as quatro fases compartilhadas:

| Fase | Grade | Pares | Cartas |
| --- | --- | ---: | ---: |
| 1 | 4 × 4 | 8 | 16 |
| 2 | 5 × 4 | 10 | 20 |
| 3 | 6 × 4 | 12 | 24 |
| 4 | 7 × 4 | 14 | 28 |

Os lugares serão sorteados a cada partida. O catálogo inicial de 18 itens permite variar as partidas sem tornar a produção de conteúdo grande demais.

### 5.3 Galeria

- Título: “✦ Galeria dos Lugares”
- Busca: “Buscar lugar…”
- Estado vazio: “Nenhum lugar encontrado.”
- Cada cartão exibe ilustração e nome.
- A galeria mostra apenas os itens deste tema.

### 5.4 Perfil

O perfil deverá apresentar:

- ilustração;
- nome do lugar;
- descrição curta;
- metadados geográficos e bíblicos;
- seção “O que aconteceu aqui?”;
- seção “Você sabia?”;
- referências bíblicas como chips.

### 5.5 Conclusão

Conclusão de fase:

- “Você encontrou todos os lugares!”
- revelar um dos lugares da partida;
- mostrar seu acontecimento principal e sua curiosidade.

Conclusão da campanha:

- Kicker: “🎉 Viagem concluída! 🎉”
- Título: “Você percorreu os Lugares Bíblicos!”
- Mensagem: “Cada lugar guarda a memória de uma parte da história da salvação.”
- Seção final: “Para recordar”
- Ação: voltar ao início.

## 6. Contrato do tema

Estrutura proposta:

```js
{
  id: 'biblical-places',
  title: 'Lugares Bíblicos',
  displayTitle: 'dos Lugares Bíblicos',
  subtitle: 'Viaje pelas terras e histórias da Bíblia!',
  description: 'Descubra cidades, montes, rios e caminhos da história da salvação.',
  coverGlyph: '🗺️',
  items: BIBLICAL_PLACE_ITEMS,
  copy: {
    galleryButton: '✦ Galeria dos Lugares',
    galleryTitle: '✦ Galeria dos Lugares',
    searchPlaceholder: 'Buscar lugar…',
    emptySearch: 'Nenhum lugar encontrado.',
    profileStoryTitle: '✦ O QUE ACONTECEU AQUI?',
    factTitle: 'Você sabia?',
    resultSectionTitle: 'Conheça este lugar',
  },
  filters: [
    { key: 'period', label: 'Testamento' },
    { key: 'placeType', label: 'Tipo de lugar' },
    { key: 'journey', label: 'Jornada' },
  ],
  profile: {
    metaFields: [
      { key: 'placeType', label: 'Tipo' },
      { key: 'region', label: 'Região bíblica' },
      { key: 'period', label: 'Testamento' },
    ],
    tagField: { key: 'references', label: '✦ LEIA NA BÍBLIA' },
  },
  appearance: {
    cardBackGlyph: '✦',
  },
  completion: {
    kicker: '🎉 Viagem concluída! 🎉',
    title: 'Você percorreu os Lugares Bíblicos!',
    message: 'Cada lugar guarda a memória de uma parte da história da salvação.',
  },
}
```

## 7. Contrato de um lugar

```js
{
  id: 'bethlehem',
  name: 'Belém',
  shortDescription: 'A cidade onde Jesus nasceu.',
  image: require('../../../assets/places/bethlehem.png'),
  story: [
    'Maria e José foram a Belém antes do nascimento de Jesus.',
    'Ali, Jesus nasceu e foi colocado numa manjedoura.',
  ],
  fact: 'Belém também está ligada à história de Rute e à família do rei Davi.',
  metadata: {
    period: 'Antigo e Novo Testamento',
    placeType: 'Cidade',
    region: 'Judeia',
    journey: 'Vida de Jesus',
    references: ['Rute 1–4', 'Miqueias 5,1', 'Lucas 2,1–20'],
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
- `metadata.period`;
- `metadata.placeType`;
- `metadata.region`;
- `metadata.journey`;
- `metadata.references`.

## 8. Catálogo inicial

| ID | Lugar | Acontecimento principal | Referência inicial | Elemento visual distintivo |
| --- | --- | --- | --- | --- |
| `jerusalem` | Jerusalém | Paixão, Ressurreição e nascimento da Igreja | Lc 24; At 2 | muralhas, templo e luz pascal |
| `bethlehem` | Belém | nascimento de Jesus | Lc 2,1–20 | estrela e manjedoura |
| `nazareth` | Nazaré | Anunciação e vida cotidiana de Jesus | Lc 1,26–38; 2,39–52 | casa, lírio e oficina |
| `capernaum` | Cafarnaum | ensinamentos e curas de Jesus | Mc 1,21–34 | sinagoga e margem do lago |
| `cana` | Caná | primeiro sinal de Jesus nas bodas | Jo 2,1–11 | seis jarros e festa |
| `bethany` | Betânia | amizade de Jesus com Marta, Maria e Lázaro | Jo 11,1–44 | casa acolhedora e caminho |
| `jericho` | Jericó | encontro de Jesus com Zaqueu | Lc 19,1–10 | muralhas e sicômoro |
| `emmaus` | Emaús | discípulos reconhecem Jesus ao partir o pão | Lc 24,13–35 | estrada, viajantes e pão |
| `samaria` | Samaria | encontro de Jesus com a mulher junto ao poço | Jo 4,4–42 | poço e cântaro |
| `sea-of-galilee` | Mar da Galileia | Jesus acalma a tempestade | Mc 4,35–41 | barco, ondas e montes |
| `jordan-river` | Rio Jordão | Batismo de Jesus | Mt 3,13–17 | rio, vegetação e pomba |
| `mount-sinai` | Monte Sinai | aliança e entrega dos mandamentos | Ex 19–20 | montanha e tábuas |
| `mount-of-olives` | Monte das Oliveiras | oração de Jesus e proximidade de Jerusalém | Lc 22,39–46; At 1,12 | oliveiras e cidade ao fundo |
| `judean-desert` | Deserto da Judeia | pregação de João Batista | Mt 3,1–6 | rochas, caminho e horizonte |
| `egypt` | Egito | êxodo de Israel e acolhida da Sagrada Família | Ex 12–14; Mt 2,13–15 | rio, palmeiras e caminho |
| `damascus` | Damasco | conversão e chamado de Saulo | At 9,1–19 | estrada, cidade e clarão |
| `antioch` | Antioquia | discípulos são chamados cristãos | At 11,19–26 | comunidade e portão da cidade |
| `patmos` | Ilha de Patmos | João recebe a visão do Apocalipse | Ap 1,9–11 | ilha, mar e pergaminho |

## 9. Sistema de filtros

### 9.1 Testamento

Valores sugeridos:

- Antigo Testamento;
- Novo Testamento;
- Antigo e Novo Testamento.

O valor indica em qual parte da Bíblia o conteúdo principal do perfil aparece. Não significa que o lugar tenha deixado de existir ou de ser mencionado em outros períodos.

### 9.2 Tipo de lugar

Valores sugeridos:

- Cidade;
- Região;
- Monte;
- Rio;
- Mar;
- Deserto;
- País;
- Ilha.

### 9.3 Jornada

Valores sugeridos:

- Povo de Israel;
- Vida de Jesus;
- Primeira Igreja;
- Antigo e Novo Testamento.

Cada lugar terá um valor principal por filtro para permanecer compatível com o filtro exato já existente.

## 10. Direção editorial

Público principal: crianças e famílias.

Cada lugar deve ter:

- uma descrição curta de 5 a 12 palavras;
- duas ou três frases simples em `story`;
- uma curiosidade de uma ou duas frases;
- de uma a três referências bíblicas;
- um acontecimento principal, mesmo quando o lugar aparece muitas vezes;
- linguagem acolhedora, sem descrições gráficas de violência;
- distinção clara entre texto bíblico, tradição cristã e hipótese histórica.

### 10.1 Regras de precisão

- Não afirmar que uma localização arqueológica moderna é certa quando houver debate.
- Em Emaús, apresentar o lugar do relato de Lucas sem escolher como definitiva uma das identificações atuais.
- Em Monte Sinai, falar do monte do relato bíblico sem prometer uma identificação geográfica moderna exata.
- Para o deserto, associar o Deserto da Judeia à pregação de João Batista; não afirmar que o local exato das tentações de Jesus é conhecido.
- “Mar da Galileia” pode ser explicado como um grande lago também chamado lago de Genesaré ou de Tiberíades.
- Evitar transformar um acontecimento bíblico em simples lenda ou curiosidade turística.
- Quando uma tradição devocional for utilizada, identificá-la explicitamente como tradição.

### 10.2 Referências editoriais iniciais

Fontes prioritárias:

- texto bíblico da tradução católica adotada para o projeto;
- Catecismo da Igreja Católica quando houver relação doutrinal;
- documentos da Santa Sé sobre os lugares ligados à história da salvação;
- revisão catequética antes da publicação.

## 11. Direção visual

O desafio principal é evitar que todas as cidades pareçam iguais.

Regras gerais:

- manter o estilo infantil, suave e acolhedor dos outros temas;
- usar enquadramento quadrado e elemento principal centralizado;
- criar uma paleta dominante diferente para cada grupo de lugares;
- reservar uma silhueta ou objeto marcante para cada cidade;
- evitar texto desenhado dentro das cartas;
- evitar mapas políticos e bandeiras modernas;
- representar vestimentas, edifícios e paisagens com simplicidade, sem alegar reconstrução histórica exata;
- avaliar cada imagem no tamanho mínimo usado na fase 4.

### 11.1 Grupos visuais

- Cidades: arquitetura mais um objeto narrativo distintivo.
- Montes: silhuetas, céu e vegetação próprios.
- Águas: variação de cor, margem, embarcação ou vegetação.
- Deserto: formações rochosas e caminho.
- Ilha: costa, mar e pergaminho.
- Regiões e países: paisagem ampla ligada ao acontecimento escolhido.

## 12. Estrutura técnica

```text
src/themes/biblical-places/
  config.js
  items.js

assets/places/
  01-jerusalem.png
  02-bethlehem.png
  ...
  18-patmos.png
```

Mudanças esperadas:

1. Criar `BIBLICAL_PLACE_ITEMS` com 18 entradas.
2. Criar `biblicalPlacesTheme` seguindo o contrato existente.
3. Registrar o tema em `src/themes/index.js`.
4. Reutilizar `GalleryScreen`, `ItemProfileScreen`, `GameScreen` e os modais sem ramificações específicas.
5. Garantir que o campo `references` seja renderizado pelo `tagField` genérico.
6. Adicionar imagens estáticas com `require()` para empacotamento pelo Metro.

Não deve ser necessário alterar o reducer do jogo, a pontuação, o baralho ou as fases.

## 13. Ordem de implementação

1. Revisar e aprovar o catálogo de 18 lugares.
2. Escrever o conteúdo provisório e as referências.
3. Fazer revisão bíblica e catequética.
4. Criar configuração e itens do tema.
5. Registrar o tema e validar os filtros.
6. Adicionar glifos ou placeholders temporários.
7. Produzir as 18 ilustrações finais.
8. Substituir os placeholders pelas imagens estáticas.
9. Testar galeria, perfis e quatro fases.
10. Revisar o tema em Android e iOS.

## 14. Critérios de aceite

- “Lugares Bíblicos” aparece como terceiro tema na tela inicial.
- O tema contém exatamente 18 lugares na primeira versão.
- Todos os lugares possuem nome, descrição, história, curiosidade e referência bíblica.
- Busca e os três filtros funcionam corretamente.
- As referências aparecem no perfil.
- As quatro fases podem ser concluídas.
- Pontuação e progresso são independentes de Santos e Símbolos.
- As telas genéricas não recebem condicionais específicas para este tema.
- A conclusão da campanha utiliza os textos de viagem definidos pelo tema.
- As imagens são distinguíveis no tamanho das cartas da fase 4.
- O bundle Android e o bundle iOS incluem todas as imagens.
- O conteúdo recebe revisão catequética antes da publicação.

## 15. Riscos e cuidados

- Cidades antigas podem ficar visualmente parecidas; a direção de arte precisa enfatizar objetos narrativos.
- Alguns lugares aparecem em muitos acontecimentos; cada perfil deve escolher um foco principal.
- Identificações arqueológicas discutidas não devem ser apresentadas como certezas.
- Nomes geográficos podem variar conforme a tradução bíblica; o projeto precisa adotar uma convenção editorial.
- Referências extensas demais podem dificultar a leitura infantil; os chips devem permanecer curtos.
- O tema não deve reduzir a Bíblia a turismo: lugar e acontecimento precisam permanecer conectados.

## 16. Resultado esperado

Ao final da implementação, o aplicativo terá três tipos claramente diferentes de conteúdo:

- Santos: pessoas e testemunhos de fé;
- Símbolos da Fé: sinais, objetos e significados;
- Lugares Bíblicos: espaços e acontecimentos da história da salvação.

Isso validará que a arquitetura multitema consegue receber novos domínios de conteúdo sem duplicar o aplicativo.
