import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Card from './Card';
import { spacing } from '../theme/colors';

// Lays out the deck as a 4x4 grid. Card size is computed from window width
// so the board fits any phone without horizontal scroll. Plain View grid
// (no FlatList) since 16 items render cheaply.
const COLUMNS = 4;
const HORIZONTAL_PADDING = spacing.md;
const CARD_MARGIN = 4;

export default function GameBoard({ deck, flipped, matched, busy, onCardPress }) {
  const { width } = Dimensions.get('window');
  const available = width - HORIZONTAL_PADDING * 2;
  const cardSize = Math.floor(available / COLUMNS) - CARD_MARGIN * 2;

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
  },
});
