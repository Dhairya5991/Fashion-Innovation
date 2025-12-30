import 'react-native-gesture-handler'; // Required for react-navigation
import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigator from './src/navigation/AppNavigator';
import store from './src/store';
import { theme } from './src/styles/theme';
import { globalStyles } from './src/styles/globalStyles';

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <View style={globalStyles.container}>
          <AppNavigator />
        </View>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  // Add any specific root App component styles if necessary
  // For now, globalStyles.container handles the main layout
});

export default App;
