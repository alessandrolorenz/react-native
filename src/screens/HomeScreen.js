import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radii, shadow, spacing } from '../theme/colors';

export default function HomeScreen({ onPlay, onOpenGallery }) {
  return (
    <View style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.emojiHalo}>✨</Text>
          <Text style={styles.title}>Jogo da Memória</Text>
          <Text style={styles.titleAccent}>dos Santos</Text>
          <Text style={styles.subtitle}>Aprenda brincando!</Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.cta} onPress={onPlay} accessibilityRole="button">
            <Text style={styles.ctaText}>Jogar</Text>
          </Pressable>

          <Pressable
            style={[styles.cta, styles.ctaSecondary]}
            onPress={onOpenGallery}
            accessibilityRole="button"
          >
            <Text style={styles.ctaText}>✦ Galeria dos Santos</Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>Para crianças e famílias 💛</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  actions: {
    width: '100%',
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
    marginTop: spacing.md,
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
