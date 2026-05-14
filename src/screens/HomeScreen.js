import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from '../components/ui';
import { colors, spacing, fontSize } from '../theme';
import { SAFE_AREA } from '../utils/safeArea';

export default function HomeScreen({ onPlay, onOpenGallery, phases, progress }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.emojiHalo}>✨</Text>
          <Text variant="display" align="center">Jogo da Memória</Text>
          <Text variant="display" color="accent" align="center" style={styles.titleAccent}>
            dos Santos
          </Text>
          <Text variant="body" color="soft" italic align="center" style={styles.subtitle}>
            Aprenda brincando!
          </Text>
        </View>

        <View style={styles.actions}>
          <Button variant="secondary" size="lg" fullWidth onPress={onOpenGallery}>
            ✦ Galeria dos Santos
          </Button>
          <Button variant="primary" size="lg" fullWidth onPress={onPlay}>
            Jogar Fases
          </Button>
        </View>

        <Text variant="caption" color="soft" align="center" style={styles.footer}>
          Para crianças e famílias 💛
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg.app },
  container: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    paddingTop: spacing.lg + SAFE_AREA.paddingTop,
    paddingBottom: spacing.lg + SAFE_AREA.paddingBottom,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  emojiHalo: {
    fontSize: fontSize['5xl'],
    marginBottom: spacing.md,
    height: fontSize['6xl'], // Ensure it takes up space even if emoji doesn't render
  },
  titleAccent: {
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.md,
    marginBottom: spacing.md,
  },
  actions: {
    width: '100%',
    gap: spacing.md,
  },
  footer: {
    marginTop: spacing.lg,
  },
});
