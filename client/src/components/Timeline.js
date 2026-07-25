import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Timeline({ items }) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          {/* Timeline Line and Dot */}
          <View style={styles.lineContainer}>
            <View style={[
              styles.dot, 
              { backgroundColor: item.completed ? '#4CAF50' : (item.active ? '#FF9800' : '#E0E0E0') }
            ]} />
            {index < items.length - 1 && (
              <View style={[
                styles.line,
                { backgroundColor: item.completed ? '#4CAF50' : '#E0E0E0' }
              ]} />
            )}
          </View>
          
          {/* Content */}
          <View style={styles.contentContainer}>
            <Text style={[styles.title, !item.completed && !item.active && styles.inactiveText]}>
              {item.title}
            </Text>
            {item.description && (
              <Text style={styles.description}>{item.description}</Text>
            )}
            {item.time && (
              <Text style={styles.time}>{item.time}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  lineContainer: {
    alignItems: 'center',
    width: 30,
    marginRight: 10,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    zIndex: 1,
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: -2,
    marginBottom: -2,
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 25,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  inactiveText: {
    color: '#999999',
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#999999',
    position: 'absolute',
    right: 0,
    top: 2,
  },
});
