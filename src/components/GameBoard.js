import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Card from './Card';
import { spacing } from '../theme/colors';

const MIN_CARD_SIZE = 48;
const HORIZONTAL_PADDING = spacing.md;
const CARD_MARGIN = 4;

export default function GameBoard({
  deck,
  phase,
  flipped,
  matched,
  busy,
  reduceMotion,
  cardBackGlyph,
  onCardPress,
}) {
  const { width, height } = Dimensions.get('window');
  const rows = phase.rows;
  const columns = phase.cols;
  const available = width - HORIZONTAL_PADDING * 2;
  const maxByWidth = Math.floor(available / columns) - CARD_MARGIN * 2;

  // Keeps larger phases visible on smaller displays.
  const verticalAllowance = Math.max(300, height - 320);
  const maxByHeight = Math.floor(verticalAllowance / rows) - CARD_MARGIN * 2;
  const cardSize = Math.max(MIN_CARD_SIZE, Math.min(maxByWidth, maxByHeight));

  return (
    <View style={styles.board}>
      {deck.map((card, index) => {
        const isFlipped = flipped.includes(index);
        const isMatched = matched.has(card.matchKey);
        return (
          <Card
            key={card.cardId}
            card={card}
            size={cardSize}
            isOpen={isFlipped || isMatched}
            isMatched={isMatched}
            disabled={busy || isMatched}
            position={index + 1}
            totalCards={deck.length}
            row={Math.floor(index / columns) + 1}
            column={(index % columns) + 1}
            reduceMotion={reduceMotion}
            cardBackGlyph={cardBackGlyph}
            onPress={() => onCardPress(index)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: HORIZONTAL_PADDING - CARD_MARGIN,
    alignSelf: 'center',
  },
});
