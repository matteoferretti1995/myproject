import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { useCart } from '../../context/CartContext';
import { CartItem } from '../../types';

function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}) {
  return (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.meal.image }} style={styles.itemImage} />
      <View style={styles.itemContent}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.meal.name}
        </Text>
        <Text style={styles.itemPrice}>
          {(item.meal.price * item.quantity).toFixed(2)} EUR
        </Text>
        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onUpdateQuantity(item.quantity - 1)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onUpdateQuantity(item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <Text style={styles.removeButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function CartScreen({ navigation }: any) {
  const { items, total, itemCount, updateQuantity, removeFromCart, clearCart } =
    useCart();

  const deliveryFee = total > 30 ? 0 : 3.90;
  const grandTotal = total + deliveryFee;

  const handleCheckout = () => {
    Alert.alert(
      'Conferma Ordine',
      `Totale: ${grandTotal.toFixed(2)} EUR\n\nVuoi procedere con il pagamento?`,
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Paga Ora',
          onPress: () => {
            Alert.alert(
              'Ordine Confermato!',
              'Il tuo ordine e stato preso in carico. Riceverai una notifica quando sara in consegna.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    clearCart();
                    navigation.navigate('HomeTab');
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyHeader}>
          <Text style={styles.headerTitle}>Carrello</Text>
        </View>
        <View style={styles.emptyContent}>
          <Text style={styles.emptyEmoji}>{'🛒'}</Text>
          <Text style={styles.emptyTitle}>Il tuo carrello e vuoto</Text>
          <Text style={styles.emptySubtitle}>
            Esplora il menu e aggiungi i tuoi piatti preferiti
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('MenuTab')}
          >
            <Text style={styles.emptyButtonText}>Vai al Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Carrello</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>Svuota</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.itemsList}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => (
          <CartItemRow
            key={item.meal.id}
            item={item}
            onUpdateQuantity={(qty) => updateQuantity(item.meal.id, qty)}
            onRemove={() => removeFromCart(item.meal.id)}
          />
        ))}

        {/* Order Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Riepilogo Ordine</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Subtotale ({itemCount} {itemCount === 1 ? 'articolo' : 'articoli'})
            </Text>
            <Text style={styles.summaryValue}>{total.toFixed(2)} EUR</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Consegna</Text>
            <Text
              style={[
                styles.summaryValue,
                deliveryFee === 0 && styles.freeDelivery,
              ]}
            >
              {deliveryFee === 0 ? 'GRATIS' : `${deliveryFee.toFixed(2)} EUR`}
            </Text>
          </View>

          {deliveryFee > 0 && (
            <Text style={styles.deliveryHint}>
              Aggiungi {(30 - total).toFixed(2)} EUR per la consegna gratuita
            </Text>
          )}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Totale</Text>
            <Text style={styles.totalValue}>{grandTotal.toFixed(2)} EUR</Text>
          </View>
        </View>

        {/* Delivery Info */}
        <View style={styles.deliveryInfo}>
          <Text style={styles.deliveryInfoTitle}>Informazioni Consegna</Text>
          <View style={styles.deliverySlot}>
            <Text style={styles.deliverySlotIcon}>{'📍'}</Text>
            <View>
              <Text style={styles.deliverySlotText}>Via Roma 42, Milano</Text>
              <Text style={styles.deliverySlotSubtext}>Modifica indirizzo</Text>
            </View>
          </View>
          <View style={styles.deliverySlot}>
            <Text style={styles.deliverySlotIcon}>{'🕐'}</Text>
            <View>
              <Text style={styles.deliverySlotText}>Domani, 12:00 - 14:00</Text>
              <Text style={styles.deliverySlotSubtext}>Cambia orario</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Checkout Bar */}
      <View style={styles.checkoutBar}>
        <View>
          <Text style={styles.checkoutTotal}>{grandTotal.toFixed(2)} EUR</Text>
          <Text style={styles.checkoutItems}>{itemCount} articoli</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Ordina Ora</Text>
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
  emptyContainer: {
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
  emptyHeader: {
    paddingTop: 60,
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: FONTS.sizes.title,
    fontWeight: '800',
    color: COLORS.text,
  },
  clearText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.error,
    fontWeight: '600',
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
  },
  emptyEmoji: {
    fontSize: 64,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.xl,
  },
  emptySubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.md,
    marginTop: SPACING.xxl,
  },
  emptyButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
  itemsList: {
    flex: 1,
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.lg,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.md,
  },
  itemContent: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  itemPrice: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 2,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quantityButtonText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  quantityText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: SPACING.lg,
  },
  removeButton: {
    padding: SPACING.sm,
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  summary: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.xxl,
    marginTop: SPACING.lg,
    ...SHADOWS.small,
  },
  summaryTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  summaryLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  freeDelivery: {
    color: COLORS.success,
    fontWeight: '700',
  },
  deliveryHint: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  totalLabel: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  deliveryInfo: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.xxl,
    marginTop: SPACING.lg,
    ...SHADOWS.small,
  },
  deliveryInfoTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  deliverySlot: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  deliverySlotIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  deliverySlotText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  deliverySlotSubtext: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    marginTop: 2,
  },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.lg,
    paddingBottom: 36,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.large,
  },
  checkoutTotal: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  checkoutItems: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.md,
  },
  checkoutButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
});
