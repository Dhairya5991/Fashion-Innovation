import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

import { getAllProducts } from '../api/products'; // To fetch products with sustainability data
import SustainabilityMetricsDisplay from '../components/SustainabilityMetricsDisplay';
import { theme } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';

const SustainabilityDashboardScreen = () => {
  const { token } = useSelector(state => state.auth);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedProductMetrics, setSelectedProductMetrics] = useState(null);

  const fetchProductsWithSustainability = useCallback(async () => {
    setIsLoading(true);
    try {
      const allProducts = await getAllProducts(null, '', token);
      // Filter products that actually have sustainability metrics
      const sustainableProducts = allProducts.filter(p => p.sustainability_metrics && Object.keys(p.sustainability_metrics).length > 0);
      setProducts(sustainableProducts);
    } catch (error) {
      Alert.alert('Error', 'Failed to load sustainability data.');
      console.error('Error fetching products for sustainability:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      fetchProductsWithSustainability();
    }, [fetchProductsWithSustainability])
  );

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchProductsWithSustainability();
  }, [fetchProductsWithSustainability]);

  const calculateOverallImpact = () => {
    if (products.length === 0) return { score: 'N/A', description: 'No data to calculate.' };

    let totalCarbonFootprint = 0;
    let totalWaterUsage = 0;
    let productCount = 0;

    products.forEach(p => {
      if (p.sustainability_metrics?.carbon_footprint) {
        totalCarbonFootprint += parseFloat(p.sustainability_metrics.carbon_footprint);
      }
      if (p.sustainability_metrics?.water_usage_liters) {
        totalWaterUsage += parseFloat(p.sustainability_metrics.water_usage_liters);
      }
      productCount++;
    });

    if (productCount === 0) return { score: 'N/A', description: 'No quantifiable metrics found.' };

    const avgCarbon = totalCarbonFootprint / productCount;
    const avgWater = totalWaterUsage / productCount;

    let impactScore = 'Medium';
    let description = 'Overall impact is moderate.';

    if (avgCarbon < 10 && avgWater < 500) { // Example thresholds
      impactScore = 'Low';
      description = 'Excellent! Your choices contribute to a low environmental impact.';
    } else if (avgCarbon > 30 || avgWater > 1500) {
      impactScore = 'High';
      description = 'Consider more sustainable alternatives for a lower environmental footprint.';
    }

    return { score: impactScore, description, avgCarbon: avgCarbon.toFixed(2), avgWater: avgWater.toFixed(2) };
  };

  const overallImpact = calculateOverallImpact();

  if (isLoading && !isRefreshing) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={globalStyles.loadingText}>Loading sustainability data...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={globalStyles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sustainability Dashboard</Text>
      </View>

      <View style={styles.overallImpactCard}>
        <Icon name="earth" size={60} color={theme.colors.success} style={styles.impactIcon} />
        <Text style={styles.overallImpactTitle}>Your Overall Impact</Text>
        <Text style={[styles.impactScore, { color: overallImpact.score === 'Low' ? theme.colors.success : overallImpact.score === 'High' ? theme.colors.danger : theme.colors.warning }]}>
          {overallImpact.score}
        </Text>
        <Text style={styles.impactDescription}>{overallImpact.description}</Text>
        {overallImpact.avgCarbon && (
          <Text style={styles.impactStats}>Avg. Carbon Footprint: {overallImpact.avgCarbon} kg CO2e/product</Text>
        )}
        {overallImpact.avgWater && (
          <Text style={styles.impactStats}>Avg. Water Usage: {overallImpact.avgWater} Liters/product</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Sustainable Products in Catalog</Text>
      {products.length === 0 ? (
        <View style={globalStyles.emptyStateContainer}>
          <Icon name="sprout" size={60} color={theme.colors.textSecondary} />
          <Text style={globalStyles.emptyStateText}>No products with sustainability metrics found.</Text>
          <Text style={globalStyles.emptyStateText}>Check back later or encourage brands to share data!</Text>
        </View>
      ) : (
        <View style={styles.productListContainer}>
          {products.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              onPress={() => setSelectedProductMetrics(product)}
            >
              <Image source={{ uri: product.image_urls[0] || 'https://via.placeholder.com/100' }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productCategory}>{product.category}</Text>
                <Icon name="leaf" size={20} color={theme.colors.success} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectedProductMetrics && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setSelectedProductMetrics(null)}>
              <Icon name="close-circle" size={30} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedProductMetrics.name} Metrics</Text>
            <ScrollView style={styles.modalScrollView}>
              <SustainabilityMetricsDisplay metrics={selectedProductMetrics.sustainability_metrics} />
            </ScrollView>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: theme.spacing.medium,
    paddingBottom: theme.spacing.extraLarge,
  },
  header: {
    paddingBottom: theme.spacing.medium,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    alignItems: 'center',
    marginBottom: theme.spacing.large,
    paddingTop: theme.spacing.large,
  },
  headerTitle: {
    ...theme.typography.h5,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  overallImpactCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.large,
    alignItems: 'center',
    marginBottom: theme.spacing.extraLarge,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  impactIcon: {
    marginBottom: theme.spacing.small,
  },
  overallImpactTitle: {
    ...theme.typography.h6,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.extraSmall,
  },
  impactScore: {
    ...theme.typography.h3,
    fontWeight: 'bold',
    marginBottom: theme.spacing.small,
  },
  impactDescription: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.medium,
  },
  impactStats: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.extraSmall,
  },
  sectionTitle: {
    ...theme.typography.h6,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.small,
  },
  productListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%', // Roughly two columns
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.medium,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    backgroundColor: theme.colors.background,
  },
  productInfo: {
    padding: theme.spacing.small,
  },
  productName: {
    ...theme.typography.body1,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  productCategory: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.extraSmall,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.large,
    width: '90%',
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  closeModalButton: {
    position: 'absolute',
    top: theme.spacing.small,
    right: theme.spacing.small,
    zIndex: 1,
  },
  modalTitle: {
    ...theme.typography.h5,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.medium,
    textAlign: 'center',
  },
  modalScrollView: {
    maxHeight: '80%',
  },
});

export default SustainabilityDashboardScreen;
