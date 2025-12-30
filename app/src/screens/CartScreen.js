import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import CartItem from '../components/CartItem';
import { fetchCart, updateCartItem, removeCartItem } from '../store/actions/cartActions';
import { theme } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';

const CartScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { items, totalAmount, isLoading, error } = useSelector(state => state.cart);
  const { token } = useSelector(state => state.auth);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadCart = useCallback(async () => {
    if (token) {
      await dispatch(fetchCart(token));
    }
  }, [dispatch, token]);

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [loadCart])
  );

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadCart();
    setIsRefreshing(false);
  }, [loadCart]);

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      Alert.alert(
        'Remove Item',
        'Do you want to remove this item from your cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', onPress: () => dispatch(removeCartItem(cartItemId, token)) },
        ]
      );
    } else {
      await dispatch(updateCartItem(cartItemId, newQuantity, token));
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', onPress: () => dispatch(removeCartItem(cartItemId, token)) },
      ]
    );
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty. Please add items before checking out.');
      return;
    }
    navigation.navigate('Checkout');
  };

  if (isLoading && !isRefreshing) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={globalStyles.loadingText}>Loading cart...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={globalStyles.errorContainer}>
        <Text style={globalStyles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={globalStyles.primaryButton} onPress={loadCart}>
          <Text style={globalStyles.primaryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Cart</Text>
      </View>

      {items.length === 0 ? (
        <View style={globalStyles.emptyStateContainer}>
          <Icon name="cart-off" size={80} color={theme.colors.textSecondary} />
          <Text style={globalStyles.emptyStateText}>Your cart is empty.</Text>
          <TouchableOpacity style={globalStyles.primaryButton} onPress={() => navigation.navigate('CatalogTab')}>
            <Text style={globalStyles.primaryButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CartItem
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
              />
            )}
            contentContainerStyle={styles.cartList}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
            }
          />

          <View style={styles.summaryContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Total:</Text>
              <Text style={styles.totalAmount}>₹{parseFloat(totalAmount).toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={[globalStyles.primaryButton, styles.checkoutButton]}
              onPress={handleCheckout}
            >
              <Text style={globalStyles.primaryButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.headerBackground,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    alignItems: 'center',
    paddingTop: theme.spacing.large + 20, // Adjust for status bar
  },
  headerTitle: {
    ...theme.typography.h5,
    color: theme.colors.headerText,
    fontWeight: 'bold',
  },
  cartList: {
    padding: theme.spacing.small,
    paddingBottom: theme.spacing.extraLarge * 2, // Make space for summary
  },
  summaryContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.cardBackground,
    borderTopLeftRadius: theme.borderRadius.large,
    borderTopRightRadius: theme.borderRadius.large,
    padding: theme.spacing.medium,
    paddingBottom: theme.spacing.large, // Add extra padding for bottom safe area
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.medium,
    alignItems: 'center',
  },
  totalText: {
    ...theme.typography.h6,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  totalAmount: {
    ...theme.typography.h5,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  checkoutButton: {
    width: '100%',
  },
});

export default CartScreen;
