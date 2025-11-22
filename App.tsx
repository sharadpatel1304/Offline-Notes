import 'react-native-get-random-values'; 
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/Appnavigator'; 

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
