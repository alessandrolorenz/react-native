const MATCH_POINTS = 120;
const MISS_PENALTY = 25;
const COMBO_STEP_BONUS = 25;

const phaseTargetSeconds = {
  1: 75,
  2: 105,
  3: 135,
  4: 165,
};

export function getMatchScore(comboStreak) {
  const comboBonus = Math.max(0, comboStreak - 1) * COMBO_STEP_BONUS;
  return MATCH_POINTS + comboBonus;
}

export function applyMissPenalty(points) {
  return Math.max(0, points - MISS_PENALTY);
}

export function getPhaseCompletionBonus(phaseId) {
  return 200 + phaseId * 140;
}

export function getTimeMultiplier(phaseId, elapsedSeconds) {
  const target = phaseTargetSeconds[phaseId] || 120;
  if (elapsedSeconds <= target) return 1.4;
  if (elapsedSeconds <= Math.floor(target * 1.25)) return 1.2;
  if (elapsedSeconds <= Math.floor(target * 1.5)) return 1;
  return 0.85;
}

export function buildPhaseSummary({
  phase,
  phasePoints,
  attempts,
  elapsedSeconds,
  bestCombo,
}) {
  const completionBonus = getPhaseCompletionBonus(phase.id);
  const multiplier = getTimeMultiplier(phase.id, elapsedSeconds);
  const baseTotal = phasePoints + completionBonus;
  const totalPoints = Math.max(0, Math.round(baseTotal * multiplier));
  const accuracy = attempts > 0 ? Math.round((phase.pairs / attempts) * 100) : 0;

  return {
    phaseId: phase.id,
    phaseLabel: phase.label,
    rows: phase.rows,
    cols: phase.cols,
    pairs: phase.pairs,
    attempts,
    elapsedSeconds,
    phasePoints,
    completionBonus,
    timeMultiplier: multiplier,
    totalPoints,
    accuracy,
    bestCombo,
  };
}
