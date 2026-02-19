import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { SUBSCRIPTION_PLANS } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';
import { SubscriptionPlan } from '../../types';

export default function SubscriptionScreen() {
  const { user, updateUser } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'weekly' | 'monthly'>('monthly');

  const handleSubscribe = (plan: SubscriptionPlan) => {
    if (user?.subscription?.planId === plan.id) {
      Alert.alert('Info', 'Sei gia iscritto a questo piano!');
      return;
    }

    Alert.alert(
      'Conferma Abbonamento',
      `Vuoi abbonarti al piano ${plan.name}?\n\nPrezzo: ${
        billingCycle === 'monthly'
          ? plan.pricePerMonth.toFixed(2) + ' EUR/mese'
          : plan.pricePerWeek.toFixed(2) + ' EUR/settimana'
      }`,
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Conferma',
          onPress: () => {
            updateUser({
              subscription: {
                planId: plan.id,
                startDate: new Date().toISOString().split('T')[0],
                nextDelivery: '2026-02-22',
                isActive: true,
              },
            });
            Alert.alert(
              'Abbonamento Attivato!',
              `Benvenuto nel piano ${plan.name}. La tua prima consegna sara il 22 Febbraio.`
            );
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Abbonamenti</Text>
        <Text style={styles.subtitle}>
          Scegli il piano perfetto per te e risparmia
        </Text>
      </View>

      {/* Billing Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleOption,
            billingCycle === 'weekly' && styles.toggleOptionActive,
          ]}
          onPress={() => setBillingCycle('weekly')}
        >
          <Text
            style={[
              styles.toggleText,
              billingCycle === 'weekly' && styles.toggleTextActive,
            ]}
          >
            Settimanale
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleOption,
            billingCycle === 'monthly' && styles.toggleOptionActive,
          ]}
          onPress={() => setBillingCycle('monthly')}
        >
          <Text
            style={[
              styles.toggleText,
              billingCycle === 'monthly' && styles.toggleTextActive,
            ]}
          >
            Mensile
          </Text>
          <View style={styles.saveBadge}>
            <Text style={styles.saveBadgeText}>-15%</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Plans */}
      <View style={styles.plansContainer}>
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrentPlan = user?.subscription?.planId === plan.id;
          const price =
            billingCycle === 'monthly'
              ? plan.pricePerMonth
              : plan.pricePerWeek;
          const period = billingCycle === 'monthly' ? 'mese' : 'settimana';

          return (
            <View
              key={plan.id}
              style={[
                styles.planCard,
                plan.isPopular && styles.planCardPopular,
                isCurrentPlan && styles.planCardCurrent,
              ]}
            >
              {plan.isPopular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>PIU POPOLARE</Text>
                </View>
              )}

              {isCurrentPlan && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>IL TUO PIANO</Text>
                </View>
              )}

              <Text style={[styles.planName, { color: plan.color }]}>
                {plan.name}
              </Text>
              <Text style={styles.planDescription}>{plan.description}</Text>

              <View style={styles.priceRow}>
                <Text style={styles.planPrice}>{price.toFixed(2)} EUR</Text>
                <Text style={styles.planPeriod}>/{period}</Text>
              </View>

              <Text style={styles.mealsPerWeek}>
                {plan.mealsPerWeek} pasti a settimana
              </Text>

              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Text style={[styles.featureCheck, { color: plan.color }]}>
                      {'✓'}
                    </Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.subscribeButton,
                  { backgroundColor: plan.color },
                  isCurrentPlan && styles.subscribeButtonCurrent,
                ]}
                onPress={() => handleSubscribe(plan)}
              >
                <Text style={styles.subscribeButtonText}>
                  {isCurrentPlan ? 'Piano Attivo' : 'Abbonati Ora'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* FAQ */}
      <View style={styles.faqSection}>
        <Text style={styles.faqTitle}>Domande Frequenti</Text>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>
            Posso cambiare piano in qualsiasi momento?
          </Text>
          <Text style={styles.faqAnswer}>
            Si, puoi effettuare l'upgrade o il downgrade del tuo piano in
            qualsiasi momento. Le modifiche saranno effettive dal prossimo
            ciclo di fatturazione.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>
            Come funziona la consegna?
          </Text>
          <Text style={styles.faqAnswer}>
            Consegniamo i tuoi pasti freschi nella fascia oraria che
            preferisci. I pasti sono confezionati in packaging ecologico che
            mantiene la freschezza.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>
            Posso cancellare l'abbonamento?
          </Text>
          <Text style={styles.faqAnswer}>
            Puoi cancellare in qualsiasi momento senza penali. La
            cancellazione sara effettiva alla fine del periodo corrente.
          </Text>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.xl,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: FONTS.sizes.title,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.xxl,
    marginTop: SPACING.xl,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.xs,
    ...SHADOWS.small,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: RADIUS.sm,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  toggleOptionActive: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  toggleTextActive: {
    color: COLORS.white,
  },
  saveBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    marginLeft: SPACING.sm,
  },
  saveBadgeText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
  },
  plansContainer: {
    paddingHorizontal: SPACING.xxl,
    marginTop: SPACING.xl,
    gap: SPACING.lg,
  },
  planCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.xxl,
    ...SHADOWS.medium,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  planCardPopular: {
    borderColor: COLORS.primary,
  },
  planCardCurrent: {
    borderColor: COLORS.success,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    left: '30%',
  },
  popularBadgeText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xs,
    fontWeight: '800',
    letterSpacing: 1,
  },
  currentBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    left: '30%',
  },
  currentBadgeText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xs,
    fontWeight: '800',
    letterSpacing: 1,
  },
  planName: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    marginTop: SPACING.sm,
  },
  planDescription: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: SPACING.lg,
  },
  planPrice: {
    fontSize: FONTS.sizes.hero,
    fontWeight: '800',
    color: COLORS.text,
  },
  planPeriod: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  mealsPerWeek: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    fontWeight: '600',
  },
  featuresContainer: {
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureCheck: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    marginRight: SPACING.md,
  },
  featureText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    flex: 1,
  },
  subscribeButton: {
    marginTop: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  subscribeButtonCurrent: {
    opacity: 0.7,
  },
  subscribeButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
  faqSection: {
    paddingHorizontal: SPACING.xxl,
    marginTop: SPACING.xxxl,
  },
  faqTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xl,
  },
  faqItem: {
    marginBottom: SPACING.xl,
  },
  faqQuestion: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  faqAnswer: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});
