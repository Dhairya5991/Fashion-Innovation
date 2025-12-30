import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';

// Auth Stack
import AuthScreen from '../screens/AuthScreen';

// Main App Tabs
import ProductCatalogScreen from '../screens/ProductCatalogScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderConfirmationScreen from '../screens/OrderConfirmationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SustainabilityDashboardScreen from '../screens/SustainabilityDashboardScreen';
import ARScannerScreen from '../screens/ARScannerScreen';
import ARVirtualTryOnScreen from '../screens/ARVirtualTryOnScreen';

import { theme } from '../styles/theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// --- Main App Tabs Navigator ---
const MainAppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'CatalogTab') {
            iconName = focused ? 'tshirt-crew' : 'tshirt-crew-outline';
          } else if (route.name === 'CartTab') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'account-circle' : 'account-circle-outline';
          } else if (route.name === 'SustainabilityTab') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.cardBackground,
          borderTopWidth: 0,
          elevation: 5, // Shadow for Android
          shadowOpacity: 0.1, // Shadow for iOS
          shadowRadius: 5,
          shadowOffset: { width: 0, height: -2 },
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.caption.fontSize,
          fontFamily: theme.typography.caption.fontFamily,
        },
        headerStyle: {
          backgroundColor: theme.colors.headerBackground,
        },
        headerTintColor: theme.colors.headerText,
        headerTitleStyle: {
          fontFamily: theme.typography.h6.fontFamily,
          fontSize: theme.typography.h6.fontSize,
        },
      })}
    >
      <Tab.Screen
        name="CatalogTab"
        component={ProductCatalogScreen}
        options={{ title: 'Shop', headerShown: false }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{ title: 'Cart', headerShown: false }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: 'Profile', headerShown: false }}
      />
      <Tab.Screen
        name="SustainabilityTab"
        component={SustainabilityDashboardScreen}
        options={{ title: 'Sustainability', headerShown: false }}
      />
    </Tab.Navigator>
  );
};

// --- Main Stack Navigator ---
const AppNavigator = () => {
  const { token } = useSelector(state => state.auth);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.headerBackground,
        },
        headerTintColor: theme.colors.headerText,
        headerTitleStyle: {
          fontFamily: theme.typography.h6.fontFamily,
          fontSize: theme.typography.h6.fontSize,
        },
        headerBackTitleVisible: false,
      }}
    >
      {token ? (
        // User is logged in
        <Stack.Group>
          <Stack.Screen name="MainTabs" component={MainAppTabs} options={{ headerShown: false }} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product Details' }} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
          <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} options={{ title: 'Order Confirmed' }} />
          <Stack.Screen name="ARScanner" component={ARScannerScreen} options={{ title: 'Body Scan' }} />
          <Stack.Screen name="ARVirtualTryOn" component={ARVirtualTryOnScreen} options={{ title: 'Virtual Try-On' }} />
        </Stack.Group>
      ) : (
        // User is not logged in
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
