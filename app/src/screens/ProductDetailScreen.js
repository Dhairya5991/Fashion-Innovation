import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { getProductById } from '../api/products';
import { addItemToCart } from '../store/actions/cartActions';
import SustainabilityMetricsDisplay from '../components/SustainabilityMetricsDisplay';
import { theme } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';

const { width: viewportWidth } = Dimensions.get('window');
const SLIDER_WIDTH = viewportWidth;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8); // Adjust as needed

const ProductDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { productId } = route.params;
  const { token } = useSelector(state => state.auth);

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [productId, token]);

  const fetchProductDetails = async () => {
    setIsLoading(true);
    try {
      const data = await getProductById(productId, token);
      setProduct(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load product details.');
      console.error('Error fetching product details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAddingToCart(true);
    try {
      await dispatch(addItemToCart(product.id, 1, token)); // Add 1 quantity
      Alert.alert('Success', `${product.name} added to cart!`);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to add item to cart.');
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleVirtualTryOn = () => {
    if (product && product['3d_model_url']) {
      navigation.navigate('ARVirtualTryOn', {
        garment3DModelUrl: product['3d_model_url'],
        productId: product.id,
      });
    } else {
      Alert.alert('AR Unavailable', 'This product does not have a 3D model for virtual try-on.');
    }
  };

  const renderImageItem = ({ item, index }) => {
    return (
      <View style={styles.imageContainer}>
        <Image source={{ uri: item }} style={styles.productImage} resizeMode="contain" />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={globalStyles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={globalStyles.errorContainer}>
        <Text style={globalStyles.errorText}>Product not found.</Text>
        <TouchableOpacity style={globalStyles.primaryButton} onPress={() => navigation.goBack()}>
          <Text style={globalStyles.primaryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.container}>
      {product.image_urls && product.image_urls.length > 0 ? (
        <Carousel
          data={product.image_urls}
          renderItem={renderImageItem}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={ITEM_WIDTH}
          inactiveSlideScale={0.9}
          inactiveSlideOpacity={0.7}
          containerCustomStyle={styles.carouselContainer}
        />
      ) : (
        <View style={styles.noImageContainer}>
          <Icon name="image-off" size={80} color={theme.colors.textSecondary} />
          <Text style={styles.noImageText}>No images available</Text>
        </View>
      )}

      <View style={styles.detailsContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>₹{parseFloat(product.price).toFixed(2)}</Text>
        {product.category && <Text style={styles.productCategory}>{product.category}</Text>}
        <Text style={styles.productDescription}>{product.description}</Text>

        <View style={styles.stockContainer}>
          <Text style={styles.stockText}>
            Stock: <Text style={{ color: product.stock > 0 ? theme.colors.success : theme.colors.danger }}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </Text>
          </Text>
        </View>

        {product.sustainability_metrics && Object.keys(product.sustainability_metrics).length > 0 && (
          <View style={styles.sustainabilitySection}>
            <Text style={styles.sectionTitle}>Sustainability Metrics</Text>
            <SustainabilityMetricsDisplay metrics={product.sustainability_metrics} />
          </View>
        )}

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[
              globalStyles.primaryButton,
              styles.actionButton,
              (product.stock === 0 || isAddingToCart) && globalStyles.disabledButton,
            ]}
            onPress={handleAddToCart}
            disabled={product.stock === 0 || isAddingToCart}
          >
            {isAddingToCart ? (
              <ActivityIndicator color={theme.colors.white} />
            ) : (
              <Text style={globalStyles.primaryButtonText}>
                <Icon name="cart-plus" size={20} color={theme.colors.white} /> Add to Cart
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              globalStyles.secondaryButton,
              styles.actionButton,
              !product['3d_model_url'] && globalStyles.disabledButton,
            ]}
            onPress={handleVirtualTryOn}
            disabled={!product['3d_model_url']}
          >
            <Text style={globalStyles.secondaryButtonText}>
              <Icon name="cube-scan" size={20} color={theme.colors.primary} /> Virtual Try-On
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    marginTop: theme.spacing.medium,
    height: 300, // Fixed height for carousel
  },
  imageContainer: {
    width: ITEM_WIDTH,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  noImageContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.medium,
    marginVertical: theme.spacing.medium,
  },
  noImageText: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.small,
  },
  detailsContainer: {
    padding: theme.spacing.medium,
  },
  productName: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.extraSmall,
  },
  productPrice: {
    ...theme.typography.h5,
    color: theme.colors.primary,
    marginBottom: theme.spacing.small,
    fontWeight: 'bold',
  },
  productCategory: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.medium,
  },
  productDescription: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.large,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.large,
  },
  stockText: {
    ...theme.typography.body2,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  sustainabilitySection: {
    marginTop: theme.spacing.medium,
    paddingTop: theme.spacing.medium,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  sectionTitle: {
    ...theme.typography.h6,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.medium,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.extraLarge,
    marginBottom: theme.spacing.medium,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: theme.spacing.small,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProductDetailScreen;
