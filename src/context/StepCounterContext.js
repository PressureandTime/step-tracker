import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState } from 'react-native';
import { isStepCountingSupported, startStepCounterUpdate, stopStepCounterUpdate } from '@dongminyu/react-native-step-counter';
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
    try {
      const supported = await isStepCountingSupported();
      return supported;
    } catch (err) {
      console.warn('Step counter not supported:', err);
      return false;
    }
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
          setErrorMessage('Step counting is not supported on this device.');
          return;
        }

        setIsAvailable('true');

        // Load previous steps
        const stored = await loadStepsFromStorage();
        setSteps(stored.steps);
        setDistance(calculateDistance(stored.steps));

        // Start true background step counter
        subscription = startStepCounterUpdate(
          new Date(),
          ({ steps: currentSteps }) => {
            // Update steps in real-time (works in background!)
            setSteps(currentSteps);
            setDistance(calculateDistance(currentSteps));
            
            // Save periodically
            if (currentSteps % 10 === 0) {
              saveStepsToStorage(currentSteps);
            }
          }
        );

      } catch (err) {
        console.error('Step counter error:', err);
        setIsAvailable('false');
        setErrorMessage('Step counter error. Please try restarting the app.');
      }
    };

    startStepCounting();

    // Handle app state changes for saving
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background' && steps > 0) {
        saveStepsToStorage(steps);
      }
    };

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      if (subscription) {
        stopStepCounterUpdate();
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
