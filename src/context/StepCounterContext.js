import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform, PermissionsAndroid, AppState } from 'react-native';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateDistance } from '../utils/stepCalculations';

const StepCounterContext = createContext();

export const useStepCounter = () => useContext(StepCounterContext);

export const StepCounterProvider = ({ children }) => {
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isAvailable, setIsAvailable] = useState('checking');
  const [errorMessage, setErrorMessage] = useState('');
  const [dailyStepOffset, setDailyStepOffset] = useState(0);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
          {
            title: 'Step Counter Permission',
            message: 'Allow StepTracker to access your device motion for step counting?',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission error:', err);
        return false;
      }
    }
    return true;
  };

  // Save steps to storage
  const saveStepsToStorage = async (stepCount) => {
    try {
      const today = new Date().toDateString();
      await AsyncStorage.setItem('dailySteps', JSON.stringify({
        date: today,
        steps: stepCount,
        offset: dailyStepOffset
      }));
    } catch (error) {
      console.warn('Failed to save steps:', error);
    }
  };

  // Load steps from storage
  const loadStepsFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem('dailySteps');
      if (stored) {
        const data = JSON.parse(stored);
        const today = new Date().toDateString();
        
        if (data.date === today) {
          // Same day, restore steps
          return { steps: data.steps, offset: data.offset };
        } else {
          // New day, reset
          await AsyncStorage.removeItem('dailySteps');
          return { steps: 0, offset: 0 };
        }
      }
      return { steps: 0, offset: 0 };
    } catch (error) {
      console.warn('Failed to load steps:', error);
      return { steps: 0, offset: 0 };
    }
  };

  useEffect(() => {
    let subscription;

    const startStepCounting = async () => {
      try {
        const hasPermission = await requestPermission();
        if (!hasPermission) {
          setIsAvailable('false');
          setErrorMessage(
            'Permission denied. Please enable motion permissions in your device settings.'
          );
          return;
        }

        const available = await Pedometer.isAvailableAsync();
        setIsAvailable(String(available));

        if (available) {
          // Load previous steps
          const stored = await loadStepsFromStorage();
          setSteps(stored.steps);
          setDistance(calculateDistance(stored.steps));
          setDailyStepOffset(stored.offset);

          subscription = Pedometer.watchStepCount((result) => {
            // Calculate daily steps by subtracting device boot steps offset
            const dailySteps = Math.max(0, result.steps - stored.offset + stored.steps);
            setSteps(dailySteps);
            setDistance(calculateDistance(dailySteps));
            
            // Save periodically
            if (dailySteps % 10 === 0) {
              saveStepsToStorage(dailySteps);
            }
          });
        } else {
          setErrorMessage('Step counting is not supported on this device.');
        }
      } catch (err) {
        console.error('Step counter error:', err);
        setIsAvailable('false');
        setErrorMessage('Step counter error. Please try restarting the app.');
      }
    };

    startStepCounting();

    // Handle app state changes
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background' && steps > 0) {
        saveStepsToStorage(steps);
      }
    };

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      if (subscription) {
        subscription.remove();
      }
      if (appStateSubscription) {
        appStateSubscription.remove();
      }
    };
  }, [steps]);

  return (
    <StepCounterContext.Provider value={{ steps, distance, isAvailable, errorMessage }}>
      {children}
    </StepCounterContext.Provider>
  );
};
