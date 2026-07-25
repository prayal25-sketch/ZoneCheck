import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';

import MapScreen from './src/screens/MapScreen';
import SOSScreen from './src/screens/SOSScreen';
import FirstAidScreen from './src/screens/FirstAidScreen';

const Tab = createBottomTabNavigator();

const customLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f4f6f8',
    card: '#ffffff',
    border: '#e0e0e0',
    text: '#1a1a1a',
    primary: '#1a1a1a', // Black for primary actions like the concept's 'Reserve' button
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={customLightTheme}>
        <Tab.Navigator 
          screenOptions={{ 
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarItemStyle: styles.tabBarItem,
            tabBarActiveTintColor: '#ffffff',
            tabBarInactiveTintColor: '#888888',
            tabBarActiveBackgroundColor: '#1a1a1a', // Pill highlight
          }}
        >
          <Tab.Screen 
            name="Map" 
            component={MapScreen} 
            options={{ tabBarIconStyle: { display: "none" }, tabBarLabelStyle: styles.tabBarLabel }} 
          />
          <Tab.Screen 
            name="SOS" 
            component={SOSScreen} 
            options={{ 
              tabBarIconStyle: { display: "none" }, 
              tabBarLabelStyle: { ...styles.tabBarLabel, fontWeight: 'bold' },
              tabBarActiveBackgroundColor: '#e74c3c', // Red highlight for SOS
            }} 
          />
          <Tab.Screen 
            name="First Aid" 
            component={FirstAidScreen} 
            options={{ tabBarIconStyle: { display: "none" }, tabBarLabelStyle: styles.tabBarLabel }} 
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    elevation: 0,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    height: 70,
    paddingHorizontal: 10,
    paddingBottom: 0, // Reset default padding
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    borderTopWidth: 0, // Remove default border
  },
  tabBarItem: {
    margin: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
  tabBarLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 0, // Reset default label margin when no icon is present
  }
});
