import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS, CATEGORY_ICONS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { MEALS, SUBSCRIPTION_PLANS } from '../../services/mockData';
import MealCard from '../../components/common/MealCard';
import { MealCategory } from '../../types';

const CATEGORIES: { key: MealCategory; label: string }[] = [
  { key: 'pasta', label: 'Pasta' },
  { key: 'pizza', label: 'Pizza' },
  { key: 'salad', label: 'Insalate' },
  { key: 'fish', label: 'Pesce' },
  { key: 'meat', label: 'Carne' },
  { key: 'soup', label: 'Zuppe' },
  { key: 'dessert', label: 'Dolci' },
  { key: 'breakfast', label: 'Colazione' },
  { key: 'smoothie', label: 'Smoothie' },
];

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const featuredMeals = MEALS.filter((m) => m.rating >= 4.7);
  const popularMeals = MEALS.slice(0, 6);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Ciao, {user?.name?.split(' ')[0] || 'Buongiorno'}!</Text>
          <Text style={styles.subGreeting}>Cosa vuoi mangiare oggi?</Text>
        </View>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('CartTab')}
        >
          <Text style={styles.cartIcon}>{'🛒'}</Text>
          {itemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{itemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Subscription Banner */}
      {!user?.subscription && (
        <TouchableOpacity
          style={styles.banner}
          onPress={() => navigation.navigate('SubscriptionTab')}
        >
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Scopri i nostri abbonamenti</Text>
            <Text style={styles.bannerSubtitle}>
              Risparmia fino al 30% con un piano settimanale
            </Text>
            <View style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Scopri di piu {'>'}</Text>
            </View>
          </View>
          <Text style={styles.bannerEmoji}>{'🥗'}</Text>
        </TouchableOpacity>
      )}

      {user?.subscription && (
        <View style={styles.subscriptionInfo}>
          <Text style={styles.subscriptionTitle}>Il tuo abbonamento</Text>
          <View style={styles.subscriptionCard}>
            <Text style={styles.subscriptionPlan}>
              Piano {SUBSCRIPTION_PLANS.find((p) => p.id === user.subscription?.planId)?.name}
            </Text>
            <Text style={styles.subscriptionDelivery}>
              Prossima consegna: {user.subscription.nextDelivery}
            </Text>
          </View>
        </View>
      )}

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorie</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={styles.categoryItem}
              onPress={() =>
                navigation.navigate('MenuTab', { category: cat.key })
              }
            >
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryEmoji}>
                  {CATEGORY_ICONS[cat.key]}
                </Text>
              </View>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Meals */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>I piu amati</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MenuTab')}>
            <Text style={styles.seeAll}>Vedi tutti</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={featuredMeals}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <MealCard
              meal={item}
              onPress={() =>
                navigation.navigate('MealDetail', { meal: item })
              }
            />
          )}
        />
      </View>

      {/* Popular This Week */}
      <View style={[styles.section, { marginBottom: 100 }]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popolari questa settimana</Text>
        </View>
        {popularMeals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            variant="horizontal"
            onPress={() =>
              navigation.navigate('MealDetail', { meal })
            }
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  greeting: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  subGreeting: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cartButton: {
    position: 'relative',
    padding: SPACING.sm,
  },
  cartIcon: {
    fontSize: 28,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
  },
  banner: {
    marginHorizontal: SPACING.xxl,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.white,
  },
  bannerSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.85)',
    marginTop: SPACING.xs,
  },
  bannerButton: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: FONTS.sizes.sm,
  },
  bannerEmoji: {
    fontSize: 60,
    marginLeft: SPACING.md,
  },
  subscriptionInfo: {
    marginHorizontal: SPACING.xxl,
    marginTop: SPACING.lg,
  },
  subscriptionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subscriptionCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
  },
  subscriptionPlan: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
  subscriptionDelivery: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: FONTS.sizes.sm,
    marginTop: SPACING.xs,
  },
  section: {
    marginTop: SPACING.xxl,
    paddingLeft: SPACING.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: SPACING.xxl,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  seeAll: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  categoryEmoji: {
    fontSize: 30,
  },
  categoryLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    marginTop: SPACING.xs,
    fontWeight: '600',
  },
});
