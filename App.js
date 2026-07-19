import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { BackHandler, StyleSheet, Text, View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import GalleryScreen from './src/screens/GalleryScreen';
import ItemProfileScreen from './src/screens/ItemProfileScreen';
import { colors } from './src/theme/colors';
import { PHASES } from './src/data/phases';
import { DEFAULT_THEME_ID, getThemeById, THEMES, validateTheme } from './src/themes';

// Catches any JS render error and shows it on screen instead of a white screen.
class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Text style={{ color: 'red', fontSize: 14 }}>{String(this.state.error)}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

// Plain-state navigation in V1 to keep deps light. When V2 grows (settings,
// levels, results history), swap this for @react-navigation/native without
// touching any screen internals.
function App() {
  const [screen, setScreen] = useState('home');
  const [activeThemeId, setActiveThemeId] = useState(DEFAULT_THEME_ID);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [progressByTheme, setProgressByTheme] = useState(() =>
    Object.fromEntries(
      THEMES.map((theme) => [
        theme.id,
        { unlockedPhase: 1, completedPhases: {}, totalScore: 0 },
      ]),
    ),
  );

  const activeTheme = getThemeById(activeThemeId);
  const progress = progressByTheme[activeThemeId];

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'profile') {
        setScreen('gallery');
        return true;
      }
      if (screen === 'gallery' || screen === 'game') {
        setScreen('home');
        return true;
      }
      return false;
    });

    return () => subscription.remove();
  }, [screen]);

  const themeErrors = THEMES.flatMap((theme) => validateTheme(theme, PHASES));
  if (themeErrors.length > 0) {
    throw new Error(themeErrors.join('\n'));
  }

  const handlePhaseComplete = (summary) => {
    setProgressByTheme((allProgress) => {
      const prev = allProgress[activeThemeId];
      const existing = prev.completedPhases[summary.phaseId];
      const bestScore = Math.max(existing?.bestScore || 0, summary.totalPoints);
      const bestCombo = Math.max(existing?.bestCombo || 0, summary.bestCombo);
      const bestAccuracy = Math.max(existing?.bestAccuracy || 0, summary.accuracy);
      const bestTime =
        existing?.bestTimeSeconds == null
          ? summary.elapsedSeconds
          : Math.min(existing.bestTimeSeconds, summary.elapsedSeconds);

      const completedPhases = {
        ...prev.completedPhases,
        [summary.phaseId]: {
          phaseId: summary.phaseId,
          attempts: summary.attempts,
          bestScore,
          bestCombo,
          bestAccuracy,
          bestTimeSeconds: bestTime,
          lastSummary: summary,
        },
      };

      const totalScore = Object.values(completedPhases).reduce(
        (acc, phaseRecord) => acc + phaseRecord.bestScore,
        0,
      );

      return {
        ...allProgress,
        [activeThemeId]: {
          unlockedPhase: Math.max(
            prev.unlockedPhase,
            Math.min(PHASES.length, summary.phaseId + 1),
          ),
          completedPhases,
          totalScore,
        },
      };
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      {screen === 'home' && (
        <HomeScreen
          onPlay={() => setScreen('game')}
          onOpenGallery={() => setScreen('gallery')}
          themes={THEMES}
          activeTheme={activeTheme}
          progressByTheme={progressByTheme}
          onSelectTheme={(themeId) => {
            setActiveThemeId(themeId);
            setSelectedItemId(null);
          }}
        />
      )}
      {screen === 'game' && (
        <GameScreen
          theme={activeTheme}
          onBack={() => setScreen('home')}
          phases={PHASES}
          progress={progress}
          onPhaseComplete={handlePhaseComplete}
        />
      )}
      {screen === 'gallery' && (
        <GalleryScreen
          theme={activeTheme}
          onBack={() => setScreen('home')}
          onSelectItem={(id) => {
            setSelectedItemId(id);
            setScreen('profile');
          }}
        />
      )}
      {screen === 'profile' && (
        <ItemProfileScreen
          theme={activeTheme}
          itemId={selectedItemId}
          onBack={() => setScreen('gallery')}
        />
      )}
    </View>
  );
}

export default function Root() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
});
