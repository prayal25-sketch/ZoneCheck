import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Modal, TouchableWithoutFeedback, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';

import FloatingSearchBar from '../components/FloatingSearchBar';
import Card from '../components/Card';

const STOP_WORDS = new Set(['a', 'an', 'and', 'the', 'is', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'it', 'there', 'was', 'saw', 'this', 'that', 'i', 'just', 'some', 'my', 'here', 'are', 'got', 'by', 'huge', 'massive']);
const SEVERE_KEYWORDS = ['robbery', 'assault', 'theft', 'gun', 'knife', 'mugged', 'danger', 'suspicious', 'stabbing', 'murder', 'creepy', 'chased'];

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [crimes, setCrimes] = useState([]);
  const [userReports, setUserReports] = useState([]);
  const [isLoadingCrimes, setIsLoadingCrimes] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [customRemark, setCustomRemark] = useState('');
  
  const locationRef = useRef(null);
  // Force re-render when region changes so visible reports update
  const [, setForceUpdate] = useState(Date.now());

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      
      const lat = loc.coords.latitude;
      const lng = loc.coords.longitude;
      
      const initialLocation = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
      
      setLocation(initialLocation);
      locationRef.current = initialLocation;

      fetchCrimeData(lat, lng);
    })();
  }, []);

  const fetchCrimeData = async (lat, lng) => {
    setIsLoadingCrimes(true);
    try {
      const response = await fetch(`https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${lng}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setCrimes(data);
      } else {
        setCrimes([]); 
      }
    } catch (err) {
      console.error("Failed to fetch crimes:", err);
      setCrimes([]);
    } finally {
      setIsLoadingCrimes(false);
    }
  };

  const onRegionChangeComplete = (region) => {
    locationRef.current = region; 
    setForceUpdate(Date.now()); // Trigger re-render to recalculate visible reports
    fetchCrimeData(region.latitude, region.longitude);
  };

  const submitReport = () => {
    const remark = customRemark.trim();
    if (!remark) return;
    if (!locationRef.current && !location) return;
    
    // Threat Classification
    const isSevere = SEVERE_KEYWORDS.some(keyword => remark.toLowerCase().includes(keyword));
    const reportType = isSevere ? 'SEVERE' : 'HAZARD';

    const locToUse = locationRef.current || location;
    const newReport = {
      id: `report-${Date.now()}`,
      category: remark,
      type: reportType,
      location: {
        latitude: locToUse.latitude + 0.0005,
        longitude: locToUse.longitude + 0.0005,
      },
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    };

    setUserReports(prev => [newReport, ...prev]);
    setCustomRemark('');
    setIsReportModalVisible(false);
  };

  if (!location && !errorMsg) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a1a1a" />
      </View>
    );
  }

  // Filter User Reports to only those physically visible in the current map region
  const currentRegion = locationRef.current || location;
  let visibleReports = userReports;
  if (currentRegion && currentRegion.latitudeDelta) {
    visibleReports = userReports.filter(report => {
      const latDiff = Math.abs(report.location.latitude - currentRegion.latitude);
      const lngDiff = Math.abs(report.location.longitude - currentRegion.longitude);
      // Multiply by 1.2 to give a slight buffer so pins at the very edge don't flicker out too early
      return latDiff <= (currentRegion.latitudeDelta / 1.2) && lngDiff <= (currentRegion.longitudeDelta / 1.2);
    });
  }

  // --- NLP Trending Keywords Engine (Only uses VISIBLE reports) ---
  const extractTrendingAlerts = () => {
    const wordCounts = {};
    
    visibleReports.forEach(report => {
      const words = report.category.toLowerCase().replace(/[^\w\s]/gi, '').split(' ');
      words.forEach(word => {
        if (word.length > 2 && !STOP_WORDS.has(word)) {
          wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
      });
    });

    const trending = Object.keys(wordCounts)
      .map(word => ({ word: word.charAt(0).toUpperCase() + word.slice(1), count: wordCounts[word] }))
      .filter(item => item.count >= 2)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3); 

    return trending;
  };

  const historicalCount = crimes.length;
  const trendingAlerts = extractTrendingAlerts();
  
  // Calculate penalties: Only SEVERE visible reports impact the Danger Score!
  const severeReportsCount = visibleReports.filter(r => r.type === 'SEVERE').length;
  const dangerPenalty = Math.min(historicalCount, 50) + (severeReportsCount * 15) + (trendingAlerts.length * 15); 
  
  let safetyScore = Math.max(0, 100 - dangerPenalty);
  let statusText = 'Safe';
  let statusColor = '#4CAF50';

  if (safetyScore < 40) {
    statusText = 'Active Danger';
    statusColor = '#e74c3c';
  } else if (safetyScore < 70) {
    statusText = 'Caution';
    statusColor = '#f39c12';
  } else if (historicalCount === 0 && visibleReports.length === 0 && !isLoadingCrimes) {
    statusText = 'No Data / Safe';
    statusColor = '#3498db'; 
  }

  return (
    <View style={styles.page}>
      <FloatingSearchBar placeholder="Search for safe areas..." />
      
      <View style={styles.container}>
        {errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : (
          <MapView 
            style={styles.map} 
            initialRegion={location}
            showsUserLocation={true}
            onRegionChangeComplete={onRegionChangeComplete}
          >
            <Circle 
              center={currentRegion}
              radius={800}
              fillColor={`${statusColor}33`}
              strokeColor={statusColor}
            />

            {/* Historical Crimes */}
            {crimes.slice(0, 20).map((crime, index) => (
              <Marker
                key={crime.id || index}
                coordinate={{
                  latitude: parseFloat(crime.location.latitude),
                  longitude: parseFloat(crime.location.longitude)
                }}
                pinColor="#888888" // Gray for historical
                title={`Historical: ${crime.category.replace(/-/g, ' ')}`}
              />
            ))}

            {/* User Reported Hazards */}
            {userReports.map((report) => (
              <Marker
                key={report.id}
                coordinate={report.location}
                pinColor={report.type === 'SEVERE' ? 'red' : 'yellow'} 
                title={report.type === 'SEVERE' ? `🚨 THREAT REPORTED` : `🚧 HAZARD REPORTED`}
                description={`"${report.category}" at ${report.time}`}
              />
            ))}
          </MapView>
        )}
      </View>

      {/* Floating Report Button */}
      <TouchableOpacity 
        style={styles.reportFab} 
        onPress={() => setIsReportModalVisible(true)}
      >
        <Text style={styles.reportFabIcon}>+</Text>
        <Text style={styles.reportFabText}>Write Remark</Text>
      </TouchableOpacity>

      <View style={styles.bottomPanelContainer}>
        {/* Trending Alerts Chips */}
        {trendingAlerts.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingContainer}>
            {trendingAlerts.map((alert, index) => (
              <View key={index} style={styles.trendingChip}>
                <Text style={styles.trendingChipText}>⚠️ {alert.word} ({alert.count})</Text>
              </View>
            ))}
          </ScrollView>
        )}

        <Card style={styles.bottomCard}>
          <Text style={styles.cardTitle}>Real-Time Danger Meter</Text>
          
          {isLoadingCrimes && crimes.length === 0 ? (
            <ActivityIndicator size="small" color="#1a1a1a" style={{ marginVertical: 10 }} />
          ) : (
            <View style={styles.meterContainer}>
              <Text style={[styles.cardScore, { color: statusColor }]}>{safetyScore}/100</Text>
              <View style={[styles.badge, { backgroundColor: statusColor }]}>
                <Text style={styles.badgeText}>{statusText.toUpperCase()}</Text>
              </View>
            </View>
          )}

          <Text style={styles.crimeCountText}>
            {historicalCount} historical, {visibleReports.length > 0 ? <Text style={{color: '#f39c12', fontWeight: 'bold'}}>{visibleReports.length} nearby remarks</Text> : '0 nearby remarks'}.
          </Text>
          
          <TouchableOpacity style={[styles.reserveButton, safetyScore < 40 && { backgroundColor: '#e74c3c' }]}>
            <Text style={styles.reserveButtonText}>
              {safetyScore < 40 ? 'Call Emergency Services' : 'View Safe Routes'}
            </Text>
          </TouchableOpacity>
        </Card>
      </View>

      {/* Report Modal */}
      <Modal
        visible={isReportModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsReportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          {/* Background dismiss layer */}
          <TouchableOpacity 
            style={StyleSheet.absoluteFill} 
            activeOpacity={1} 
            onPress={() => setIsReportModalVisible(false)} 
          />
          
          <View style={styles.modalContent}>
            <View style={styles.modalDragIndicator} />
            <Text style={styles.modalTitle}>What do you see?</Text>
            <Text style={styles.modalSubtitle}>Write a remark. If others report the same thing, it becomes an active alert!</Text>
            
            <TextInput
              style={styles.remarkInput}
              placeholder="e.g. 'Robbery near the station' or 'Huge pothole'"
              placeholderTextColor="#999"
              value={customRemark}
              onChangeText={setCustomRemark}
              multiline
            />
            
            <TouchableOpacity 
              style={[styles.submitButton, !customRemark.trim() && { backgroundColor: '#ccc' }]}
              onPress={submitReport}
              disabled={!customRemark.trim()}
            >
              <Text style={styles.submitButtonText}>Submit Remark</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => {
                setCustomRemark('');
                setIsReportModalVisible(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f6f8',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 100,
  },
  bottomPanelContainer: {
    position: 'absolute',
    bottom: 110,
    left: 20,
    right: 20,
  },
  trendingContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  trendingChip: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  trendingChipText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  bottomCard: {
    alignItems: 'center',
    paddingTop: 15,
  },
  reportFab: {
    position: 'absolute',
    bottom: 310, 
    right: 20,
    backgroundColor: '#f39c12',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  reportFabIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
    marginTop: -2,
  },
  reportFabText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  meterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  cardScore: {
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  crimeCountText: {
    color: '#666',
    fontSize: 13,
    marginBottom: 20,
  },
  reserveButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  reserveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingBottom: 40,
  },
  modalDragIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#ddd',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  remarkInput: {
    backgroundColor: '#f4f6f8',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e1e4e8',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  submitButton: {
    backgroundColor: '#f39c12',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 15,
    padding: 15,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});
