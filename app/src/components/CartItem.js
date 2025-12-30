import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../styles/theme';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const product = item.Product;
  const imageUrl = product.image_urls && product.image_urls.length > 0
    ? product.image_urls[0]
    : 'https://via.placeholder.com/100?text=No+Image'; // Placeholder image

  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      <View style={styles.detailsContainer}>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.productPrice}>₹{parseFloat(product.price).toFixed(2)}</Text>
        <View style={styles.quantityControl}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onQuantityChange(item.id, item.quantity - 1)}
            disabled={item.quantity <= 0} // Disable if quantity is 0, will be removed
          >
            <Icon name="minus" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onQuantityChange(item.id, item.quantity + 1)}
            disabled={item.quantity >= product.stock} // Disable if quantity reaches product stock
          >
            <Icon name="plus" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(item.id)}>
        <Icon name="trash-can-outline" size={24} color={theme.colors.danger} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.medium,
    marginVertical: theme.spacing.extraSmall,
    padding: theme.spacing.small,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.small,
    marginRight: theme.spacing.small,
    backgroundColor: theme.colors.background,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    ...theme.typography.body1,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: theme.spacing.extraSmall / 2,
  },
  productPrice: {
    ...theme.typography.body2,
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginBottom: theme.spacing.small,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.small,
    width: 100,
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.extraSmall,
  },
  quantityButton: {
    padding: theme.spacing.extraSmall,
  },
  quantityText: {
    ...theme.typography.body2,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: theme.spacing.small,
    marginLeft: theme.spacing.small,
  },
});

export default CartItem;
