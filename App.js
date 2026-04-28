import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import GalleryScreen from './src/screens/GalleryScreen';
import SaintProfileScreen from './src/screens/SaintProfileScreen';
import { colors } from './src/theme/colors';

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
  const [selectedSaintId, setSelectedSaintId] = useState(null);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      {screen === 'home' && (
        <HomeScreen
          onPlay={() => setScreen('game')}
          onOpenGallery={() => setScreen('gallery')}
        />
      )}
      {screen === 'game' && <GameScreen onBack={() => setScreen('home')} />}
      {screen === 'gallery' && (
        <GalleryScreen
          onBack={() => setScreen('home')}
          onSelectSaint={(id) => {
            setSelectedSaintId(id);
            setScreen('profile');
          }}
        />
      )}
      {screen === 'profile' && (
        <SaintProfileScreen
          saintId={selectedSaintId}
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
