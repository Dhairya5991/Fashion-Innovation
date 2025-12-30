import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { processBodyScan } from '../api/ar';
import { updateUserProfile } from '../api/user'; // To update measurements on backend
import { theme } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';

const { width, height } = Dimensions.get('window');

const ARScannerScreen = () => {
  const navigation = useNavigation();
  const cameraRef = useRef(null);
  const { user, token } = useSelector(state => state.auth);

  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('Position yourself in the frame.');
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
    const result = await check(permission);

    if (result === RESULTS.GRANTED) {
      setHasCameraPermission(true);
    } else {
      const requestResult = await request(permission);
      if (requestResult === RESULTS.GRANTED) {
        setHasCameraPermission(true);
      } else {
        Alert.alert(
          'Permission Denied',
          'Camera access is required to perform body scans. Please enable it in your app settings.'
        );
        navigation.goBack();
      }
    }
  };

  const takePicture = async () => {
    if (cameraRef.current && user?.id && token) {
      setIsScanning(true);
      setScanMessage('Processing image...');
      try {
        const options = { quality: 0.8, base64: true, fixOrientation: true, forceUpOrientation: true };
        const data = await cameraRef.current.takePictureAsync(options);

        // Send base64 image data to backend
        const imageData = `data:image/jpeg;base64,${data.base64}`;
        const contentType = 'image/jpeg'; // Assuming JPEG format

        const response = await processBodyScan(imageData, contentType, token);

        if (response?.measurements) {
          // Update user profile with new measurements via backend API
          await updateUserProfile(user.id, { measurements: response.measurements }, token);
          Alert.alert('Scan Complete', 'Your body measurements have been updated!');
          navigation.goBack(); // Go back to profile screen
        } else {
          Alert.alert('Scan Failed', 'Could not retrieve measurements. Please try again.');
        }
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to perform body scan.');
        console.error('Body Scan Error:', error);
      } finally {
        setIsScanning(false);
        setScanMessage('Position yourself in the frame.');
      }
    }
  };

  const toggleCameraType = () => {
    setCameraType(
      cameraType === RNCamera.Constants.Type.back
        ? RNCamera.Constants.Type.front
        : RNCamera.Constants.Type.back
    );
  };

  if (!hasCameraPermission) {
    return (
      <View style={globalStyles.loadingContainer}>
        <Text style={globalStyles.loadingText}>Requesting camera permission...</Text>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={cameraType}
        flashMode={RNCamera.Constants.FlashMode.off}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera for body scanning',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        captureAudio={false}
      >
        {({ camera, status, recordAudioPermissionStatus }) => {
          if (status !== 'READY') {
            return (
              <View style={globalStyles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.white} />
                <Text style={globalStyles.loadingText}>Initializing camera...</Text>
              </View>
            );
          }
          return (
            <View style={styles.cameraContent}>
              <View style={styles.overlay}>
                <Text style={styles.overlayText}>{scanMessage}</Text>
                {isScanning && <ActivityIndicator size="large" color={theme.colors.white} style={styles.spinner} />}
              </View>

              <View style={styles.controls}>
                <TouchableOpacity onPress={toggleCameraType} style={styles.flipButton}>
                  <Icon name="camera-retake" size={30} color={theme.colors.white} />
                </TouchableOpacity>
                <TouchableOpacity onPress={takePicture} style={styles.captureButton} disabled={isScanning}>
                  <Icon name="camera" size={40} color={theme.colors.white} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                  <Icon name="close-circle" size={30} color={theme.colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      </RNCamera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cameraContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    marginTop: height * 0.1,
    alignItems: 'center',
  },
  overlayText: {
    ...theme.typography.body1,
    color: theme.colors.white,
    textAlign: 'center',
  },
  spinner: {
    marginTop: theme.spacing.small,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing.large,
    paddingHorizontal: theme.spacing.medium,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.white,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  flipButton: {
    padding: theme.spacing.small,
    marginRight: theme.spacing.large,
  },
  closeButton: {
    padding: theme.spacing.small,
    marginLeft: theme.spacing.large,
  },
});

export default ARScannerScreen;
