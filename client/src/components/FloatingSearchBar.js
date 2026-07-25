import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export default function FloatingSearchBar({ placeholder = "Search" }) {
  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <View style={styles.iconPlaceholder} />
        <TextInput 
          style={styles.input} 
          placeholder={placeholder}
          placeholderTextColor="#999"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50, // Safe area padding roughly
    left: 20,
    right: 20,
    zIndex: 10,
  },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 30,
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  iconPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
});
