import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, LayoutAnimation, UIManager, Platform } from 'react-native';
import Card from '../components/Card';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FIRST_AID_GUIDES = [
  { 
    id: '1', 
    type: 'CPR (Adult)', 
    severity: 'Life-threatening', 
    icon: '🫀',
    instructions: "1. Call 911 immediately.\n2. Place heel of hand on center of chest.\n3. Push hard and fast (100-120 pushes a minute, 2 inches deep).\n4. Continue without stopping until help arrives."
  },
  { 
    id: '2', 
    type: 'Choking', 
    severity: 'Critical', 
    icon: '😮‍💨',
    instructions: "1. Stand behind the person and wrap arms around waist.\n2. Make a fist and place just above the navel.\n3. Grab fist with other hand and give 5 quick, upward thrusts.\n4. Repeat until object is dislodged."
  },
  { 
    id: '3', 
    type: 'Severe Bleeding', 
    severity: 'Life-threatening', 
    icon: '🩸',
    instructions: "1. Call 911.\n2. Apply direct, firm pressure to the wound with a clean cloth.\n3. If blood soaks through, add more cloth on top (do not remove the first).\n4. Keep pressure continuous until help arrives."
  },
  { 
    id: '4', 
    type: 'Burns', 
    severity: 'Serious', 
    icon: '🔥',
    instructions: "1. Cool the burn under cool (not cold) running water for 10-15 minutes.\n2. Remove rings or tight items from the burned area.\n3. Do NOT break blisters.\n4. Apply lotion (aloe vera) once cooled and cover with sterile gauze."
  },
];

export default function FirstAidScreen() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item.id;
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={() => toggleExpand(item.id)}>
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <View style={styles.contentContainer}>
              <Text style={styles.type}>{item.type}</Text>
              <Text style={[
                styles.severity, 
                item.severity === 'Life-threatening' || item.severity === 'Critical' ? styles.criticalText : styles.seriousText
              ]}>
                {item.severity}
              </Text>
            </View>
            <Text style={styles.arrow}>{isExpanded ? '⌃' : '⌄'}</Text>
          </View>
          
          {isExpanded && (
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>Instructions:</Text>
              <Text style={styles.instructionsText}>{item.instructions}</Text>
            </View>
          )}
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>First Aid Guides</Text>
        <Text style={styles.offlineBadge}>✓ Available Offline</Text>
      </View>
      
      <FlatList
        data={FIRST_AID_GUIDES}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  offlineBadge: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  list: {
    padding: 20,
    paddingBottom: 100, // Space for tab bar
  },
  card: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  icon: {
    fontSize: 24,
  },
  contentContainer: {
    flex: 1,
  },
  type: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  severity: {
    fontSize: 14,
    fontWeight: '600',
  },
  criticalText: {
    color: '#e74c3c',
  },
  seriousText: {
    color: '#f39c12',
  },
  arrow: {
    fontSize: 28,
    color: '#999',
    paddingHorizontal: 10,
  },
  instructionsContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 24,
  }
});
