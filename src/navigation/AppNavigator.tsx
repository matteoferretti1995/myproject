import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import MealDetailScreen from '../screens/Home/MealDetailScreen';
import MenuScreen from '../screens/Menu/MenuScreen';
import SubscriptionScreen from '../screens/Subscription/SubscriptionScreen';
import CartScreen from '../screens/Cart/CartScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, string> = {
  HomeTab: '🏠',
  MenuTab: '📋',
  SubscriptionTab: '⭐',
  CartTab: '🛒',
  ProfileTab: '👤',
};

const TAB_LABELS: Record<string, string> = {
  HomeTab: 'Home',
  MenuTab: 'Menu',
  SubscriptionTab: 'Abbonamenti',
  CartTab: 'Carrello',
  ProfileTab: 'Profilo',
};

function CartTabIcon({ focused }: { focused: boolean }) {
  const { itemCount } = useCart();
  return (
    <View>
      <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>
        {TAB_ICONS.CartTab}
      </Text>
      {itemCount > 0 && (
        <View style={styles.tabBadge}>
          <Text style={styles.tabBadgeText}>{itemCount}</Text>
        </View>
      )}
    </View>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }) => {
          if (route.name === 'CartTab') {
            return <CartTabIcon focused={focused} />;
          }
          return (
            <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>
              {TAB_ICONS[route.name]}
            </Text>
          );
        },
        tabBarLabel: TAB_LABELS[route.name],
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="MenuTab" component={MenuScreen} />
      <Tab.Screen name="SubscriptionTab" component={SubscriptionScreen} />
      <Tab.Screen name="CartTab" component={CartScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeTabs" component={HomeTabs} />
      <Stack.Screen
        name="MealDetail"
        component={MealDetailScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: COLORS.white,
    borderTopWidth: 0,
    height: 85,
    paddingTop: SPACING.sm,
    paddingBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  tabLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    marginTop: 2,
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: COLORS.primary,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
