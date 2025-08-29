import React, { createContext, useContext, useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import { calculateDistance } from '../utils/stepCalculations';

const StepCounterContext = createContext();

export const useStepCounter = () => useContext(StepCounterContext);

export const StepCounterProvider = ({ children }) => {
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isAvailable, setIsAvailable] = useState('checking');

  useEffect(() => {
    let subscription;

    const startStepCounting = async () => {
      try {
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
          
          subscription = Pedometer.watchStepCount(result => {
            setSteps(result.steps);
            setDistance(calculateDistance(result.steps));
          });
        }
      } catch (err) {
        console.error('Step counter error:', err);
        setIsAvailable('false');
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
    <StepCounterContext.Provider value={{ steps, distance, isAvailable }}>
      {children}
    </StepCounterContext.Provider>
  );
};