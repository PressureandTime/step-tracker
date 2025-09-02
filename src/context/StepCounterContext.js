import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { calculateDistance } from '../utils/stepCalculations';

const StepCounterContext = createContext();

export const useStepCounter = () => useContext(StepCounterContext);

export const StepCounterProvider = ({ children }) => {
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isAvailable, setIsAvailable] = useState('checking');
  const [errorMessage, setErrorMessage] = useState('');

  const requestActivityRecognitionPermission = async () => {
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

        return {
          granted: granted === PermissionsAndroid.RESULTS.GRANTED,
          result: granted,
        };
      } catch (err) {
        console.warn('Permission request error:', err);
        return { granted: false, result: 'error' };
      }
    } else {
      // iOS: Permissions handled by expo-sensors plugin
      return { granted: true, result: 'granted' };
    }
  };

  useEffect(() => {
    let subscription;

    const startStepCounting = async () => {
      try {
        // Request permissions first
        const permissionResult = await requestActivityRecognitionPermission();

        if (!permissionResult.granted) {
          setIsAvailable('false');

          // Handle different permission denial scenarios
          if (Platform.OS === 'android') {
            switch (permissionResult.result) {
              case PermissionsAndroid.RESULTS.DENIED:
                setErrorMessage(
                  'Motion permission was denied. Please restart the app and grant permission to enable step counting.'
                );
                break;
              case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
                setErrorMessage(
                  'Motion permission was permanently denied. Please enable it manually in your device Settings > Apps > StepTracker > Permissions.'
                );
                break;
              default:
                setErrorMessage(
                  'Permission denied. Please enable motion permissions in your device settings.'
                );
            }
          } else {
            // iOS permission handling
            switch (permissionResult.result) {
              case 'denied':
                setErrorMessage(
                  'Motion permission was denied. Please enable it in Settings > Privacy & Security > Motion & Fitness.'
                );
                break;
              default:
                setErrorMessage(
                  'Permission denied. Please enable motion permissions in your device settings.'
                );
            }
          }
          return;
        }

        const available = await Pedometer.isAvailableAsync();
        setIsAvailable(String(available));

        if (available) {
          // Note: getStepCountAsync is not supported on Android
          // We'll rely on watchStepCount for real-time step counting
          if (Platform.OS === 'ios') {
            try {
              const end = new Date();
              const start = new Date();
              start.setHours(0, 0, 0, 0);

              const dailySteps = await Pedometer.getStepCountAsync(start, end);
              if (dailySteps) {
                setSteps(dailySteps.steps);
                setDistance(calculateDistance(dailySteps.steps));
              }
            } catch (error) {
              console.log('Historical step data not available:', error);
              // Continue with live step counting
            }
          }

          // Start live step counting (works on both iOS and Android)
          // Note: watchStepCount gives the current total step count
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
