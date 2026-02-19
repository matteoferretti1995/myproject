import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { Meal } from '../../types';
import { useCart } from '../../context/CartContext';

interface MealCardProps {
  meal: Meal;
  onPress: () => void;
  variant?: 'horizontal' | 'vertical';
}

export default function MealCard({ meal, onPress, variant = 'vertical' }: MealCardProps) {
  const { addToCart, isInCart } = useCart();

  if (variant === 'horizontal') {
    return (
      <TouchableOpacity style={styles.horizontalCard} onPress={onPress}>
        <Image source={{ uri: meal.image }} style={styles.horizontalImage} />
        <View style={styles.horizontalContent}>
          <Text style={styles.category}>{meal.category.toUpperCase()}</Text>
          <Text style={styles.name} numberOfLines={1}>{meal.name}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {meal.description}
          </Text>
          <View style={styles.horizontalFooter}>
            <Text style={styles.price}>{meal.price.toFixed(2)} EUR</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>{'*'} {meal.rating}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: meal.image }} style={styles.image} />
      <View style={styles.badges}>
        {meal.isVegetarian && (
          <View style={[styles.badge, { backgroundColor: COLORS.success }]}>
            <Text style={styles.badgeText}>VEG</Text>
          </View>
        )}
        {meal.isGlutenFree && (
          <View style={[styles.badge, { backgroundColor: COLORS.secondary }]}>
            <Text style={styles.badgeText}>GF</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.category}>{meal.category.toUpperCase()}</Text>
        <Text style={styles.name} numberOfLines={1}>{meal.name}</Text>
        <View style={styles.meta}>
          <Text style={styles.calories}>{meal.calories} kcal</Text>
          <Text style={styles.dot}>{'  '}|{'  '}</Text>
          <Text style={styles.time}>{meal.preparationTime} min</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.price}>{meal.price.toFixed(2)} EUR</Text>
          <TouchableOpacity
            style={[
              styles.addButton,
              isInCart(meal.id) && styles.addedButton,
            ]}
            onPress={() => addToCart(meal)}
          >
            <Text
              style={[
                styles.addButtonText,
                isInCart(meal.id) && styles.addedButtonText,
              ]}
            >
              {isInCart(meal.id) ? 'Aggiunto' : '+'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    marginRight: SPACING.lg,
    ...SHADOWS.medium,
  },
  image: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
  },
  badges: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
  },
  content: {
    padding: SPACING.md,
  },
  category: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: '700',
    letterSpacing: 1,
  },
  name: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  description: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    lineHeight: 18,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  calories: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  dot: {
    color: COLORS.textLight,
    fontSize: FONTS.sizes.sm,
  },
  time: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  price: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.text,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addedButton: {
    backgroundColor: COLORS.success,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    lineHeight: 22,
  },
  addedButtonText: {
    fontSize: FONTS.sizes.xs,
  },
  // Horizontal variant
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  horizontalImage: {
    width: 110,
    height: 110,
    borderTopLeftRadius: RADIUS.lg,
    borderBottomLeftRadius: RADIUS.lg,
  },
  horizontalContent: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'center',
  },
  horizontalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  ratingBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  ratingText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
});
