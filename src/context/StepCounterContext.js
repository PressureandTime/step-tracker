import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { calculateDistance } from '../utils/stepCalculations';

const StepCounterContext = createContext();

export const useStepCounter = () => useContext(StepCounterContext);

export const StepCounterProvider = ({ children }) => {
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isAvailable, setIsAvailable] = useState('checking');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let subscription;

    const startStepCounting = async () => {
      try {
        // Check permissions first
        const { status: existingStatus } = await Pedometer.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          // Show simple explanation before requesting permission
          Alert.alert(
            'Step Counter Permission',
            'This app needs access to your device motion to count your steps and track your daily activity.',
            [{ text: 'OK' }]
          );
          const { status } = await Pedometer.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          setIsAvailable('false');
          setErrorMessage(
            'Permission denied. Please enable motion permissions in your device settings.'
          );
          return;
        }

        const available = await Pedometer.isAvailableAsync();
        setIsAvailable(String(available));

        if (available) {
          const end = new Date();
          const start = new Date();
          start.setHours(0, 0, 0, 0);

          const dailySteps = await Pedometer.getStepCountAsync(start, end);
          if (dailySteps) {
            setSteps(dailySteps.steps);
            setDistance(calculateDistance(dailySteps.steps));
          }

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
