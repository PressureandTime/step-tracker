import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';

export default function App() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [error, setError] = useState(null);

  const subscribe = async () => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable));

      if (isAvailable) {
        // Get steps from last 24 hours
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 1);

        console.log('Fetching past step count...');
        const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
        if (pastStepCountResult) {
          console.log('Past steps:', pastStepCountResult.steps);
          setPastStepCount(pastStepCountResult.steps);
        }

        console.log('Setting up step counter subscription...');
        return Pedometer.watchStepCount(result => {
          console.log('New steps:', result.steps);
          setCurrentStepCount(result.steps);
        });
      } else {
        setError('Pedometer is not available on this device');
        console.log('Pedometer is not available');
      }
    } catch (error) {
      console.error('Failed to set up pedometer:', error);
      setError(error.message);
      setIsPedometerAvailable('false');
    }
  };

  useEffect(() => {
    let subscription;
    
    const start = async () => {
      subscription = await subscribe();
    };

    start();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step Tracker</Text>
      <Text style={styles.text}>Pedometer status: {isPedometerAvailable}</Text>
      {error && <Text style={styles.error}>Error: {error}</Text>}
      <Text style={styles.text}>Steps taken in the last 24 hours: {pastStepCount}</Text>
      <Text style={styles.text}>Walk! New steps: {currentStepCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginVertical: 10,
  }
});
