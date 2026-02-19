import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, CATEGORY_ICONS } from '../../constants/theme';
import { MEALS } from '../../services/mockData';
import { MealCategory } from '../../types';
import MealCard from '../../components/common/MealCard';

const ALL_CATEGORIES: { key: MealCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'Tutti' },
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

type FilterType = 'all' | 'vegetarian' | 'vegan' | 'glutenFree';

export default function MenuScreen({ route, navigation }: any) {
  const initialCategory = route?.params?.category || 'all';
  const [selectedCategory, setSelectedCategory] = useState<MealCategory | 'all'>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredMeals = useMemo(() => {
    let result = MEALS;

    if (selectedCategory !== 'all') {
      result = result.filter((m) => m.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.ingredients.some((i) => i.toLowerCase().includes(query))
      );
    }

    switch (activeFilter) {
      case 'vegetarian':
        result = result.filter((m) => m.isVegetarian);
        break;
      case 'vegan':
        result = result.filter((m) => m.isVegan);
        break;
      case 'glutenFree':
        result = result.filter((m) => m.isGlutenFree);
        break;
    }

    return result;
  }, [selectedCategory, searchQuery, activeFilter]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
        <Text style={styles.subtitle}>
          {filteredMeals.length} piatti disponibili
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cerca piatti, ingredienti..."
          placeholderTextColor={COLORS.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {ALL_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.categoryChip,
              selectedCategory === cat.key && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(cat.key)}
          >
            {cat.key !== 'all' && (
              <Text style={styles.categoryChipEmoji}>
                {CATEGORY_ICONS[cat.key]}
              </Text>
            )}
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === cat.key && styles.categoryChipTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Dietary Filters */}
      <View style={styles.filtersRow}>
        {([
          { key: 'all', label: 'Tutti' },
          { key: 'vegetarian', label: 'Vegetariani' },
          { key: 'vegan', label: 'Vegani' },
          { key: 'glutenFree', label: 'Senza Glutine' },
        ] as { key: FilterType; label: string }[]).map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterChip,
              activeFilter === filter.key && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(filter.key)}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilter === filter.key && styles.filterChipTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Meal List */}
      <FlatList
        data={filteredMeals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <MealCard
            meal={item}
            variant="horizontal"
            onPress={() =>
              navigation.navigate('MealDetail', { meal: item })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>{'🔍'}</Text>
            <Text style={styles.emptyTitle}>Nessun piatto trovato</Text>
            <Text style={styles.emptySubtitle}>
              Prova a modificare i filtri o la ricerca
            </Text>
          </View>
        }
      />
    </View>
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
    paddingBottom: SPACING.md,
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
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
  },
  searchInput: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  categoriesContainer: {
    backgroundColor: COLORS.white,
    maxHeight: 56,
  },
  categoriesContent: {
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    marginRight: SPACING.sm,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
  },
  categoryChipEmoji: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  categoryChipText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  categoryChipTextActive: {
    color: COLORS.white,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.secondary + '15',
  },
  filterChipText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: COLORS.secondary,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.sm,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.lg,
  },
  emptySubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
});
