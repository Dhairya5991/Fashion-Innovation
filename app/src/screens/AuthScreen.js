import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '../store/actions/authActions';
import { theme } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AuthScreen = ({ navigation }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    if (isRegister && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      if (isRegister) {
        await dispatch(register(email, password));
        Alert.alert('Success', 'Registration successful! You are now logged in.');
      } else {
        await dispatch(login(email, password));
        Alert.alert('Success', 'Login successful!');
      }
      // Navigation is handled by AppNavigator based on token state
    } catch (err) {
      Alert.alert('Authentication Failed', err.message || 'Something went wrong.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.flex1}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/869/869636.png' }} // Placeholder logo
          style={styles.logo}
        />
        <Text style={styles.title}>{isRegister ? 'Register' : 'Login'}</Text>

        <TextInput
          style={globalStyles.input}
          placeholder="Email"
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={globalStyles.input}
          placeholder="Password"
          placeholderTextColor={theme.colors.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {isRegister && (
          <TextInput
            style={globalStyles.input}
            placeholder="Confirm Password"
            placeholderTextColor={theme.colors.textSecondary}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        )}

        {error && <Text style={globalStyles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[globalStyles.primaryButton, isLoading && globalStyles.disabledButton]}
          onPress={handleAuth}
          disabled={isLoading}
        >
          <Text style={globalStyles.primaryButtonText}>
            {isLoading ? (isRegister ? 'Registering...' : 'Logging In...') : (isRegister ? 'Register' : 'Login')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchModeButton}
          onPress={() => setIsRegister(!isRegister)}
          disabled={isLoading}
        >
          <Text style={styles.switchModeButtonText}>
            {isRegister ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
          </Text>
        </TouchableOpacity>

        <View style={styles.socialLoginContainer}>
          <Text style={styles.socialLoginText}>Or {isRegister ? 'Register' : 'Login'} with</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name="google" size={24} color={theme.colors.google} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name="apple" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Icon name="facebook" size={24} color={theme.colors.facebook} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.large,
    backgroundColor: theme.colors.background,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: theme.spacing.large,
    tintColor: theme.colors.primary,
  },
  title: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.extraLarge,
  },
  switchModeButton: {
    marginTop: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
  },
  switchModeButtonText: {
    ...theme.typography.body2,
    color: theme.colors.primary,
  },
  socialLoginContainer: {
    marginTop: theme.spacing.extraLarge,
    width: '100%',
    alignItems: 'center',
  },
  socialLoginText: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.medium,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  socialButton: {
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.large,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});

export default AuthScreen;
