const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'content-review');
const JSON_OUTPUT = path.join(OUTPUT_DIR, 'saints-content.json');
const MARKDOWN_OUTPUT = path.join(OUTPUT_DIR, 'saints-content.md');

function loadExportedConstant(filePath, exportName) {
  const source = fs
    .readFileSync(filePath, 'utf8')
    .replace(`export const ${exportName} =`, `const ${exportName} =`)
    .replace(/export function /g, 'function ');

  const context = {
    // Image imports are intentionally reduced to their paths. Images are not
    // part of the editorial export, but the source still needs to be evaluated.
    require: (assetPath) => assetPath,
  };

  vm.runInNewContext(
    `${source}\nglobalThis.__exportedContent = ${exportName};`,
    context,
    { filename: filePath },
  );

  return context.__exportedContent;
}

function buildEditorialContent() {
  const saints = loadExportedConstant(
    path.join(ROOT, 'src/data/saints.js'),
    'SAINTS',
  );
  const prayers = loadExportedConstant(
    path.join(ROOT, 'src/data/prayers.js'),
    'SAINT_PRAYERS',
  );

  return saints.map(({ image, ...saint }) => ({
    ...saint,
    prayer: prayers[saint.id] || '',
  }));
}

function buildMarkdown(saints) {
  const lines = [
    '# Curadoria de conteúdo — Jogo da Memória dos Santos',
    '',
    'Edite livremente os textos deste arquivo. Não altere o campo **ID**, pois ele liga o conteúdo às imagens e ao aplicativo.',
    '',
    'Ao finalizar, envie este Markdown ou, preferencialmente, o arquivo `saints-content.json` atualizado.',
    '',
    `Total: **${saints.length} santos**`,
    '',
  ];

  saints.forEach((saint, index) => {
    lines.push(
      `## ${index + 1}. ${saint.name}`,
      '',
      `- **ID (não alterar):** \`${saint.id}\``,
      `- **Nome:** ${saint.name}`,
      `- **Descrição curta:** ${saint.short_description}`,
      `- **Emoji:** ${saint.emoji}`,
      `- **Dia festivo:** ${saint.feast_day || '—'}`,
      `- **Padroeiro(a) / temas:** ${saint.patronage.length ? saint.patronage.join(', ') : '—'}`,
      `- **Região:** ${saint.region || '—'}`,
      `- **Categoria:** ${saint.category || '—'}`,
      `- **Época:** ${saint.era || '—'}`,
      '',
      '### História',
      '',
      ...saint.story.flatMap((paragraph, paragraphIndex) => [
        `${paragraphIndex + 1}. ${paragraph}`,
        '',
      ]),
      '### Você sabia?',
      '',
      saint.fact,
      '',
      '### Oração',
      '',
      saint.prayer,
      '',
      '---',
      '',
    );
  });

  return `${lines.join('\n').trim()}\n`;
}

const saints = buildEditorialContent();
const jsonDocument = {
  instructions: {
    purpose: 'Arquivo para curadoria dos textos exibidos no aplicativo.',
    immutable_field: 'id',
    return_format: 'Mantenha a estrutura JSON e envie este arquivo atualizado.',
  },
  saints,
};

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(JSON_OUTPUT, `${JSON.stringify(jsonDocument, null, 2)}\n`);
fs.writeFileSync(MARKDOWN_OUTPUT, buildMarkdown(saints));

console.log(`Exportados ${saints.length} santos:`);
console.log(path.relative(ROOT, JSON_OUTPUT));
console.log(path.relative(ROOT, MARKDOWN_OUTPUT));
