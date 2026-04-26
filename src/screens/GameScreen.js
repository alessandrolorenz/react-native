import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import GameBoard from '../components/GameBoard';
import Header from '../components/Header';
import ResultModal from '../components/ResultModal';
import { SAINTS } from '../data/saints';
import { buildDeck } from '../utils/deck';
import { colors } from '../theme/colors';

const PAIRS = 8;            // 4x4 grid
const FLIP_BACK_MS = 700;   // 500-800ms range per spec

const initialState = () => ({
  deck: buildDeck(SAINTS, PAIRS),
  flipped: [],          // indices of currently face-up unmatched cards (max 2)
  matched: new Set(),   // matchKeys that have been paired
  busy: false,          // true during flip-back delay - blocks new taps
  moves: 0,             // count of two-card attempts
  lastMatchedSaint: null,
  isWon: false,
});

function reducer(state, action) {
  switch (action.type) {
    case 'FLIP': {
      const { index } = action;
      // Guard: ignore taps that would violate the rules.
      if (state.busy) return state;
      if (state.flipped.includes(index)) return state;
      if (state.flipped.length >= 2) return state;
      const card = state.deck[index];
      if (state.matched.has(card.matchKey)) return state;

      const nextFlipped = [...state.flipped, index];
      if (nextFlipped.length < 2) {
        return { ...state, flipped: nextFlipped };
      }

      // Two cards face up - evaluate.
      const [aIdx, bIdx] = nextFlipped;
      const a = state.deck[aIdx];
      const b = state.deck[bIdx];
      const moves = state.moves + 1;

      if (a.matchKey === b.matchKey) {
        const matched = new Set(state.matched);
        matched.add(a.matchKey);
        const isWon = matched.size === PAIRS;
        return {
          ...state,
          flipped: [],
          matched,
          moves,
          lastMatchedSaint: a.saint,
          isWon,
        };
      }

      // Mismatch: keep both visible, lock input until RESOLVE_MISS fires.
      return { ...state, flipped: nextFlipped, busy: true, moves };
    }
    case 'RESOLVE_MISS':
      return { ...state, flipped: [], busy: false };
    case 'RESET':
      return initialState();
    default:
      return state;
  }
}

export default function GameScreen({ onBack }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const timeoutRef = useRef(null);

  // Schedule the flip-back when two non-matching cards are showing.
  useEffect(() => {
    if (state.busy) {
      timeoutRef.current = setTimeout(() => {
        dispatch({ type: 'RESOLVE_MISS' });
      }, FLIP_BACK_MS);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [state.busy]);

  const handleCardPress = useCallback((index) => {
    dispatch({ type: 'FLIP', index });
  }, []);

  const handlePlayAgain = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <View style={styles.safe}>
      <Header onBack={onBack} onRestart={handlePlayAgain} moves={state.moves} />
      <View style={styles.boardWrap}>
        <GameBoard
          deck={state.deck}
          flipped={state.flipped}
          matched={state.matched}
          busy={state.busy}
          onCardPress={handleCardPress}
        />
      </View>
      <ResultModal
        visible={state.isWon}
        saint={state.lastMatchedSaint}
        onPlayAgain={handlePlayAgain}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  boardWrap: {
    flex: 1,
    justifyContent: 'center',
  },
});
