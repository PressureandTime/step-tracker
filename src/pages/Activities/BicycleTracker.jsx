/* BicycleTracker.jsx */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

// Threshold in m/s to differentiate bicycling from walking (for example, 3 m/s = ~10.8 km/h)
const BICYCLE_SPEED_THRESHOLD = 3;

// Haversine formula to calculate distance between two coordinates, returning distance in meters
const haversineDistance = (coords1, coords2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371e3; // metres
  const lat1 = coords1.latitude;
  const lat2 = coords2.latitude;
  const deltaLat = toRad(coords2.latitude - coords1.latitude);
  const deltaLon = toRad(coords2.longitude - coords1.longitude);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d; // in meters
};

export const BicycleTracker = () => {
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0); // instantaneous speed in m/s
  const [prevPosition, setPrevPosition] = useState(null);
  const [prevTimestamp, setPrevTimestamp] = useState(null);
  const [mode, setMode] = useState('unknown');

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const { timestamp } = position;
        const currentPosition = { latitude, longitude };

        if (prevPosition && prevTimestamp) {
          const d = haversineDistance(prevPosition, currentPosition);
          const timeDiff = (timestamp - prevTimestamp) / 1000; // seconds
          const currentSpeed = timeDiff > 0 ? d / timeDiff : 0;
          setDistance((prev) => prev + d);
          setSpeed(currentSpeed);

          // Determine mode based on speed threshold
          if (currentSpeed > BICYCLE_SPEED_THRESHOLD) {
            setMode('bicycling');
          } else {
            setMode('walking');
          }
        }
        // Update previous position and timestamp
        setPrevPosition(currentPosition);
        setPrevTimestamp(timestamp);
      },
      (error) => {
        console.error('Error getting geolocation', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      }
    );

    return () => Geolocation.clearWatch(watchId);
  }, [prevPosition, prevTimestamp]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bicycle Tracker</Text>
      <Text style={styles.text}>Distance Traveled: {(distance / 1000).toFixed(2)} km</Text>
      <Text style={styles.text}>Instant Speed: {(speed * 3.6).toFixed(2)} km/h</Text>
      <Text style={styles.text}>Detected Mode: {mode}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginVertical: 4,
  },
});

export default BicycleTracker;
