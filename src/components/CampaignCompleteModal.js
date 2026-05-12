import React from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radii, shadow, spacing } from '../theme/colors';
import { getPrayerForSaint } from '../data/prayers';

export default function CampaignCompleteModal({
  visible,
  saint,
  totalScore,
  onBackHome,
}) {
  if (!saint) return null;

  const prayer = getPrayerForSaint(saint.id);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <Text style={styles.kicker}>🎉 Campanha Concluída! 🎉</Text>

            <Text style={styles.congratsTitle}>
              Parabéns, viajante espiritual!
            </Text>

            <Text style={styles.congratsText}>
              Você completou todas as quatro fases do Jogo da Memória dos Santos e conheceu histórias inspiradoras de fé e compaixão.
            </Text>

            <View style={styles.imageWrap}>
              <Image source={saint.image} style={styles.image} resizeMode="cover" />
              <View style={styles.emojiBadge}>
                <Text style={styles.emoji}>{saint.emoji}</Text>
              </View>
            </View>

            <Text style={styles.saintName}>{saint.name}</Text>

            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>Pontuação Total da Campanha</Text>
              <Text style={styles.scoreValue}>{totalScore}</Text>
            </View>

            <View style={styles.prayerCard}>
              <Text style={styles.prayerTitle}>Oração a {saint.name}</Text>
              <Text style={styles.prayerText}>{prayer}</Text>
            </View>

            <Text style={styles.finalMessage}>
              Que a bênção de {saint.name.split(' ')[1]} acompanhe você sempre em seu caminho! ✨
            </Text>

            <Pressable style={styles.cta} onPress={onBackHome}>
              <Text style={styles.ctaText}>Voltar ao Início</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '95%',
    backgroundColor: colors.bg,
    borderRadius: radii.lg,
    overflow: 'hidden',
    ...shadow,
  },
  scroll: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  kicker: {
    fontSize: 16,
    color: colors.primaryDark,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  congratsTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 32,
  },
  congratsText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  imageWrap: {
    width: 160,
    height: 160,
    borderRadius: radii.pill,
    overflow: 'hidden',
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    ...shadow,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  emojiBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.pill,
    ...shadow,
  },
  emoji: { fontSize: 18 },
  saintName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  scoreCard: {
    alignSelf: 'stretch',
    backgroundColor: colors.accent,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primaryDark,
    marginTop: spacing.xs,
  },
  prayerCard: {
    alignSelf: 'stretch',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadow,
  },
  prayerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  prayerText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 23,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  finalMessage: {
    fontSize: 14,
    color: colors.textSoft,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  cta: {
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    alignItems: 'center',
    ...shadow,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textOnPrimary,
    letterSpacing: 0.5,
  },
});
