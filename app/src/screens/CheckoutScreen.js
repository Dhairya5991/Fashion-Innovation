import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import PaymentOptions from '../components/PaymentOptions';
import { createOrder } from '../api/orders';
import { theme } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const { items, totalAmount } = useSelector(state => state.cart);
  const { user, token } = useSelector(state => state.auth);

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India', // Default for UPI
  });
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [razorpayOrderId, setRazorpayOrderId] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);


  const handleAddressChange = (field, value) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateOrder = async () => {
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zip) {
      Alert.alert('Missing Information', 'Please fill in all shipping address fields.');
      return;
    }
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty. Please add items before placing an order.');
      return;
    }

    setIsProcessingOrder(true);
    try {
      const orderData = await createOrder(shippingAddress, token);
      setCurrentOrderId(orderData.order_id);
      setRazorpayOrderId(orderData.payment_details.order_id);
      setPaymentInitiated(true); // Proceed to payment options
      Alert.alert('Order Initiated', 'Your order has been created. Please complete payment.');
    } catch (error) {
      Alert.alert('Order Failed', error.message || 'Failed to create order. Please try again.');
      console.error('Error creating order:', error);
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const handlePaymentSuccess = (paymentResponse) => {
    Alert.alert('Payment Successful!', `Your order #${currentOrderId} is confirmed.`);
    navigation.replace('OrderConfirmation', { orderId: currentOrderId, paymentId: paymentResponse.razorpay_payment_id });
  };

  const handlePaymentFailure = (error) => {
    Alert.alert('Payment Failed', error.message || 'Payment could not be completed. Please try again.');
    // Optionally, you might want to redirect to a failed order screen or allow retry
    setPaymentInitiated(false); // Allow user to try creating order again or modify cart
    setCurrentOrderId(null);
    setRazorpayOrderId(null);
  };

  const isFormValid = shippingAddress.street && shippingAddress.city && shippingAddress.state && shippingAddress.zip && items.length > 0;

  return (
    <KeyboardAvoidingView
      style={globalStyles.flex1}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={globalStyles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Street Address"
          placeholderTextColor={theme.colors.textSecondary}
          value={shippingAddress.street}
          onChangeText={(text) => handleAddressChange('street', text)}
        />
        <TextInput
          style={globalStyles.input}
          placeholder="City"
          placeholderTextColor={theme.colors.textSecondary}
          value={shippingAddress.city}
          onChangeText={(text) => handleAddressChange('city', text)}
        />
        <TextInput
          style={globalStyles.input}
          placeholder="State"
          placeholderTextColor={theme.colors.textSecondary}
          value={shippingAddress.state}
          onChangeText={(text) => handleAddressChange('state', text)}
        />
        <TextInput
          style={globalStyles.input}
          placeholder="Zip Code"
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType="numeric"
          value={shippingAddress.zip}
          onChangeText={(text) => handleAddressChange('zip', text)}
        />
        <TextInput
          style={globalStyles.input}
          placeholder="Country"
          placeholderTextColor={theme.colors.textSecondary}
          value={shippingAddress.country}
          onChangeText={(text) => handleAddressChange('country', text)}
          editable={false} // For now, assuming India for UPI example
        />

        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryBox}>
          {items.map(item => (
            <View key={item.id} style={styles.summaryItem}>
              <Text style={styles.summaryItemText}>{item.Product.name} x {item.quantity}</Text>
              <Text style={styles.summaryItemText}>₹{(parseFloat(item.Product.price) * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalText}>Total Amount:</Text>
            <Text style={styles.summaryTotalAmount}>₹{parseFloat(totalAmount).toFixed(2)}</Text>
          </View>
        </View>

        {!paymentInitiated ? (
          <TouchableOpacity
            style={[globalStyles.primaryButton, (!isFormValid || isProcessingOrder) && globalStyles.disabledButton]}
            onPress={handleCreateOrder}
            disabled={!isFormValid || isProcessingOrder}
          >
            {isProcessingOrder ? (
              <ActivityIndicator color={theme.colors.white} />
            ) : (
              <Text style={globalStyles.primaryButtonText}>
                <Icon name="cash-multiple" size={20} color={theme.colors.white} /> Place Order & Pay
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <PaymentOptions
            orderId={currentOrderId}
            razorpayOrderId={razorpayOrderId}
            amount={totalAmount}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentFailure={handlePaymentFailure}
            token={token}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: theme.spacing.medium,
    paddingBottom: theme.spacing.extraLarge * 2,
  },
  sectionTitle: {
    ...theme.typography.h6,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.large,
    marginBottom: theme.spacing.medium,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.small,
  },
  summaryBox: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    marginBottom: theme.spacing.large,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.extraSmall,
  },
  summaryItemText: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.small,
    marginTop: theme.spacing.small,
  },
  summaryTotalText: {
    ...theme.typography.h6,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  summaryTotalAmount: {
    ...theme.typography.h5,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;
