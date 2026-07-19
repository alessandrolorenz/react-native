# Spec 05 - Monetização e jogo físico em PDF

Status: rascunho para aprovação; não implementar antes da aprovação  
Produto: Jogo da Memória  
Público: crianças, famílias, catequistas e educadores  
Idioma inicial: português do Brasil

## 1. Decisão de produto proposta

O aplicativo continuará oferecendo gratuitamente o jogo digital e a galeria. A primeira monetização será um produto complementar: um kit completo para imprimir, recortar e jogar fisicamente.

Modelo recomendado para a primeira versão:

- sem anúncios;
- sem assinatura;
- uma compra única e não consumível;
- produto inicial `printables_complete_v1`;
- a compra libera PDFs separados para os cinco temas atuais;
- restauração de compra disponível;
- uma amostra gratuita do tema Santos com 8 pares;
- acesso à compra por uma Área dos Responsáveis com barreira parental.

Esse modelo preserva a experiência educativa gratuita, oferece valor concreto aos adultos e evita pressão de compra sobre crianças.

## 2. Regras de loja que orientam a solução

O PDF é conteúdo digital liberado pelo aplicativo. Por isso, a implementação padrão deverá usar compra dentro do aplicativo:

- A Apple exige In-App Purchase para desbloquear funcionalidade ou conteúdo digital no app: [App Review Guidelines, seção 3.1.1](https://developer.apple.com/app-store/review/guidelines/).
- O Google Play também exige o sistema de faturamento da loja para conteúdo digital, salvo programas e exceções regionais específicos: [Google Play Payments policy](https://support.google.com/googleplay/android-developer/answer/9858738?hl=en).
- O Google classifica uma liberação permanente como produto único não consumível: [One-time products](https://developer.android.com/google/play/billing/one-time-products).
- Como o app se apresenta para crianças e famílias, a declaração de público, privacidade, SDKs e compras precisa respeitar a [Google Play Families Policy](https://support.google.com/googleplay/android-developer/answer/9893335?hl=en).
- Na categoria infantil da Apple, compras e links externos precisam ficar atrás de barreira parental, e publicidade/analytics de terceiros têm restrições adicionais: [App Review Guidelines, seção 1.3](https://developer.apple.com/app-store/review/guidelines/).

Decisão de V1: não oferecer checkout externo, anúncios, assinatura ou moeda virtual.

## 3. Objetivos

1. Permitir que um responsável compre uma vez e restaure o acesso depois.
2. Entregar um PDF realmente pronto para impressão em escala correta.
3. Reutilizar o conteúdo e as artes validadas do aplicativo.
4. Manter a geração dos PDFs determinística e verificável.
5. Não exigir conta própria, login ou backend do produto na primeira versão.
6. Manter toda comunicação comercial dirigida ao adulto.
7. Criar uma base que aceite novos kits imprimíveis no futuro.

## 4. Fora do escopo da primeira versão

- anúncios;
- assinaturas;
- venda de material físico e logística de entrega;
- editor de cartas pelo usuário;
- personalização com nome ou fotografia;
- sincronização entre contas próprias;
- impressão Carta/Letter na primeira entrega;
- tradução;
- compra individual de cada tema;
- checkout em site externo;
- download de conteúdo criado por outros usuários.

## 5. Conteúdo do produto pago

O kit completo V1 contém cinco arquivos principais:

1. Santos.
2. Símbolos da Fé.
3. Lugares Bíblicos.
4. Parábolas de Jesus.
5. Milagres de Jesus.

Cada tema contém:

- capa e identificação do tema;
- instruções simples para adultos;
- página de calibração de impressão;
- 36 cartas de frente, correspondentes a 18 pares;
- páginas de verso opcionais para impressão frente e verso;
- instruções de corte, montagem e conservação;
- identificação de versão e data editorial.

A amostra gratuita usa 8 pares de Santos e o mesmo padrão dimensional do produto pago.

## 6. Especificação física

### 6.1 Papel e página

- Formato inicial: A4 retrato, 210 x 297 mm.
- Escala de impressão: 100%, sem `Ajustar à página`.
- Layout: 3 colunas x 3 linhas.
- Cartas por página: 9.
- Margens resultantes: 10,5 mm nas laterais e 16,5 mm no topo e rodapé.

### 6.2 Carta

- Tamanho final: 63 x 88 mm.
- Proporção: formato de carta padrão, confortável para mãos adultas e infantis.
- Área segura interna: 3 mm em cada lado.
- Cantos: indicação visual de raio, mas corte reto permitido para uso doméstico.
- Linhas de corte: finas, externas ao conteúdo essencial e compartilhadas entre cartas.
- Fundo: claro e opaco; nenhuma informação depende apenas de cor.
- Frente: ilustração, nome legível e identificação discreta do tema.
- Verso: composição simétrica, sem orientação obrigatória e idêntica em todas as cartas do tema.

As 36 cartas ocupam quatro páginas de frente. As quatro páginas de verso são opcionais: quem imprimir apenas as frentes poderá usar papel opaco de 180 a 250 g/m2 ou colar as folhas em papel cartão.

### 6.3 Impressão frente e verso

- Configuração indicada: virar na borda longa.
- Versos sem texto direcional para tolerar rotação.
- Página de teste antes das cartas finais.
- Instrução para medir um quadrado de calibração de 50 x 50 mm.
- Tolerância aceita no teste físico: até 0,5 mm.

### 6.4 Qualidade das imagens

O PDF usa desenho vetorial para textos, bordas e marcas de corte. As ilustrações atuais variam aproximadamente entre 404 e 512 px e podem ficar abaixo de 300 ppi no tamanho final.

Antes da entrega comercial:

- cada arte principal deve ter pelo menos 768 x 768 px;
- espaço de cor deve ser sRGB;
- não pode haver texto rasterizado essencial;
- imagens devem ser inspecionadas no PDF renderizado a 300 dpi;
- arquivos menores só podem ser aceitos após inspeção visual sem pixelização perceptível.

## 7. Arquitetura proposta do PDF

Os PDFs serão gerados durante o desenvolvimento/build, não no celular.

Motivos:

- medidas e paginação ficam idênticas em Android e iOS;
- é possível revisar cada página antes de publicar;
- não dependemos das diferenças de WebView e impressão de cada dispositivo;
- o usuário recebe um arquivo estável e já aprovado.

Pipeline proposto:

1. Validar o conteúdo canônico e os 18 itens de cada tema.
2. Gerar os PDFs com ReportLab usando milímetros convertidos em pontos.
3. Validar metadados, quantidade de páginas e texto com `pypdf`/`pdfplumber`.
4. Renderizar todas as páginas com Poppler (`pdftoppm`).
5. Inspecionar visualmente cortes, alinhamento, legibilidade e qualidade das imagens.
6. Medir o quadro de calibração e as caixas das cartas.
7. Publicar apenas os arquivos aprovados em `output/pdf/`.

O documento deve manter texto real pesquisável; não será uma coleção de páginas transformadas em imagem.

## 8. Entrega do arquivo no aplicativo

V1 recomendada:

- PDFs pré-gerados empacotados com o app;
- desbloqueio condicionado ao entitlement da loja;
- ação `Abrir`, `Compartilhar/Salvar` e `Imprimir`;
- funcionamento offline depois da compra restaurada;
- nenhum link público obrigatório e nenhum backend próprio.

O Expo oferece impressão de PDF e criação de arquivo por `expo-print`, mas a geração no dispositivo tem diferenças de margem e assets entre plataformas. Nesta spec, `expo-print` será usado para abrir a impressão, não como fonte canônica do layout. Para salvar/compartilhar, usar a capacidade nativa indicada pela documentação do [Expo Sharing](https://docs.expo.dev/versions/latest/sdk/sharing/).

## 9. Compra e entitlement

Proposta técnica:

- produto não consumível único: `printables_complete_v1`;
- camada de entitlement desacoplada da interface;
- estados: `loading`, `available`, `purchasing`, `owned`, `unavailable`, `error`;
- ações: comprar, restaurar, tentar novamente e abrir kit;
- preço sempre vindo da loja, nunca fixado no código;
- restauração na Área dos Responsáveis;
- cache local do entitlement para uso offline;
- confirmação da compra antes de liberar o conteúdo;
- tratamento de compra pendente, cancelada, restaurada e reembolsada.

A documentação atual do Expo indica `react-native-purchases`/RevenueCat ou `expo-iap`, ambos dependentes de código nativo e development build: [Using in-app purchases](https://docs.expo.dev/guides/in-app-purchases/). A recomendação inicial é RevenueCat para unificar StoreKit, Play Billing, restauração e validação sem criar um backend próprio.

Antes da implementação, o SDK escolhido deverá passar por revisão de privacidade para público infantil. Compras não poderão ser desenvolvidas ou testadas apenas no Expo Go.

## 10. Área dos Responsáveis

O fluxo comercial não deve parecer parte da recompensa infantil.

Requisitos:

- entrada discreta `Área dos Responsáveis`;
- barreira parental antes de preço, compra, restauração, links externos e compartilhamento;
- texto claro sobre o que será liberado;
- prévia das páginas e das medidas;
- preço localizado fornecido pela loja;
- botão `Restaurar compra`;
- termos e política de privacidade;
- nenhuma contagem regressiva, escassez falsa, animação persuasiva ou pressão sobre a criança;
- paywall utilizável por TalkBack e com contraste AA.

A barreira parental poderá usar uma instrução simples que exija leitura adulta, por exemplo manter um botão pressionado e resolver uma operação curta. O mecanismo final será especificado antes da implementação.

## 11. Estados e falhas

- Sem internet antes da compra: explicar que a conexão é necessária para consultar a loja.
- Loja indisponível: manter o app gratuito funcionando.
- Compra cancelada: voltar ao paywall sem mensagem de erro agressiva.
- Compra pendente: não liberar até confirmação e explicar o estado.
- Compra concluída: liberar e oferecer abrir o primeiro PDF.
- Restauração sem compra: informar que nenhuma compra foi encontrada.
- PDF indisponível/corrompido: bloquear compartilhamento e registrar erro local.
- Sem app compatível para compartilhar/imprimir: permitir ao menos abrir ou salvar quando a plataforma oferecer alternativa.

## 12. Acessibilidade do produto imprimível e do paywall

- Texto de carta com contraste mínimo de 4,5:1.
- Informação de tema não depende só de cor.
- Corpo mínimo recomendado no PDF: 11 pt; nomes de carta: 14 pt ou maior.
- PDF com texto pesquisável e ordem de leitura coerente onde aplicável.
- Página de instruções em linguagem simples.
- Paywall com cabeçalhos semânticos, foco previsível e alvos de 48 dp.
- Preço e estado de compra anunciados sem duplicação.
- Nenhuma animação obrigatória para compreender ou concluir a compra.

## 13. Privacidade e dados

- Não criar conta própria na V1.
- Não coletar nome, idade, e-mail, localização ou identificadores de criança.
- Documentar exatamente os dados tratados pelo provedor de compra.
- Atualizar a política de privacidade e as declarações de Data Safety/App Privacy.
- Não adicionar analytics ou publicidade junto com a primeira monetização.
- Manter o SDK comercial isolado da área infantil e revisar sua adequação às políticas de famílias.

## 14. Critérios de aceite

### PDF

- Cada tema contém exatamente 18 pares e 36 cartas.
- IDs, nomes e artes correspondem ao conteúdo aprovado.
- Cada carta mede 63 x 88 mm no arquivo.
- O quadrado de calibração mede 50 x 50 mm em impressão a 100%.
- Todas as páginas passam por renderização e inspeção visual.
- Não há texto cortado, sobreposição, glifo ausente ou imagem pixelizada.
- Marcas de corte e versos ficam alinhados dentro da tolerância de 0,5 mm no arquivo.
- Textos permanecem pesquisáveis no PDF.
- Amostra gratuita e kit pago usam exatamente a mesma escala.

### Compra

- Produto aparece com título e preço localizados da loja.
- Compra aprovada libera todos os cinco temas.
- Compra cancelada ou pendente não libera conteúdo.
- Restauração funciona após reinstalação em sandbox/teste interno.
- Reembolso ou revogação remove o entitlement quando a loja o informar.
- Fluxos Android e iOS passam pelos ambientes de teste das lojas.
- Área comercial fica atrás da barreira parental.
- App gratuito continua funcionando quando a loja ou a rede falha.

### Acessibilidade e famílias

- TalkBack/VoiceOver concluem paywall, compra simulada, restauração e abertura do PDF.
- Contraste, foco, rótulos e alvos atendem à auditoria de acessibilidade.
- Textos comerciais falam com o responsável, não com a criança.
- Declarações de público, privacidade e compras são atualizadas antes da publicação.

## 15. Ordem de implementação após aprovação

1. Finalizar e importar o conteúdo editorial revisado.
2. Corrigir os itens de acessibilidade de prioridade alta.
3. Aprovar o design de uma carta, verso, instrução e página de calibração.
4. Produzir o gerador PDF e validar primeiro o tema Santos.
5. Gerar e revisar os outros quatro temas.
6. Criar a Área dos Responsáveis e o catálogo local de kits.
7. Integrar compras em development builds.
8. Implementar restauração e entitlement offline.
9. Adicionar abrir, compartilhar e imprimir.
10. Executar testes sandbox, impressão física e revisão de políticas.

## 16. Decisões que aguardam aprovação

1. Modelo: uma compra única para todos os cinco temas, em vez de vender cada tema separadamente.
2. Amostra: 8 pares gratuitos do tema Santos.
3. Formato V1: apenas A4; Carta/Letter fica para uma atualização.
4. Carta: 63 x 88 mm, 9 por página.
5. Entrega: PDFs pré-gerados e empacotados, com impressão/compartilhamento pelo sistema.
6. Compra: RevenueCat como recomendação inicial, sujeito à revisão de privacidade infantil.
7. Posicionamento: sem anúncios e sem assinatura.

Preço e país de lançamento serão definidos em uma spec comercial curta depois que o protótipo do PDF permitir estimar valor e custo de produção.

