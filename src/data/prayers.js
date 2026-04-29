// Prayers for each saint, displayed on campaign completion screen.
export const SAINT_PRAYERS = {
  'francisco-assis':
    'São Francisco, padroeiro da natureza, ajude-nos a cuidar de todas as criaturas com amor e compaixão, assim como você fez em vida. Amém.',
  'carlo-acutis':
    'São Carlo Acutis, guia dos jovens, inspire-nos a usar a tecnologia com propósito e para aproximar as pessoas de Cristo. Amém.',
  'jose':
    'São José, protetor das famílias, abençoe-nos com sabedoria, trabalho honesto e amor verdadeiro. Amém.',
  'cecilia':
    'Santa Cecília, padroeira da música, ajude-nos a louvar a Deus em cada momento de nossas vidas. Amém.',
  'rita-cassia':
    'Santa Rita de Cássia, santa da compaixão, interceda por aqueles que enfrentam dificuldades e sofrimentos. Amém.',
  'paulo':
    'São Paulo, apóstolo das gentes, fortaleça nossa fé e ajude-nos a pregar o Evangelho com coragem. Amém.',
  'lucas':
    'São Lucas, evangelista e curador, abençoe a medicina, a arte e a compaixão pelo próximo. Amém.',
  'joao':
    'São João Batista, o batizador, purifique nossos corações e leve-nos mais perto de Jesus. Amém.',
  'tomas-aquino':
    'Santo Tomás de Aquino, doutor da Igreja, ilumina nossas mentes para compreender os mistérios da fé. Amém.',
  'clara-assis':
    'Santa Clara de Assis, contemplativa, ajude-nos a encontrar paz na oração e na simplicidade. Amém.',
  'marta':
    'Santa Marta, padroeira das cozinheiras, benzoa nosso trabalho diário e nossos lares. Amém.',
  'lucia':
    'Santa Lúcia, mártir, dê-nos coragem para enfrentar as provações com fé inabalável. Amém.',
  'antonio-padua':
    'Santo Antônio de Pádua, santo milagroso, ajude-nos a encontrar o que perdemos e a vencer nossas fraquezas. Amém.',
  'bento':
    'São Bento, padroeiro da Europa, guie nossas comunidades e trabalhos com ordem e paz. Amém.',
  'teresinha':
    'Santa Teresinha, carmelita, ensine-nos que a santidade está nas pequenas coisas feitas com grande amor. Amém.',
  'agostinho':
    'Santo Agostinho, doutor da Igreja, ilumina nossos caminhos rumo à verdade e à redenção. Amém.',
  'margarida':
    'Santa Margarida de Antióquia, padroeira das mães, proteja as gestantes e as crianças recém-nascidas. Amém.',
  'teotonio':
    'São Teotônio, padroeiro de Portugal, cuida de nós e nossa fé sob a proteção de Cristo. Amém.',
};

export function getPrayerForSaint(saintId) {
  return SAINT_PRAYERS[saintId] || 'Que a graça de Deus nos acompanhe sempre. Amém.';
}
