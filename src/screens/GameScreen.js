import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import GameBoard from '../components/GameBoard';
import Header from '../components/Header';
import ResultModal from '../components/ResultModal';
import CampaignCompleteModal from '../components/CampaignCompleteModal';
import { SAINTS } from '../data/saints';
import { buildDeck } from '../utils/deck';
import { colors } from '../theme/colors';
import { applyMissPenalty, buildPhaseSummary, getMatchScore } from '../utils/scoring';

const FLIP_BACK_MS = 700;

const createPhaseState = (phase) => ({
  deck: buildDeck(SAINTS, phase.pairs),
  flipped: [],
  matched: new Set(),
  busy: false,
  attempts: 0,
  comboStreak: 0,
  bestCombo: 0,
  phasePoints: 0,
  startedAtMs: Date.now(),
  completedAtMs: null,
  lastMatchedSaint: null,
  isWon: false,
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
      return createPhaseState(action.phase);
    case 'FLIP': {
      const { index } = action;
      if (state.busy) return state;
      if (state.flipped.includes(index)) return state;
      if (state.flipped.length >= 2) return state;
      const card = state.deck[index];
      if (state.matched.has(card.matchKey)) return state;

      const nextFlipped = [...state.flipped, index];
      if (nextFlipped.length < 2) {
        return { ...state, flipped: nextFlipped };
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

        return {
          ...state,
          flipped: [],
          matched,
          attempts,
          comboStreak,
          bestCombo,
          phasePoints,
          completedAtMs: isWon ? action.nowMs : null,
          lastMatchedSaint: a.saint,
          isWon,
        };
      }

      return {
        ...state,
        flipped: nextFlipped,
        busy: true,
        attempts,
        comboStreak: 0,
        phasePoints: applyMissPenalty(state.phasePoints),
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

export default function GameScreen({ onBack, phases, progress, onPhaseComplete }) {
  const [activePhaseId, setActivePhaseId] = useState(() => getInitialPhaseId(phases, progress));
  const activePhase = useMemo(
    () => phases.find((phase) => phase.id === activePhaseId) || phases[0],
    [activePhaseId, phases],
  );

  const [state, dispatch] = useReducer(reducer, activePhase, createPhaseState);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showCampaignComplete, setShowCampaignComplete] = useState(false);
  const timeoutRef = useRef(null);
  const reportedSummaryRef = useRef(null);

  useEffect(() => {
    dispatch({ type: 'START_PHASE', phase: activePhase });
    setElapsedSeconds(0);
    reportedSummaryRef.current = null;
  }, [activePhase]);

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
    dispatch({ type: 'START_PHASE', phase: activePhase });
    setElapsedSeconds(0);
    reportedSummaryRef.current = null;
  }, [activePhase]);

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
    // Check if it's the last phase
    if (phaseSummary.phaseId === phases.length) {
      setShowCampaignComplete(true);
    }
  }, [phaseSummary, onPhaseComplete, state.startedAtMs, phases.length]);

  const hasNextPhase = activePhase.id < phases.length;

  const handleNextPhase = useCallback(() => {
    if (!hasNextPhase) return;
    setActivePhaseId(activePhase.id + 1);
  }, [activePhase.id, hasNextPhase]);

  return (
    <View style={styles.safe}>
      <Header
        onBack={onBack}
        onRestart={handlePlayAgain}
        moves={state.attempts}
        activePhase={activePhase}
        totalScore={progress.totalScore}
        phasePoints={state.phasePoints}
        combo={state.comboStreak}
        elapsedSeconds={elapsedSeconds}
      />

      <View style={styles.phaseStrip}>
        {phases.map((phase) => {
          const status = getPhaseStatus(phase.id, activePhase.id, progress);
          return (
            <Pressable
              key={phase.id}
              onPress={() => handleSelectPhase(phase.id)}
              disabled={status === 'locked'}
              style={[styles.phaseChip, styles[`chip_${status}`]]}
            >
              <Text style={styles.phaseChipTitle}>F{phase.id}</Text>
              <Text style={styles.phaseChipMeta}>{phase.rows}x{phase.cols}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.boardWrap}>
        <GameBoard
          phase={activePhase}
          deck={state.deck}
          flipped={state.flipped}
          matched={state.matched}
          busy={state.busy}
          onCardPress={handleCardPress}
        />
      </View>
      <ResultModal
        visible={state.isWon && !showCampaignComplete}
        saint={state.lastMatchedSaint}
        summary={phaseSummary}
        hasNextPhase={hasNextPhase}
        onNextPhase={handleNextPhase}
        onPlayAgain={handlePlayAgain}
        onBackHome={onBack}
      />

      <CampaignCompleteModal
        visible={showCampaignComplete}
        saint={state.lastMatchedSaint}
        totalScore={progress.totalScore}
        onBackHome={onBack}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  phaseStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 6,
  },
  phaseChip: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 8,
  },
  phaseChipTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
  },
  phaseChipMeta: {
    fontSize: 10,
    color: colors.textSoft,
  },
  chip_locked: {
    backgroundColor: '#EBDDC8',
    opacity: 0.55,
  },
  chip_unlocked: {
    backgroundColor: '#E8F2F7',
  },
  chip_active: {
    backgroundColor: colors.accent,
  },
  chip_completed: {
    backgroundColor: '#DFF0DE',
  },
  boardWrap: {
    flex: 1,
    justifyContent: 'center',
  },
});
