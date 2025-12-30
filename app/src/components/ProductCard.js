import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../styles/theme';

const ProductCard = ({ product, onPress }) => {
  const imageUrl = product.image_urls && product.image_urls.length > 0
    ? product.image_urls[0]
    : 'https://via.placeholder.com/150?text=No+Image'; // Placeholder image

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(product)}>
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.price}>₹{parseFloat(product.price).toFixed(2)}</Text>
        {product.stock === 0 && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
        {product.sustainability_metrics && Object.keys(product.sustainability_metrics).length > 0 && (
          <View style={styles.sustainabilityBadge}>
            <Icon name="leaf" size={16} color={theme.colors.success} />
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    width: '48%', // Adjust for two columns with spacing
    marginVertical: theme.spacing.extraSmall,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: theme.colors.background, // Fallback background
  },
  infoContainer: {
    padding: theme.spacing.small,
  },
  name: {
    ...theme.typography.body1,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: theme.spacing.extraSmall / 2,
  },
  price: {
    ...theme.typography.body2,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: theme.spacing.small,
    right: theme.spacing.small,
    backgroundColor: theme.colors.danger,
    borderRadius: theme.borderRadius.small,
    paddingHorizontal: theme.spacing.extraSmall,
    paddingVertical: 2,
  },
  outOfStockText: {
    ...theme.typography.caption,
    color: theme.colors.white,
    fontWeight: 'bold',
  },
  sustainabilityBadge: {
    position: 'absolute',
    bottom: theme.spacing.small,
    right: theme.spacing.small,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.small,
    padding: 2,
  },
});

export default ProductCard;
