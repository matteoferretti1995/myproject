import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { useCart } from '../../context/CartContext';
import { Meal } from '../../types';

export default function MealDetailScreen({ route, navigation }: any) {
  const { meal } = route.params as { meal: Meal };
  const { addToCart, isInCart } = useCart();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: meal.image }} style={styles.image} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>{'<'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {meal.category.toUpperCase()}
              </Text>
            </View>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>{'*'} {meal.rating}</Text>
            </View>
          </View>

          <Text style={styles.name}>{meal.name}</Text>
          <Text style={styles.description}>{meal.description}</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{meal.calories}</Text>
              <Text style={styles.statLabel}>Calorie</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{meal.preparationTime} min</Text>
              <Text style={styles.statLabel}>Preparazione</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{meal.price.toFixed(2)} EUR</Text>
              <Text style={styles.statLabel}>Prezzo</Text>
            </View>
          </View>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {meal.isVegetarian && (
              <View style={[styles.tag, { backgroundColor: '#E8F5E9' }]}>
                <Text style={[styles.tagText, { color: COLORS.success }]}>
                  Vegetariano
                </Text>
              </View>
            )}
            {meal.isVegan && (
              <View style={[styles.tag, { backgroundColor: '#E8F5E9' }]}>
                <Text style={[styles.tagText, { color: COLORS.success }]}>
                  Vegano
                </Text>
              </View>
            )}
            {meal.isGlutenFree && (
              <View style={[styles.tag, { backgroundColor: '#E0F7FA' }]}>
                <Text style={[styles.tagText, { color: COLORS.secondary }]}>
                  Senza Glutine
                </Text>
              </View>
            )}
          </View>

          {/* Ingredients */}
          <Text style={styles.sectionTitle}>Ingredienti</Text>
          <View style={styles.ingredientsList}>
            {meal.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={styles.ingredientDot} />
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>

          {/* Allergens */}
          {meal.allergens.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Allergeni</Text>
              <View style={styles.allergensList}>
                {meal.allergens.map((allergen, index) => (
                  <View key={index} style={styles.allergenBadge}>
                    <Text style={styles.allergenText}>{allergen}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPrice}>{meal.price.toFixed(2)} EUR</Text>
          <Text style={styles.bottomPriceLabel}>per porzione</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            isInCart(meal.id) && styles.addedToCartButton,
          ]}
          onPress={() => addToCart(meal)}
        >
          <Text style={styles.addToCartText}>
            {isInCart(meal.id) ? 'Aggiungi ancora' : 'Aggiungi al carrello'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: SPACING.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  content: {
    padding: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: COLORS.primaryLight + '20',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  categoryText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    letterSpacing: 1,
  },
  ratingBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  ratingText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  name: {
    fontSize: FONTS.sizes.title,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  description: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginTop: SPACING.sm,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.xl,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  tag: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  tagText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.xxl,
    marginBottom: SPACING.md,
  },
  ingredientsList: {
    gap: SPACING.sm,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ingredientDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: SPACING.md,
  },
  ingredientText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  allergensList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  allergenBadge: {
    backgroundColor: COLORS.error + '15',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  allergenText: {
    color: COLORS.error,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.xxl,
    paddingBottom: 40,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  bottomPrice: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  bottomPriceLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.md,
  },
  addedToCartButton: {
    backgroundColor: COLORS.success,
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
});
