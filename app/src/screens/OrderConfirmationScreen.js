import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { getOrderDetails } from '../api/orders';
import { theme } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';

const OrderConfirmationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId, paymentId } = route.params; // Passed from CheckoutScreen
  const { token } = useSelector(state => state.auth);

  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId, token]);

  const fetchOrderDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getOrderDetails(orderId, token);
      setOrderDetails(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch order details.');
      Alert.alert('Error', err.message || 'Failed to load order confirmation.');
      console.error('Error fetching order details for confirmation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoHome = () => {
    navigation.popToTop(); // Go back to the first screen in the stack (MainTabs)
    navigation.navigate('CatalogTab'); // Navigate specifically to the Catalog tab
  };

  const handleViewOrders = () => {
    navigation.popToTop();
    navigation.navigate('ProfileTab'); // Assuming profile screen has an 'Orders' section or a direct link
  };

  if (isLoading) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={globalStyles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (error || !orderDetails) {
    return (
      <View style={globalStyles.errorContainer}>
        <Icon name="alert-circle-outline" size={80} color={theme.colors.danger} />
        <Text style={globalStyles.errorText}>Oops! {error || 'Something went wrong fetching order details.'}</Text>
        <TouchableOpacity style={globalStyles.primaryButton} onPress={fetchOrderDetails}>
          <Text style={globalStyles.primaryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={globalStyles.secondaryButton} onPress={handleGoHome}>
          <Text style={globalStyles.secondaryButtonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={styles.contentContainer}>
      <Icon name="check-circle-outline" size={120} color={theme.colors.success} style={styles.successIcon} />
      <Text style={styles.confirmationTitle}>Order Placed Successfully!</Text>
      <Text style={styles.confirmationText}>Thank you for your purchase.</Text>

      <View style={styles.orderSummaryCard}>
        <Text style={styles.cardTitle}>Order Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Order ID:</Text>
          <Text style={styles.detailValue}>{orderDetails.id}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Amount:</Text>
          <Text style={styles.detailValue}>₹{parseFloat(orderDetails.total_amount).toFixed(2)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status:</Text>
          <Text style={[styles.detailValue, { color: theme.colors.success }]}>{orderDetails.status.toUpperCase()}</Text>
        </View>
        {paymentId && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment ID:</Text>
            <Text style={styles.detailValue}>{paymentId}</Text>
          </View>
        )}
        <Text style={styles.cardSubtitle}>Items Purchased:</Text>
        {orderDetails.OrderItems.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.itemText}>{item.Product.name} x {item.quantity}</Text>
            <Text style={styles.itemText}>₹{parseFloat(item.price_at_purchase).toFixed(2)} each</Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={globalStyles.primaryButton} onPress={handleGoHome}>
          <Text style={globalStyles.primaryButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
        <TouchableOpacity style={globalStyles.secondaryButton} onPress={handleViewOrders}>
          <Text style={globalStyles.secondaryButtonText}>View My Orders</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.background,
  },
  successIcon: {
    marginBottom: theme.spacing.medium,
  },
  confirmationTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: theme.spacing.extraSmall,
    textAlign: 'center',
  },
  confirmationText: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.extraLarge,
    textAlign: 'center',
  },
  orderSummaryCard: {
    width: '100%',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    marginBottom: theme.spacing.extraLarge,
  },
  cardTitle: {
    ...theme.typography.h6,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.medium,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.small,
  },
  cardSubtitle: {
    ...theme.typography.body1,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    marginTop: theme.spacing.medium,
    marginBottom: theme.spacing.small,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.extraSmall,
  },
  detailLabel: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  detailValue: {
    ...theme.typography.body2,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.extraSmall,
    paddingLeft: theme.spacing.small,
  },
  itemText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  buttonContainer: {
    width: '100%',
    gap: theme.spacing.medium,
  },
});

export default OrderConfirmationScreen;
