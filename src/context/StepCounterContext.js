import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { calculateDistance } from '../utils/stepCalculations';

const StepCounterContext = createContext();

export const useStepCounter = () => useContext(StepCounterContext);

export const StepCounterProvider = ({ children }) => {
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isAvailable, setIsAvailable] = useState('checking');
  const [errorMessage, setErrorMessage] = useState('');

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
          subscription = Pedometer.watchStepCount((result) => {
            setSteps(result.steps);
            setDistance(calculateDistance(result.steps));
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

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return (
    <StepCounterContext.Provider value={{ steps, distance, isAvailable, errorMessage }}>
      {children}
    </StepCounterContext.Provider>
  );
};
