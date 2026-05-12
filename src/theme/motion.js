// Animation tokens. `missDelay` is a game-mechanic timer (not a transition),
// kept here so all timing values live in one file.

import { Easing } from 'react-native';

export const duration = {
  fast: 180,
  base: 280,
  slow: 420,
  missDelay: 700,
};

export const easing = {
  standard: Easing.bezier(0.2, 0, 0, 1),
  emphasized: Easing.bezier(0.2, 0, 0, 1.2),
  linear: Easing.linear,
};
