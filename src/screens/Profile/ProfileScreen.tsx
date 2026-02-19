import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { MOCK_ORDERS, SUBSCRIPTION_PLANS } from '../../services/mockData';
import { Order, OrderStatus } from '../../types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'In Attesa',
  confirmed: 'Confermato',
  preparing: 'In Preparazione',
  delivering: 'In Consegna',
  delivered: 'Consegnato',
  cancelled: 'Annullato',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: COLORS.warning,
  confirmed: COLORS.secondary,
  preparing: COLORS.primary,
  delivering: COLORS.primaryLight,
  delivered: COLORS.success,
  cancelled: COLORS.error,
};

function OrderCard({ order }: { order: Order }) {
  const date = new Date(order.createdAt).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>{order.id}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: STATUS_COLORS[order.status] + '20' },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: STATUS_COLORS[order.status] },
            ]}
          >
            {STATUS_LABELS[order.status]}
          </Text>
        </View>
      </View>
      <Text style={styles.orderDate}>{date}</Text>
      <View style={styles.orderItems}>
        {order.items.map((item, index) => (
          <Text key={index} style={styles.orderItemText}>
            {item.quantity}x {item.meal.name}
          </Text>
        ))}
      </View>
      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>{order.total.toFixed(2)} EUR</Text>
        {order.status === 'preparing' && (
          <TouchableOpacity style={styles.trackButton}>
            <Text style={styles.trackButtonText}>Traccia Ordine</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const currentPlan = SUBSCRIPTION_PLANS.find(
    (p) => p.id === user?.subscription?.planId
  );

  const handleLogout = () => {
    Alert.alert('Esci', 'Sei sicuro di voler uscire?', [
      { text: 'Annulla', style: 'cancel' },
      { text: 'Esci', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name
                ?.split(' ')
                .map((n) => n[0])
                .join('') || '?'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
      </View>

      {/* Subscription Info */}
      {currentPlan && user?.subscription?.isActive && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Il tuo Abbonamento</Text>
          <View
            style={[
              styles.subscriptionCard,
              { borderLeftColor: currentPlan.color },
            ]}
          >
            <View style={styles.subscriptionHeader}>
              <Text style={styles.subscriptionPlanName}>
                Piano {currentPlan.name}
              </Text>
              <View
                style={[
                  styles.activeBadge,
                  { backgroundColor: COLORS.success + '20' },
                ]}
              >
                <Text style={styles.activeBadgeText}>Attivo</Text>
              </View>
            </View>
            <Text style={styles.subscriptionDetail}>
              {currentPlan.mealsPerWeek} pasti/settimana |{' '}
              {currentPlan.pricePerMonth.toFixed(2)} EUR/mese
            </Text>
            <Text style={styles.subscriptionDelivery}>
              Prossima consegna: {user.subscription.nextDelivery}
            </Text>
            <View style={styles.subscriptionActions}>
              <TouchableOpacity style={styles.manageButton}>
                <Text style={styles.manageButtonText}>Gestisci Piano</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.pauseButton}>
                <Text style={styles.pauseButtonText}>Metti in Pausa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Order History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Storico Ordini</Text>
        {MOCK_ORDERS.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </View>

      {/* Settings Menu */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Impostazioni</Text>
        <View style={styles.menuCard}>
          {[
            { icon: '👤', label: 'Modifica Profilo' },
            { icon: '📍', label: 'Indirizzi di Consegna' },
            { icon: '💳', label: 'Metodi di Pagamento' },
            { icon: '🔔', label: 'Notifiche' },
            { icon: '🍽️', label: 'Preferenze Alimentari' },
            { icon: '❓', label: 'Assistenza' },
            { icon: '📋', label: 'Termini e Condizioni' },
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>{'>'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Esci dall'Account</Text>
      </TouchableOpacity>

      <Text style={styles.version}>FoodBox v1.0.0</Text>

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
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: SPACING.xxl,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: FONTS.sizes.title,
    fontWeight: '700',
    color: COLORS.white,
  },
  userName: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.white,
  },
  userEmail: {
    fontSize: FONTS.sizes.md,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: SPACING.xxl,
    marginTop: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  subscriptionCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderLeftWidth: 4,
    ...SHADOWS.small,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscriptionPlanName: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  activeBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  activeBadgeText: {
    color: COLORS.success,
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
  },
  subscriptionDetail: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  subscriptionDelivery: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
  subscriptionActions: {
    flexDirection: 'row',
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  manageButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  manageButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: FONTS.sizes.sm,
  },
  pauseButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  pauseButtonText: {
    color: COLORS.textSecondary,
    fontWeight: '700',
    fontSize: FONTS.sizes.sm,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  statusText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
  },
  orderDate: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  orderItems: {
    marginTop: SPACING.md,
    gap: 2,
  },
  orderItemText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  orderTotal: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.text,
  },
  trackButton: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
  },
  trackButtonText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
  },
  menuCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    ...SHADOWS.small,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: SPACING.lg,
  },
  menuLabel: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
  },
  logoutButton: {
    marginHorizontal: SPACING.xxl,
    marginTop: SPACING.xxl,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.error,
    alignItems: 'center',
  },
  logoutText: {
    color: COLORS.error,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
  },
  version: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: FONTS.sizes.sm,
    marginTop: SPACING.lg,
  },
});
