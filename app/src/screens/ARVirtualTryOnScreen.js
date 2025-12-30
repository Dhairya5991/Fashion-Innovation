import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { mapGarmentToAvatar } from '../api/ar'; // AR API for garment mapping
import ARView from '../components/ARView'; // Custom AR component
import Avatar3DRenderer from '../components/Avatar3DRenderer'; // Custom 3D Avatar renderer
import { theme } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';

const ARVirtualTryOnScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { garment3DModelUrl, productId } = route.params; // Passed from ProductDetailScreen
  const { user, token } = useSelector(state => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mappedGarmentData, setMappedGarmentData] = useState(null);
  const [isAvatarMode, setIsAvatarMode] = useState(true); // Toggle between avatar and live camera
  const [avatarModelUrl, setAvatarModelUrl] = useState(user?.avatar_url || null);

  useEffect(() => {
    if (!user?.id || !token) {
      setError('User not authenticated.');
      setIsLoading(false);
      return;
    }

    if (!avatarModelUrl && isAvatarMode) {
      setError('No 3D avatar found. Please generate one from your profile or switch to live camera mode.');
      setIsLoading(false);
      return;
    }

    if (!garment3DModelUrl && !productId) {
      setError('No garment 3D model provided.');
      setIsLoading(false);
      return;
    }

    // Only map garment if in avatar mode and avatar is available
    if (isAvatarMode && avatarModelUrl) {
      fetchGarmentMapping();
    } else if (!isAvatarMode) {
      // If in live camera mode, we might not need server-side mapping for a simple overlay
      // Or, the mapping service could return generic pose data for the garment
      // For this mock, we'll just set loading to false and use the raw garment URL
      setMappedGarmentData({
        mapped_garment_url: garment3DModelUrl, // Use original if no specific mapping for live AR
        transformation_matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -0.5, 1], // Example slight offset
        overlay_instructions: "apply_to_live_camera_feed",
      });
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }

  }, [user?.id, token, garment3DModelUrl, productId, isAvatarMode, avatarModelUrl]);

  const fetchGarmentMapping = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await mapGarmentToAvatar(user.avatar_url, garment3DModelUrl || productId, token);
      setMappedGarmentData(response.mapping_data);
    } catch (err) {
      setError(err.message || 'Failed to map garment to avatar.');
      Alert.alert('AR Error', err.message || 'Failed to prepare garment for virtual try-on.');
      console.error('AR Mapping Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsAvatarMode(prev => !prev);
    setError(null); // Clear errors when switching modes
  };

  if (isLoading) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={globalStyles.loadingText}>
          {isAvatarMode ? 'Mapping garment to avatar...' : 'Initializing AR camera...'}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={globalStyles.errorContainer}>
        <Text style={globalStyles.errorText}>{error}</Text>
        <TouchableOpacity style={globalStyles.primaryButton} onPress={() => navigation.goBack()}>
          <Text style={globalStyles.primaryButtonText}>Go Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={globalStyles.secondaryButton} onPress={fetchGarmentMapping}>
          <Text style={globalStyles.secondaryButtonText}>Retry Mapping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isAvatarMode && avatarModelUrl ? (
        <Avatar3DRenderer
          avatarModelUrl={avatarModelUrl}
          garment3DModelUrl={mappedGarmentData?.mapped_garment_url || garment3DModelUrl}
          garmentTransformation={mappedGarmentData?.transformation_matrix}
          userMeasurements={user?.measurements}
          onPoseChange={(pose) => console.log('Avatar pose changed:', pose)}
        />
      ) : (
        <ARView
          garment3DModelUrl={mappedGarmentData?.mapped_garment_url || garment3DModelUrl}
          garmentTransformation={mappedGarmentData?.transformation_matrix}
          isAvatarMode={false} // Indicates live camera AR
        />
      )}

      <View style={styles.controlPanel}>
        <TouchableOpacity style={styles.modeToggleButton} onPress={handleToggleMode}>
          <Icon name={isAvatarMode ? 'camera' : 'human-greeting-variant'} size={24} color={theme.colors.white} />
          <Text style={styles.modeToggleButtonText}>
            {isAvatarMode ? 'Live AR' : 'Avatar AR'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left-circle" size={24} color={theme.colors.white} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  controlPanel: {
    position: 'absolute',
    bottom: theme.spacing.medium,
    left: theme.spacing.medium,
    right: theme.spacing.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.small,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: theme.borderRadius.large,
  },
  modeToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.small,
  },
  modeToggleButtonText: {
    ...theme.typography.button,
    color: theme.colors.white,
    marginLeft: theme.spacing.extraSmall,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.small,
  },
  backButtonText: {
    ...theme.typography.button,
    color: theme.colors.white,
    marginLeft: theme.spacing.extraSmall,
  },
});

export default ARVirtualTryOnScreen;
