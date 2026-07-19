# Auditoria de acessibilidade - Android

Status: correções implementadas; revalidação técnica concluída; teste manual completo com TalkBack ainda recomendado  
Data: 19 de julho de 2026  
Dispositivo: emulador Pixel 9, Android 17, 1080 x 2424 px, densidade 420 dpi  
Execução: Expo Go com Metro local

## 1. Escopo e método

A auditoria combinou:

- revisão estática de `App.js`, telas e componentes interativos;
- inspeção visual da Home, Galeria, Perfil e Jogo;
- extração da árvore de acessibilidade nativa com UI Automator;
- teste com escala de fonte em 100%, 130% e 200%;
- cálculo de contraste dos tokens usados na interface;
- verificação de tamanho e identificação dos alvos de toque.

Evidências:

- [Home](../design-reference/accessibility/android-home.png)
- [Galeria](../design-reference/accessibility/android-gallery.png)
- [Perfil](../design-reference/accessibility/android-profile.png)
- [Jogo](../design-reference/accessibility/android-game.png)
- [Home com fonte em 130%](../design-reference/accessibility/android-large-text.png)

Os arquivos XML no mesmo diretório registram a árvore exposta aos serviços de acessibilidade.

Evidências posteriores às correções estão em
[`design-reference/accessibility/after`](../design-reference/accessibility/after/), incluindo Home,
Galeria, filtros, Perfil e Jogo em 200%, além da árvore nativa e de uma verificação curta com o
TalkBack ativo. O controle flutuante `Tools` visto nas capturas pertence ao Expo Go e não integra o
aplicativo de produção.

Esta é uma auditoria técnica preliminar. Antes de publicar, ainda será necessário um teste manual completo com TalkBack, navegação por interruptor e, idealmente, uma pessoa que use tecnologia assistiva no dia a dia.

## 2. Pontos positivos

- Botões principais da Home já expõem papel de botão.
- Os cartões de tema informam nome e progresso e expõem o estado selecionado.
- Voltar e reiniciar possuem rótulos claros.
- A Galeria agrupa cada tile em um único botão com o nome do item.
- O controle de filtros informa o estado expandido.
- O tabuleiro mantém alvos de toque acima de 44 dp mesmo na maior fase.
- O texto principal escuro sobre o fundo creme tem contraste forte, aproximadamente 10,54:1.
- O texto secundário escuro sobre o fundo creme chega a aproximadamente 4,59:1.

## 3. Achados de prioridade alta

### A11Y-01 - Contraste insuficiente em ações e informações

Referência usada: WCAG 2.2 AA, com mínimo de 4,5:1 para texto comum, 3:1 para texto grande e 3:1 para componentes essenciais.

| Combinação atual | Contraste | Resultado |
| --- | ---: | --- |
| Branco sobre rosa primário | 1,70:1 | Falha |
| Branco sobre rosa pressionado | 2,44:1 | Falha |
| Branco sobre azul secundário | 1,51:1 | Falha |
| Rosa de progresso sobre creme | 2,29:1 | Falha |
| Borda dourada sobre creme | 2,10:1 | Falha para limite de componente |

Recomendação:

- manter os fundos pastéis, mas usar texto escuro nos botões;
- escurecer o rosa destinado a texto e estados de foco;
- criar tokens específicos para `textOnPastel`, foco e borda interativa;
- validar todas as combinações do design system antes de migrar novas telas.

### A11Y-02 - As cartas fechadas são indistinguíveis para TalkBack

As 16 cartas da fase inicial expõem exatamente o mesmo rótulo: `Carta virada para baixo`.

O usuário não recebe posição, número, estado de pareamento nem feedback de acerto ou erro. Isso impede formar um mapa mental do tabuleiro.

Recomendação:

- anunciar `Carta 1 de 16, linha 1, coluna 1, virada para baixo`;
- ao abrir, anunciar posição, nome do item e estado;
- ao formar um par, anunciar `Par encontrado: [nome]`;
- no erro, anunciar que as duas cartas serão fechadas;
- expor `accessibilityState` para selecionada, desabilitada e pareada;
- ocultar faces, glifos e imagens decorativas internas da árvore;
- preservar a posição no rótulo mesmo depois que a carta é revelada.

### A11Y-03 - Texto cortado e layout frágil com fonte ampliada

O subtítulo `Aprenda brincando!` aparece visualmente apenas como `Aprenda` já em 100% e continua cortado em 130%, embora a árvore nativa contenha a frase completa.

Em 130%, o conteúdo da Home cresce e as ações ficam abaixo da primeira dobra. A rolagem existe, o que é positivo, mas o corte do subtítulo mostra que algumas medidas de texto não estão respondendo corretamente.

Recomendação:

- remover qualquer restrição implícita de altura ou largura do subtítulo;
- permitir quebra de linha e crescimento vertical;
- evitar combinar `fontSize` escalável com `lineHeight` insuficiente;
- testar todas as telas em 100%, 130%, 160% e 200%;
- garantir que títulos, botões e chips não cortem texto nem escondam ações.

### A11Y-04 - O jogo não anuncia mudanças essenciais

Pontuação, combo, jogadas, carta revelada, acerto, erro e conclusão mudam sem uma região viva ou anúncio explícito. O cronômetro não deve falar a cada segundo, mas o restante precisa de feedback contextual.

Recomendação:

- usar `AccessibilityInfo.announceForAccessibility` para jogadas, pares, erros e vitórias;
- oferecer um resumo único do estado da partida;
- manter o cronômetro silencioso durante a contagem e disponível sob demanda;
- mover o foco para o título do modal ao concluir uma fase.

## 4. Achados de prioridade média

### A11Y-05 - Fases sem papel e estado completos

Os chips de fase expõem apenas valores como `F1, 4x4`. A fase atual não aparece como selecionada e as bloqueadas não dizem `bloqueada`.

Recomendação: usar papel de botão ou aba, rótulo completo (`Fase 1, grade 4 por 4`), estado selecionado e estado desabilitado/bloqueado.

### A11Y-06 - Navegação do sistema não acompanha a navegação interna

O aplicativo troca telas por estado local e não registra `BackHandler`. O botão visual funciona, mas o gesto ou botão Voltar do Android pode fechar a experiência em vez de retornar para a tela anterior.

Recomendação: mapear Voltar do sistema para `perfil -> galeria -> home` e `jogo -> home`, preservando o comportamento de saída apenas na Home.

### A11Y-07 - Modais sem gestão explícita de foco

Os dois modais de resultado não definem foco inicial, isolamento modal da árvore, anúncio do título nem `onRequestClose` para Android.

Recomendação:

- expor a área como modal;
- posicionar o foco no título ao abrir;
- implementar `onRequestClose` com comportamento previsível;
- impedir que o leitor de tela alcance conteúdo por trás do modal;
- devolver o foco a um elemento lógico ao fechar.

### A11Y-08 - Hierarquia semântica incompleta

Títulos e seções são visualmente claros, mas não usam papel de cabeçalho. Imagens decorativas não são marcadas explicitamente como decorativas.

Recomendação:

- usar `accessibilityRole="header"` nos títulos de tela e seção;
- marcar imagens repetidas pelo texto adjacente como `accessible={false}`;
- dar descrição somente às imagens que acrescentam informação não presente no texto.

### A11Y-09 - Chips e controles compactos

Alguns chips de filtro e controles textuais não garantem altura mínima de 44-48 dp. `hitSlop` aparece apenas em parte dos controles.

Recomendação: adotar 48 dp como alvo mínimo Android, usando `minHeight`, `minWidth` ou `hitSlop` sem reduzir a separação visual entre alvos.

### A11Y-10 - Animação sem preferência de movimento reduzido

A rotação 3D das cartas sempre é executada.

Recomendação: consultar a preferência de reduzir movimento e trocar a rotação por transição instantânea ou opacidade curta quando ela estiver ativa.

### A11Y-11 - Estado visual depende parcialmente de cor e opacidade

Fases bloqueadas e estados selecionados usam principalmente fundo, borda e opacidade. Há marca de seleção nos temas, mas as fases não têm texto ou ícone complementar.

Recomendação: combinar cor com texto, ícone e estado semântico (`Atual`, `Concluída`, `Bloqueada`).

## 5. Implementação realizada

| Achado | Situação | Implementação |
| --- | --- | --- |
| A11Y-01 | Corrigido | Tokens de texto, borda e ação ganharam contraste AA; botões pastéis agora usam texto escuro. Os tokens espelhados para Figma também foram atualizados. |
| A11Y-02 | Corrigido | Cada carta informa posição, linha, coluna e estado; cartas reveladas e pareadas incluem o nome do item. Conteúdo visual interno foi removido da árvore. |
| A11Y-03 | Corrigido | O subtítulo deixou de ser cortado e os layouts foram validados até 200%, com rolagem e quebra de linha preservadas. |
| A11Y-04 | Corrigido | Revelação, acerto, erro, reinício e vitória recebem anúncios contextuais. O cronômetro continua silencioso e o placar é exposto como resumo único. |
| A11Y-05 | Corrigido | Fases expõem papel de botão, grade, estado selecionado, bloqueado, disponível ou concluído. |
| A11Y-06 | Corrigido | Voltar do Android respeita `perfil -> galeria -> home` e `jogo -> home`. |
| A11Y-07 | Corrigido | Modais isolam o conteúdo de fundo, tratam Voltar do Android e direcionam foco ao título quando um leitor de tela está ativo. |
| A11Y-08 | Corrigido | Títulos receberam papel de cabeçalho e ilustrações redundantes foram marcadas como decorativas. |
| A11Y-09 | Corrigido | Botões, chips e controles relevantes garantem alvo mínimo de 48 dp. |
| A11Y-10 | Corrigido | A preferência de movimento reduzido é observada e remove a rotação das cartas e animações de entrada. |
| A11Y-11 | Corrigido | Estados ganharam texto, ícones, bordas e estado semântico, sem depender apenas de cor ou opacidade. |

## 6. Validação posterior

- exportação do bundle Android concluída sem erro;
- exportação do conteúdo concluída com 5 temas e 90 itens;
- `git diff --check` e validação dos JSONs de tokens concluídos sem erro;
- Home, Galeria, filtros, Perfil e Jogo inspecionados no Pixel 9;
- fonte a 200% validada sem conteúdo essencial cortado; o tabuleiro recebeu um ajuste adicional de espaçamento após a inspeção;
- árvore nativa confirmou rótulos consolidados, estados selecionados, busca, filtros, metadados e alvos de toque;
- botão Voltar físico validado de Jogo para Home;
- TalkBack foi ativado temporariamente e a árvore permaneceu navegável, mas o controle de desenvolvimento do Expo Go tomou o foco inicial. Por isso, o teste manual de uma partida completa deve ser repetido em um build instalável, sem o overlay do Expo Go.

## 7. Ordem recomendada para correção

1. Corrigir os tokens de contraste e os rótulos dos botões.
2. Criar o modelo acessível das cartas e os anúncios da partida.
3. Corrigir texto dinâmico e validar fonte até 200%.
4. Completar estados das fases, navegação Voltar e semântica de títulos.
5. Corrigir foco e isolamento dos modais.
6. Ajustar alvos de toque e movimento reduzido.
7. Executar uma rodada manual completa com TalkBack.

## 8. Critérios de aceite da implementação

- Nenhum texto essencial falha em 4,5:1; texto grande e componentes atendem pelo menos 3:1.
- Todas as cartas possuem posição, estado e nome contextual quando abertas.
- TalkBack consegue iniciar e concluir uma fase sem depender da visão.
- Acertos, erros e vitórias são anunciados uma única vez.
- Nenhuma tela corta ou sobrepõe conteúdo entre 100% e 200% de fonte.
- Todo alvo interativo tem área efetiva mínima de 48 x 48 dp no Android.
- Voltar do sistema respeita a hierarquia interna.
- Modais isolam o fundo, recebem foco e devolvem foco ao fechar.
- A experiência permanece compreensível em escala de cinza.

Os critérios técnicos foram atendidos, com uma pendência de validação humana: concluir uma partida
inteira usando TalkBack em um APK/AAB de homologação, preferencialmente também com uma pessoa que
use leitor de tela no dia a dia.
