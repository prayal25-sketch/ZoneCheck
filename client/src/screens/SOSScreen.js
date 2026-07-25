import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import Card from '../components/Card';
import Timeline from '../components/Timeline';

export default function SOSScreen() {
  const [sosActive, setSosActive] = useState(false);

  const timelineItems = [
    { title: 'SOS Triggered', description: 'Your emergency contacts have been notified.', time: 'Just now', completed: sosActive, active: false },
    { title: 'Responders Alerted', description: 'Local authorities have received your location.', time: sosActive ? 'In progress...' : '', completed: false, active: sosActive },
    { title: 'Help on the Way', description: 'Emergency services are dispatched.', time: '', completed: false, active: false },
    { title: 'Safe', description: 'You have marked yourself as safe.', time: '', completed: false, active: false },
  ];

  const triggerSOS = () => {
    // Attempt to open the native phone dialer with 911
    Linking.openURL('tel:911').catch(err => {
      Alert.alert("Error", "Could not open the phone dialer. Please dial 911 manually.");
    });
    setSosActive(true); // Still activate local tracking UI
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.headerTitle}>Emergency SOS</Text>
      
      <Card style={styles.trackingCard}>
        <Text style={styles.cardHeader}>Response Tracking</Text>
        <Text style={styles.cardSubHeader}>#SOS-REQ-992</Text>
        
        <Timeline items={timelineItems} />
      </Card>

      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[styles.sosButton, sosActive && styles.sosButtonActive]} 
          onPress={triggerSOS} 
          activeOpacity={0.8}
        >
          <Text style={styles.sosText}>{sosActive ? "CANCEL SOS" : "TRIGGER SOS"}</Text>
        </TouchableOpacity>
        
        {!sosActive && (
          <Text style={styles.helpText}>Hold for 3 seconds to trigger silently.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60, // Safe area padding
    paddingBottom: 100, // Space for tab bar
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 30,
  },
  trackingCard: {
    marginBottom: 40,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  cardSubHeader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  actionContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  sosButton: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  sosButtonActive: {
    backgroundColor: '#1a1a1a',
    shadowColor: '#1a1a1a',
  },
  sosText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  helpText: {
    color: '#999',
    marginTop: 15,
    fontSize: 14,
  }
});
