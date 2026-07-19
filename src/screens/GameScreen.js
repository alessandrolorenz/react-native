import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import GameBoard from '../components/GameBoard';
import Header from '../components/Header';
import ResultModal from '../components/ResultModal';
import CampaignCompleteModal from '../components/CampaignCompleteModal';
import { buildDeck } from '../utils/deck';
import { colors } from '../theme/colors';
import { applyMissPenalty, buildPhaseSummary, getMatchScore } from '../utils/scoring';
import { SAFE_AREA } from '../utils/safeArea';
import { colors as semanticColors } from '../theme';
import useAccessibilityFocus from '../hooks/useAccessibilityFocus';
import useReducedMotion from '../hooks/useReducedMotion';

const FLIP_BACK_MS = 700;

const createPhaseState = (phase, items) => ({
  deck: buildDeck(items, phase.pairs),
  flipped: [],
  matched: new Set(),
  busy: false,
  attempts: 0,
  comboStreak: 0,
  bestCombo: 0,
  phasePoints: 0,
  startedAtMs: Date.now(),
  completedAtMs: null,
  lastMatchedItem: null,
  isWon: false,
  eventSequence: 0,
  lastEvent: null,
});

function getInitialPhaseId(phases, progress) {
  const firstOpen =
    phases.find((phase) => phase.id <= progress.unlockedPhase && !progress.completedPhases[phase.id]) ||
    phases[Math.max(0, progress.unlockedPhase - 1)] ||
    phases[0];
  return firstOpen.id;
}

function reducer(state, action) {
  switch (action.type) {
    case 'START_PHASE':
      return createPhaseState(action.phase, action.items);
    case 'FLIP': {
      const { index } = action;
      if (state.busy) return state;
      if (state.flipped.includes(index)) return state;
      if (state.flipped.length >= 2) return state;
      const card = state.deck[index];
      if (state.matched.has(card.matchKey)) return state;

      const nextFlipped = [...state.flipped, index];
      if (nextFlipped.length < 2) {
        const eventSequence = state.eventSequence + 1;
        return {
          ...state,
          flipped: nextFlipped,
          eventSequence,
          lastEvent: {
            id: eventSequence,
            type: 'reveal',
            itemName: card.item.name,
            position: index + 1,
          },
        };
      }

      const [aIdx, bIdx] = nextFlipped;
      const a = state.deck[aIdx];
      const b = state.deck[bIdx];
      const attempts = state.attempts + 1;

      if (a.matchKey === b.matchKey) {
        const matched = new Set(state.matched);
        matched.add(a.matchKey);
        const comboStreak = state.comboStreak + 1;
        const bestCombo = Math.max(state.bestCombo, comboStreak);
        const phasePoints = state.phasePoints + getMatchScore(comboStreak);
        const isWon = matched.size === action.phasePairs;
        const eventSequence = state.eventSequence + 1;

        return {
          ...state,
          flipped: [],
          matched,
          attempts,
          comboStreak,
          bestCombo,
          phasePoints,
          completedAtMs: isWon ? action.nowMs : null,
          lastMatchedItem: a.item,
          isWon,
          eventSequence,
          lastEvent: {
            id: eventSequence,
            type: 'match',
            itemName: a.item.name,
            comboStreak,
            isWon,
          },
        };
      }

      const eventSequence = state.eventSequence + 1;
      return {
        ...state,
        flipped: nextFlipped,
        busy: true,
        attempts,
        comboStreak: 0,
        phasePoints: applyMissPenalty(state.phasePoints),
        eventSequence,
        lastEvent: {
          id: eventSequence,
          type: 'miss',
          firstItemName: a.item.name,
          secondItemName: b.item.name,
        },
      };
    }
    case 'RESOLVE_MISS':
      return { ...state, flipped: [], busy: false };
    default:
      return state;
  }
}

function getPhaseStatus(phaseId, activePhaseId, progress) {
  if (phaseId > progress.unlockedPhase) return 'locked';
  if (phaseId === activePhaseId) return 'active';
  if (progress.completedPhases[phaseId]) return 'completed';
  return 'unlocked';
}

const PHASE_STATUS_LABEL = {
  locked: 'bloqueada',
  unlocked: 'disponível',
  active: 'fase atual',
  completed: 'concluída',
};

const PHASE_STATUS_MARK = {
  locked: '🔒',
  unlocked: '›',
  active: 'Atual',
  completed: '✓',
};

export default function GameScreen({ theme, onBack, phases, progress, onPhaseComplete }) {
  const [activePhaseId, setActivePhaseId] = useState(() => getInitialPhaseId(phases, progress));
  const activePhase = useMemo(
    () => phases.find((phase) => phase.id === activePhaseId) || phases[0],
    [activePhaseId, phases],
  );

  const [state, dispatch] = useReducer(
    reducer,
    null,
    () => createPhaseState(activePhase, theme.items),
  );
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timeoutRef = useRef(null);
  const reportedSummaryRef = useRef(null);
  const titleRef = useRef(null);
  const reduceMotion = useReducedMotion();
  useAccessibilityFocus(titleRef, activePhaseId);

  useEffect(() => {
    dispatch({ type: 'START_PHASE', phase: activePhase, items: theme.items });
    setElapsedSeconds(0);
    reportedSummaryRef.current = null;
  }, [activePhase, theme.items]);

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

  useEffect(() => {
    const event = state.lastEvent;
    if (!event) return;

    if (event.type === 'reveal') {
      AccessibilityInfo.announceForAccessibility(
        `Carta ${event.position}, ${event.itemName}, revelada.`,
      );
      return;
    }

    if (event.type === 'match') {
      AccessibilityInfo.announceForAccessibility(
        event.isWon
          ? `Par encontrado: ${event.itemName}. Fase concluída!`
          : `Par encontrado: ${event.itemName}. Combo ${event.comboStreak}.`,
      );
      return;
    }

    AccessibilityInfo.announceForAccessibility(
      `${event.firstItemName} e ${event.secondItemName} não formam um par. As cartas serão fechadas.`,
    );
  }, [state.lastEvent]);

  useEffect(() => {
    if (state.isWon) {
      const finalSeconds = Math.max(
        1,
        Math.round(((state.completedAtMs || Date.now()) - state.startedAtMs) / 1000),
      );
      setElapsedSeconds(finalSeconds);
      return;
    }

    const interval = setInterval(() => {
      const currentSeconds = Math.max(1, Math.round((Date.now() - state.startedAtMs) / 1000));
      setElapsedSeconds(currentSeconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isWon, state.startedAtMs, state.completedAtMs]);

  const handleCardPress = useCallback((index) => {
    dispatch({ type: 'FLIP', index, phasePairs: activePhase.pairs, nowMs: Date.now() });
  }, [activePhase.pairs]);

  const handlePlayAgain = useCallback(() => {
    dispatch({ type: 'START_PHASE', phase: activePhase, items: theme.items });
    setElapsedSeconds(0);
    reportedSummaryRef.current = null;
    AccessibilityInfo.announceForAccessibility(
      `${activePhase.label} reiniciada. ${activePhase.pairs * 2} cartas no tabuleiro.`,
    );
  }, [activePhase, theme.items]);

  const handleSelectPhase = useCallback((phaseId) => {
    if (phaseId > progress.unlockedPhase) return;
    setActivePhaseId(phaseId);
  }, [progress.unlockedPhase]);

  const phaseSummary = useMemo(() => {
    if (!state.isWon) return null;
    const finalElapsed = Math.max(
      1,
      Math.round(((state.completedAtMs || Date.now()) - state.startedAtMs) / 1000),
    );

    return buildPhaseSummary({
      phase: activePhase,
      phasePoints: state.phasePoints,
      attempts: state.attempts,
      elapsedSeconds: finalElapsed,
      bestCombo: state.bestCombo,
    });
  }, [state.isWon, state.completedAtMs, state.startedAtMs, state.phasePoints, state.attempts, state.bestCombo, activePhase]);

  useEffect(() => {
    if (!phaseSummary) return;
    const reportKey = `${phaseSummary.phaseId}-${phaseSummary.totalPoints}-${phaseSummary.elapsedSeconds}-${state.startedAtMs}`;
    if (reportedSummaryRef.current === reportKey) return;
    reportedSummaryRef.current = reportKey;
    onPhaseComplete(phaseSummary);
  }, [phaseSummary, onPhaseComplete, state.startedAtMs]);

  const hasNextPhase = activePhase.id < phases.length;
  const lastPhaseId = phases[phases.length - 1]?.id;
  const isCampaignCompletedNow = !!phaseSummary && phaseSummary.phaseId === lastPhaseId;

  const handleNextPhase = useCallback(() => {
    if (!hasNextPhase) return;
    setActivePhaseId(activePhase.id + 1);
  }, [activePhase.id, hasNextPhase]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerWrapper}>
        <Header
          titleRef={titleRef}
          onBack={onBack}
          onRestart={handlePlayAgain}
          moves={state.attempts}
          activePhase={activePhase}
          totalScore={progress.totalScore}
          phasePoints={state.phasePoints}
          combo={state.comboStreak}
          elapsedSeconds={elapsedSeconds}
        />
      </View>

      <View style={styles.phaseStrip}>
        {phases.map((phase) => {
          const status = getPhaseStatus(phase.id, activePhase.id, progress);
          return (
            <Pressable
              key={phase.id}
              onPress={() => handleSelectPhase(phase.id)}
              disabled={status === 'locked'}
              style={[styles.phaseChip, styles[`chip_${status}`]]}
              accessibilityRole="button"
              accessibilityLabel={`Fase ${phase.id}, grade ${phase.rows} por ${phase.cols}, ${PHASE_STATUS_LABEL[status]}`}
              accessibilityHint={status === 'locked' || status === 'active' ? undefined : 'Muda para esta fase'}
              accessibilityState={{
                disabled: status === 'locked',
                selected: status === 'active',
              }}
            >
              <Text style={styles.phaseChipTitle}>F{phase.id}</Text>
              <Text style={styles.phaseChipMeta}>{phase.rows}x{phase.cols}</Text>
              <Text style={styles.phaseChipStatus}>{PHASE_STATUS_MARK[status]}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.boardWrap}>
        <Text style={styles.boardInstruction}>
          Encontre os pares. Escolha duas cartas.
        </Text>
        <GameBoard
          phase={activePhase}
          deck={state.deck}
          flipped={state.flipped}
          matched={state.matched}
          busy={state.busy}
          reduceMotion={reduceMotion}
          cardBackGlyph={theme.appearance?.cardBackGlyph}
          onCardPress={handleCardPress}
        />
      </View>
      <ResultModal
        visible={state.isWon && !isCampaignCompletedNow}
        theme={theme}
        item={state.lastMatchedItem}
        hasNextPhase={hasNextPhase}
        onNextPhase={handleNextPhase}
        onPlayAgain={handlePlayAgain}
        onBackHome={onBack}
        reduceMotion={reduceMotion}
      />

      <CampaignCompleteModal
        visible={state.isWon && isCampaignCompletedNow}
        theme={theme}
        item={state.lastMatchedItem}
        onBackHome={onBack}
        reduceMotion={reduceMotion}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  headerWrapper: {
    paddingTop: SAFE_AREA.paddingTop,
    zIndex: 10,
    backgroundColor: colors.bg,
  },
  phaseStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 6,
  },
  phaseChip: {
    flex: 1,
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  phaseChipTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
  },
  phaseChipMeta: {
    fontSize: 11,
    color: colors.textSoft,
  },
  phaseChipStatus: {
    minHeight: 14,
    fontSize: 10,
    fontWeight: '800',
    color: colors.text,
  },
  chip_locked: {
    backgroundColor: semanticColors.chip.locked,
    borderColor: colors.cardBackEdge,
  },
  chip_unlocked: {
    backgroundColor: semanticColors.chip.unlocked,
    borderColor: colors.cardBackEdge,
  },
  chip_active: {
    backgroundColor: colors.accent,
    borderColor: colors.primaryDark,
  },
  chip_completed: {
    backgroundColor: semanticColors.chip.completed,
    borderColor: colors.cardBackEdge,
  },
  boardWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: SAFE_AREA.paddingBottom,
  },
  boardInstruction: {
    color: colors.textSoft,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 2,
  },
});
