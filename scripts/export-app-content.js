const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'content-review');
const JSON_OUTPUT = path.join(OUTPUT_DIR, 'app-content.json');

const THEME_SOURCES = [
  {
    id: 'saints',
    configFile: 'src/themes/saints/config.js',
    configExport: 'saintsTheme',
    itemsFile: 'src/data/saints.js',
    itemsExport: 'SAINTS',
    configItemsExport: 'SAINT_ITEMS',
  },
  {
    id: 'symbols',
    configFile: 'src/themes/symbols/config.js',
    configExport: 'symbolsTheme',
    itemsFile: 'src/themes/symbols/items.js',
    itemsExport: 'SYMBOL_ITEMS',
  },
  {
    id: 'biblical-places',
    configFile: 'src/themes/biblical-places/config.js',
    configExport: 'biblicalPlacesTheme',
    itemsFile: 'src/themes/biblical-places/items.js',
    itemsExport: 'BIBLICAL_PLACE_ITEMS',
  },
  {
    id: 'parables',
    configFile: 'src/themes/parables/config.js',
    configExport: 'parablesTheme',
    itemsFile: 'src/themes/parables/items.js',
    itemsExport: 'PARABLE_ITEMS',
  },
  {
    id: 'miracles',
    configFile: 'src/themes/miracles/config.js',
    configExport: 'miraclesTheme',
    itemsFile: 'src/themes/miracles/items.js',
    itemsExport: 'MIRACLE_ITEMS',
  },
];

function stripModuleSyntax(source) {
  return source
    .replace(/^import[^;]+;\s*$/gm, '')
    .replace(/export const /g, 'const ')
    .replace(/export function /g, 'function ');
}

function normalizeAssetPath(sourceFile, assetPath) {
  const absoluteAssetPath = path.resolve(path.dirname(sourceFile), assetPath);
  return path.relative(ROOT, absoluteAssetPath).split(path.sep).join('/');
}

function loadExportedConstant(relativeFile, exportName, injected = {}) {
  const filePath = path.join(ROOT, relativeFile);
  const source = stripModuleSyntax(fs.readFileSync(filePath, 'utf8'));
  const context = {
    ...injected,
    require: (assetPath) => normalizeAssetPath(filePath, assetPath),
  };

  vm.runInNewContext(
    `${source}\nglobalThis.__exportedContent = ${exportName};`,
    context,
    { filename: filePath },
  );

  return context.__exportedContent;
}

function normalizeSaints(saints, prayers) {
  return saints.map((saint) => ({
    id: saint.id,
    image: saint.image,
    name: saint.name,
    shortDescription: saint.short_description,
    emoji: saint.emoji,
    story: saint.story,
    fact: saint.fact,
    prayer: prayers[saint.id] || '',
    metadata: {
      feastDay: saint.feast_day,
      patronage: saint.patronage,
      region: saint.region,
      category: saint.category,
      era: saint.era,
    },
  }));
}

function getFilterOptions(items, key) {
  const options = new Set();

  items.forEach((item) => {
    const value = item.metadata?.[key];
    if (Array.isArray(value)) {
      value.filter(Boolean).forEach((entry) => options.add(entry));
    } else if (typeof value === 'string' && value) {
      options.add(value);
    }
  });

  return Array.from(options).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

function resolveEditableValue(value) {
  if (typeof value !== 'function') return value;

  return value({
    id: '{{item.id}}',
    name: '{{item.name}}',
    fact: '{{item.fact}}',
  });
}

function serializeConfig(config, items) {
  return {
    title: config.title,
    displayTitle: config.displayTitle,
    subtitle: config.subtitle,
    description: config.description,
    coverGlyph: config.coverGlyph,
    copy: config.copy,
    filters: config.filters.map((filter) => ({
      ...filter,
      options: getFilterOptions(items, filter.key),
    })),
    profile: config.profile,
    appearance: config.appearance,
    completion: Object.fromEntries(
      Object.entries(config.completion).map(([key, value]) => [
        key,
        resolveEditableValue(value),
      ]),
    ),
  };
}

function loadTheme(source, prayers) {
  const rawItems = loadExportedConstant(source.itemsFile, source.itemsExport);
  const items = source.id === 'saints' ? normalizeSaints(rawItems, prayers) : rawItems;
  const injectedItemsName = source.configItemsExport || source.itemsExport;
  const config = loadExportedConstant(source.configFile, source.configExport, {
    [injectedItemsName]: items,
    getPrayerForSaint: () => '{{item.prayer}}',
  });

  return {
    id: source.id,
    ...serializeConfig(config, items),
    items,
  };
}

const prayers = loadExportedConstant('src/data/prayers.js', 'SAINT_PRAYERS');
const phases = loadExportedConstant('src/data/phases.js', 'PHASES');
const themes = THEME_SOURCES.map((source) => loadTheme(source, prayers));

const jsonDocument = {
  schemaVersion: 1,
  instructions: {
    purpose:
      'Arquivo único para revisar todo o conteúdo editorial exibido nos cinco temas do aplicativo.',
    immutableFields: [
      'themes[].id',
      'themes[].items[].id',
      'themes[].items[].image',
      'themes[].filters[].key',
      'themes[].profile.*.key',
    ],
    editableFields:
      'Todos os demais textos, emojis, metadados, histórias, fatos, orações e opções editoriais podem ser atualizados.',
    returnFormat:
      'Mantenha a estrutura JSON válida e envie este mesmo arquivo atualizado.',
    templateSyntax:
      'Textos como {{item.name}}, {{item.fact}} e {{item.prayer}} são marcadores usados pelo aplicativo; não os remova sem avisar.',
  },
  campaign: {
    phases,
  },
  themes,
};

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(JSON_OUTPUT, `${JSON.stringify(jsonDocument, null, 2)}\n`);

const totalItems = themes.reduce((sum, theme) => sum + theme.items.length, 0);
console.log(`Exportados ${themes.length} temas e ${totalItems} itens:`);
themes.forEach((theme) => console.log(`- ${theme.title}: ${theme.items.length}`));
console.log(path.relative(ROOT, JSON_OUTPUT));
