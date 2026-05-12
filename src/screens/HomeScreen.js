import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radii, shadow, spacing } from '../theme/colors';
import { SAFE_AREA } from '../utils/safeArea';

export default function HomeScreen({ onPlay, onOpenGallery, phases, progress }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.emojiHalo}>✨</Text>
          <Text style={styles.title}>Jogo da Memória</Text>
          <Text style={styles.titleAccent}>dos Santos</Text>
          <Text style={styles.subtitle}>Aprenda brincando!</Text>
        </View>

        <View style={styles.actions}>

          <Pressable
            style={[styles.cta, styles.ctaSecondary]}
            onPress={onOpenGallery}
            accessibilityRole="button"
          >
            <Text style={styles.ctaText}>✦ Galeria dos Santos</Text>
          </Pressable>

          <Pressable style={styles.cta} onPress={onPlay} accessibilityRole="button">
            <Text style={styles.ctaText}>Jogar Fases</Text>
          </Pressable>

        </View>

        <Text style={styles.footer}>Para crianças e famílias 💛</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
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
    fontSize: 56,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 40,
  },
  titleAccent: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.primaryDark,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 17,
    color: colors.textSoft,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },

  actions: {
    width: '100%',
    gap: spacing.md,
  },
  cta: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 4,
    borderRadius: radii.lg,
    alignItems: 'center',
    ...shadow,
  },
  ctaSecondary: {
    backgroundColor: colors.secondary,
  },
  ctaText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textOnPrimary,
    letterSpacing: 1,
  },
  footer: {
    fontSize: 13,
    color: colors.textSoft,
    marginTop: spacing.lg,
  },
});
