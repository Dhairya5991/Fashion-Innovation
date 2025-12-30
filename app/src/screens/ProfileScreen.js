import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { logout } from '../store/actions/authActions';
import { getUserProfile, updateAvatarUrl, updateMeasurements } from '../api/user';
import { generateAvatar } from '../api/ar'; // AR API for avatar generation
import { theme } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, [user?.id, token]);

  const fetchUserProfile = async () => {
    if (!user?.id || !token) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const data = await getUserProfile(user.id, token);
      setProfileData(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch user profile.');
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    // Navigation is handled by AppNavigator based on token state
  };

  const handleBodyScan = () => {
    navigation.navigate('ARScanner');
  };

  const handleGenerateAvatar = async () => {
    if (!profileData?.measurements || Object.keys(profileData.measurements).length === 0) {
      Alert.alert('Missing Measurements', 'Please complete a body scan to get your measurements before generating an avatar.');
      return;
    }
    setIsGeneratingAvatar(true);
    try {
      const response = await generateAvatar(profileData.measurements, token);
      Alert.alert('Success', '3D avatar generated successfully!');
      setProfileData(prev => ({ ...prev, avatar_url: response.avatar_url }));
      // Optionally, dispatch an action to update user state in Redux
      // dispatch(updateUserAvatar(response.avatar_url));
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to generate avatar.');
      console.error('Error generating avatar:', error);
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  if (isLoading) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={globalStyles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={globalStyles.errorContainer}>
        <Text style={globalStyles.errorText}>Could not load profile data.</Text>
        <TouchableOpacity style={globalStyles.primaryButton} onPress={fetchUserProfile}>
          <Text style={globalStyles.primaryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={globalStyles.secondaryButton} onPress={handleLogout}>
          <Text style={globalStyles.secondaryButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { email, measurements, avatar_url } = profileData;

  return (
    <ScrollView style={globalStyles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Icon name="account-circle" size={80} color={theme.colors.primary} />
        <Text style={styles.emailText}>{email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Body Measurements</Text>
        {measurements && Object.keys(measurements).length > 0 ? (
          <View style={styles.measurementsContainer}>
            {Object.entries(measurements).map(([key, value]) => (
              <Text key={key} style={styles.measurementText}>
                {key.charAt(0).toUpperCase() + key.slice(1)}: {value} {measurements.unit || 'cm'}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={styles.noDataText}>No measurements available. Please perform a body scan.</Text>
        )}
        <TouchableOpacity style={globalStyles.secondaryButton} onPress={handleBodyScan}>
          <Text style={globalStyles.secondaryButtonText}>Perform Body Scan</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3D Avatar</Text>
        {avatar_url ? (
          <>
            <Image source={{ uri: avatar_url }} style={styles.avatarImage} />
            <Text style={styles.avatarUrlText}>Avatar URL: {avatar_url.substring(0, 50)}...</Text>
            {/* Optionally add a button to view avatar in 3D or AR */}
          </>
        ) : (
          <Text style={styles.noDataText}>No 3D avatar generated yet.</Text>
        )}
        <TouchableOpacity
          style={[globalStyles.primaryButton, isGeneratingAvatar && globalStyles.disabledButton]}
          onPress={handleGenerateAvatar}
          disabled={isGeneratingAvatar}
        >
          <Text style={globalStyles.primaryButtonText}>
            {isGeneratingAvatar ? 'Generating Avatar...' : 'Generate 3D Avatar'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: theme.spacing.medium,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.extraLarge,
    paddingTop: theme.spacing.large,
  },
  emailText: {
    ...theme.typography.h5,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.small,
  },
  section: {
    width: '100%',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.large,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  sectionTitle: {
    ...theme.typography.h6,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.medium,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.small,
  },
  measurementsContainer: {
    marginBottom: theme.spacing.medium,
  },
  measurementText: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.extraSmall,
  },
  noDataText: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: theme.spacing.medium,
  },
  avatarImage: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.small,
    resizeMode: 'contain',
    backgroundColor: theme.colors.background, // Placeholder background
    marginBottom: theme.spacing.small,
  },
  avatarUrlText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.medium,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: theme.colors.danger,
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.large,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.extraLarge,
    width: '80%',
    alignItems: 'center',
  },
  logoutButtonText: {
    ...theme.typography.button,
    color: theme.colors.white,
  },
});

export default ProfileScreen;
