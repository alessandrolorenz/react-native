import React, { useRef } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from '../components/ui';
import { colors, spacing, fontSize } from '../theme';
import { SAFE_AREA } from '../utils/safeArea';
import useAccessibilityFocus from '../hooks/useAccessibilityFocus';

export default function HomeScreen({
  onPlay,
  onOpenGallery,
  themes,
  activeTheme,
  progressByTheme,
  onSelectTheme,
}) {
  const titleRef = useRef(null);
  useAccessibilityFocus(titleRef, 'home');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text
            style={styles.emojiHalo}
            accessible={false}
            importantForAccessibility="no"
          >
            ✨
          </Text>
          <View
            ref={titleRef}
            accessible
            accessibilityRole="header"
            accessibilityLabel={`Jogo da Memória ${activeTheme.displayTitle}`}
            style={styles.titleGroup}
          >
            <Text variant="display" align="center" accessible={false}>Jogo da Memória</Text>
            <Text
              variant="display"
              color="accent"
              align="center"
              style={styles.titleAccent}
              accessible={false}
            >
              {activeTheme.displayTitle}
            </Text>
          </View>
          <Text variant="body" color="soft" italic align="center" style={styles.subtitle}>
            {activeTheme.subtitle}
          </Text>
        </View>

        <View style={styles.themeSection}>
          <Text
            variant="h2"
            align="center"
            style={styles.themeHeading}
            accessibilityRole="header"
          >
            Escolha um tema
          </Text>
          <View style={styles.themeList}>
            {themes.map((theme) => {
              const selected = theme.id === activeTheme.id;
              const progress = progressByTheme[theme.id];
              const completed = Object.keys(progress.completedPhases).length;
              return (
                <Pressable
                  key={theme.id}
                  onPress={() => onSelectTheme(theme.id)}
                  style={[
                    styles.themeCard,
                    !selected && styles.themeCardCompact,
                    selected && styles.themeCardSelected,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`${theme.title}, ${completed} de 4 fases concluídas, ${progress.totalScore} pontos${selected ? ', tema selecionado' : ''}`}
                  accessibilityHint={selected ? 'Tema atual' : 'Seleciona este tema'}
                >
                  <Text style={styles.themeGlyph}>{theme.coverGlyph}</Text>
                  <View style={styles.themeCopy}>
                    <Text variant="h2" style={styles.themeTitle}>{theme.title}</Text>
                    {selected ? (
                      <Text variant="caption" color="soft">
                        {theme.description}
                      </Text>
                    ) : null}
                    <Text variant="caption" color="accent" style={styles.themeProgress}>
                      {completed}/4 fases · {progress.totalScore} pontos
                    </Text>
                  </View>
                  <Text style={styles.selectionMark}>{selected ? '✓' : '›'}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onPress={onOpenGallery}
            accessibilityLabel={`Abrir ${activeTheme.copy.galleryTitle.replace(/^✦\s*/, '')}`}
          >
            {activeTheme.copy.galleryButton}
          </Button>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={onPlay}
            accessibilityLabel={`Jogar fases do tema ${activeTheme.title}`}
          >
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
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  emojiHalo: {
    fontSize: fontSize['5xl'],
    marginBottom: spacing.md,
    minHeight: fontSize['6xl'],
    textAlign: 'center',
  },
  titleGroup: {
    width: '100%',
    alignItems: 'center',
  },
  titleAccent: {
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.md,
    marginBottom: spacing.md,
    width: '100%',
    flexShrink: 1,
  },
  actions: {
    width: '100%',
    gap: spacing.md,
  },
  themeSection: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  themeHeading: {
    marginBottom: spacing.md,
  },
  themeList: {
    gap: spacing.sm,
  },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 88,
    padding: spacing.md,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.card.backEdge,
    backgroundColor: colors.bg.surface,
  },
  themeCardSelected: {
    borderColor: colors.text.accent,
    backgroundColor: colors.bg.heroTint,
  },
  themeCardCompact: {
    minHeight: 68,
    paddingVertical: spacing.sm,
  },
  themeGlyph: {
    fontSize: 34,
    width: 52,
    textAlign: 'center',
  },
  themeCopy: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  themeTitle: {
    marginBottom: spacing.xs,
  },
  themeProgress: {
    marginTop: spacing.xs,
  },
  selectionMark: {
    fontSize: 24,
    color: colors.text.accent,
    fontWeight: '800',
  },
  footer: {
    marginTop: spacing.lg,
  },
});
