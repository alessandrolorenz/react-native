// Prayers for each saint, displayed on campaign completion screen.
export const SAINT_PRAYERS = {
  'francisco-assis':
    'São Francisco, padroeiro da natureza, ajude-nos a cuidar de todas as criaturas com amor e compaixão, assim como você fez em vida. Amém.',
  'carlo-acutis':
    'São Carlo Acutis, guia dos jovens, inspire-nos a usar a tecnologia com propósito e para aproximar as pessoas de Cristo. Amém.',
  'jose':
    'São José, protetor das famílias, abençoe-nos com sabedoria, trabalho honesto e amor verdadeiro. Amém.',
  'antonio':
    'Santo Antônio, amigo dos que buscam, ajude-nos a encontrar o que perdemos e a viver com fé e caridade. Amém.',
  'teresinha':
    'Santa Teresinha, ensine-nos o caminho da pequena via, fazendo com amor as coisas simples do dia a dia. Amém.',
  'padre-pio':
    'São Padre Pio, interceda por nós para que suportemos as dificuldades com paciência e confiança em Deus. Amém.',
  'aparecida':
    'Nossa Senhora Aparecida, Mãe querida do Brasil, cobre-nos com seu manto e conduza-nos sempre a Jesus. Amém.',
  'rita-cassia':
    'Santa Rita de Cássia, santa da compaixão, interceda por aqueles que enfrentam dificuldades e sofrimentos. Amém.',
  'madre-teresa-calcuta':
    'Santa Teresa de Calcutá, inspira-nos a servir os mais pobres com ternura, humildade e amor sem medidas. Amém.',
  'santa-clara':
    'Santa Clara de Assis, contemplativa fiel, ajuda-nos a encontrar paz na oração e na simplicidade. Amém.',
  'santa-paulina':
    'Santa Paulina, missionária de esperança, fortalece-nos para cuidar dos irmãos com alegria e generosidade. Amém.',
  'santo-agostinho':
    'Santo Agostinho, doutor da Igreja, ilumina nossas mentes e corações no caminho da verdade. Amém.',
  'sao-bento':
    'São Bento, protetor contra o mal, guarda nosso lar e nossa família na paz de Cristo. Amém.',
  'sao-domingos':
    'São Domingos, pregador da verdade, ensina-nos a anunciar o Evangelho com sabedoria e caridade. Amém.',
  'santo-inacio-loiola':
    'Santo Inácio de Loiola, guia espiritual, ajuda-nos a discernir e escolher sempre a vontade de Deus. Amém.',
  'sao-joao-paulo-ii':
    'São João Paulo II, pastor dos jovens, fortalece nossa coragem para viver a fé no mundo de hoje. Amém.',
  'sao-tomas-aquino':
    'São Tomás de Aquino, doutor da Igreja, ilumina nosso entendimento para unir fé e razão com humildade. Amém.',
  'sao-vicente-paula':
    'São Vicente de Paulo, pai dos pobres, desperta em nós a compaixão e o serviço aos mais necessitados. Amém.',
};

export function getPrayerForSaint(saintId) {
  return SAINT_PRAYERS[saintId] || 'Que a graça de Deus nos acompanhe sempre. Amém.';
}
