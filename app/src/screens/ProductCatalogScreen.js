import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../api/products';
import { theme } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';

const ProductCatalogScreen = () => {
  const navigation = useNavigation();
  const { token } = useSelector(state => state.auth);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null); // Filter by category

  const categories = ['All', 'Apparel', 'Accessories', 'Footwear', 'Outerwear']; // Example categories

  const fetchProducts = useCallback(async (category = null, search = '') => {
    setIsLoading(true);
    try {
      const fetchedProducts = await getAllProducts(category, search, token);
      setProducts(fetchedProducts);
    } catch (error) {
      Alert.alert('Error', 'Failed to load products. Please try again.');
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      fetchProducts(selectedCategory, searchQuery);
    }, [fetchProducts, selectedCategory, searchQuery])
  );

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchProducts(selectedCategory, searchQuery);
  }, [fetchProducts, selectedCategory, searchQuery]);

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category === 'All' ? null : category);
    setSearchQuery(''); // Clear search when category changes
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Product Catalog</Text>
      </View>

      <View style={styles.searchBarContainer}>
        <Icon name="magnify" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          onSubmitEditing={() => fetchProducts(selectedCategory, searchQuery)}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchButton}>
            <Icon name="close-circle" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              (selectedCategory === category || (category === 'All' && !selectedCategory)) && styles.selectedCategoryButton,
            ]}
            onPress={() => handleCategorySelect(category)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                (selectedCategory === category || (category === 'All' && !selectedCategory)) && styles.selectedCategoryButtonText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading && !isRefreshing ? (
        <View style={globalStyles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={globalStyles.loadingText}>Loading products...</Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={globalStyles.emptyStateContainer}>
          <Icon name="tshirt-crew-outline" size={80} color={theme.colors.textSecondary} />
          <Text style={globalStyles.emptyStateText}>No products found matching your criteria.</Text>
          <TouchableOpacity style={globalStyles.primaryButton} onPress={() => { setSelectedCategory(null); setSearchQuery(''); onRefresh(); }}>
            <Text style={globalStyles.primaryButtonText}>Browse All Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard product={item} onPress={() => handleProductPress(item)} />
          )}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.productList}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
          }
        />
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
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.large,
    margin: theme.spacing.medium,
    paddingHorizontal: theme.spacing.small,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  searchIcon: {
    marginRight: theme.spacing.small,
  },
  searchInput: {
    flex: 1,
    ...theme.typography.body1,
    color: theme.colors.textPrimary,
    paddingVertical: Platform.OS === 'ios' ? theme.spacing.small : 8, // Adjust for consistent height
  },
  clearSearchButton: {
    marginLeft: theme.spacing.small,
    padding: theme.spacing.extraSmall,
  },
  categoryScroll: {
    marginVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.small,
  },
  categoryButton: {
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    borderRadius: theme.borderRadius.large,
    backgroundColor: theme.colors.cardBackground,
    marginHorizontal: theme.spacing.extraSmall,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedCategoryButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryButtonText: {
    ...theme.typography.button,
    color: theme.colors.textSecondary,
  },
  selectedCategoryButtonText: {
    color: theme.colors.white,
  },
  productList: {
    paddingHorizontal: theme.spacing.small,
    paddingBottom: theme.spacing.large,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing.small,
  },
});

export default ProductCatalogScreen;
