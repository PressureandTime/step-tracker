import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, Linking, Platform } from 'react-native';
import { Pedometer, Barometer, DeviceMotion } from 'expo-sensors';
import { LineChart } from 'react-native-chart-kit';
import styles from './ActivitiesStyles';

import MetricCard from '../../components/metrics/MetricsCard';
import {
  STEP_LENGTH,
  calculateDistance,
  calculateCalories,
  calculatePace,
} from '../../utils/stepCalculations';

const MOTION_THRESHOLD = 1.1; // Lowered main threshold
const MOTION_THRESHOLD_LOW = 0.6; // Lowered completion threshold
const STEP_TIMEOUT = 250; // Reduced timeout for more frequent detection
const SMOOTHING_WINDOW = 2; // Reduced smoothing for quicker response
const MAX_STEP_TIME = 400; // Increased max step time for slower walking

export const Activities = () => {
  const [currentData, setCurrentData] = useState({
    steps: 0,
    distance: 0,
    pace: 0,
    calories: 0,
    elevation: 0,
  });
  const [historicalData, setHistoricalData] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    lastUpdate: null,
    lastStepCount: 0,
    totalUpdates: 0,
    acceleration: 0,
    smoothedAcceleration: 0,
  });

  const lastStepTime = useRef(0);
  const initialSteps = useRef(0);
  const motionSubscription = useRef(null);
  const accelerationBuffer = useRef([]);
  const lastPeakTime = useRef(0);
  const isStepInProgress = useRef(false);

  const updateCurrentMetrics = (steps, isIncrement = false) => {
    const now = new Date();
    console.log(
      'Updating metrics with steps:',
      steps,
      'isIncrement:',
      isIncrement,
      'at:',
      now.toLocaleTimeString()
    );

    setCurrentData((prev) => {
      const totalSteps = isIncrement ? prev.steps + steps : steps;
      console.log('Previous steps:', prev.steps, 'New total steps:', totalSteps);

      const distance = calculateDistance(totalSteps);
      const calories = calculateCalories(totalSteps);
      const pace = calculatePace(totalSteps, distance);

      setDebugInfo((prevDebug) => ({
        ...prevDebug,
        lastUpdate: now.toLocaleTimeString(),
        lastStepCount: steps,
        totalUpdates: prevDebug.totalUpdates + 1,
      }));

      return {
        ...prev,
        steps: totalSteps,
        distance,
        calories,
        pace,
      };
    });
  };

  const calculateSmoothedAcceleration = (newAcceleration) => {
    // Add new acceleration to buffer
    accelerationBuffer.current.push(newAcceleration);

    // Keep only the last SMOOTHING_WINDOW samples
    if (accelerationBuffer.current.length > SMOOTHING_WINDOW) {
      accelerationBuffer.current.shift();
    }

    // Calculate moving average
    const sum = accelerationBuffer.current.reduce((a, b) => a + b, 0);
    return sum / accelerationBuffer.current.length;
  };

  const detectStep = (acceleration) => {
    const now = Date.now();
    const smoothedAcceleration = calculateSmoothedAcceleration(acceleration);

    setDebugInfo((prev) => ({
      ...prev,
      acceleration: acceleration.toFixed(2),
      smoothedAcceleration: smoothedAcceleration.toFixed(2),
    }));

    // Step detection state machine with improved logic
    if (!isStepInProgress.current) {
      // Look for start of step (upward movement)
      if (acceleration > MOTION_THRESHOLD) {
        // Use raw acceleration for quicker response
        console.log('Potential step start, acceleration:', acceleration);
        isStepInProgress.current = true;
        lastPeakTime.current = now;
      }
    } else {
      // Already in a step, look for completion using smoothed value
      if (smoothedAcceleration < MOTION_THRESHOLD_LOW) {
        // Check if the step cycle completed within a reasonable time
        const stepDuration = now - lastPeakTime.current;
        if (stepDuration < MAX_STEP_TIME && stepDuration > 100) {
          // Added minimum step time
          console.log(
            'Step detected! Duration:',
            stepDuration,
            'ms, Acceleration:',
            acceleration,
            'Smoothed:',
            smoothedAcceleration
          );
          lastStepTime.current = now;
          updateCurrentMetrics(1, true);
        } else {
          console.log('Invalid step duration:', stepDuration, 'ms - ignoring');
        }
        isStepInProgress.current = false;
      } else if (now - lastPeakTime.current > MAX_STEP_TIME) {
        // Reset if step is taking too long
        console.log('Resetting step detection - timeout');
        isStepInProgress.current = false;
      }
    }
  };

  const startMotionTracking = async () => {
    try {
      // Get initial steps for today
      const end = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      console.log('Fetching initial steps for today from:', start, 'to:', end);
      const dailySteps = await Pedometer.getStepCountAsync(start, end);
      console.log('Initial daily steps:', dailySteps?.steps);

      if (dailySteps) {
        initialSteps.current = dailySteps.steps;
        updateCurrentMetrics(dailySteps.steps);
      }

      // Start motion tracking with higher frequency
      await DeviceMotion.setUpdateInterval(20); // Even higher frequency
      motionSubscription.current = DeviceMotion.addListener(({ acceleration }) => {
        if (!acceleration) return;

        // Calculate total acceleration magnitude
        const magnitude = Math.sqrt(
          Math.pow(acceleration.x, 2) + Math.pow(acceleration.y, 2) + Math.pow(acceleration.z, 2)
        );

        detectStep(magnitude);
      });

      console.log('Motion tracking started with parameters:', {
        threshold: MOTION_THRESHOLD,
        lowThreshold: MOTION_THRESHOLD_LOW,
        timeout: STEP_TIMEOUT,
        maxStepTime: MAX_STEP_TIME,
        updateInterval: 20,
        smoothingWindow: SMOOTHING_WINDOW,
      });
    } catch (error) {
      console.error('Error starting motion tracking:', error);
    }
  };

  useEffect(() => {
    let subscription;

    const initialize = async () => {
      try {
        console.log('Requesting permissions...');
        const [motionPermission, pedometerPermission] = await Promise.all([
          DeviceMotion.requestPermissionsAsync(),
          Pedometer.requestPermissionsAsync(),
        ]);

        if (motionPermission.status !== 'granted' || pedometerPermission.status !== 'granted') {
          console.log('Permission denied');
          Alert.alert(
            'Permission Required',
            'Please enable motion tracking in settings to track your steps',
            [
              {
                text: 'Open Settings',
                onPress: () => {
                  Linking.openSettings();
                },
              },
              { text: 'Cancel' },
            ]
          );
          return;
        }

        setPermissionStatus('granted');
        console.log('Permissions granted, starting motion tracking...');
        await startMotionTracking();

        // Subscribe to elevation updates
        const isBarometerAvailable = await Barometer.isAvailableAsync();
        if (isBarometerAvailable) {
          subscription = Barometer.addListener(({ altitude }) => {
            setCurrentData((prev) => ({
              ...prev,
              elevation: altitude || 0,
            }));
          });
        }
      } catch (error) {
        console.error('Setup error:', error);
        Alert.alert('Error', 'Failed to set up motion tracking. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

    return () => {
      console.log('Cleaning up...');
      if (subscription) {
        subscription.remove();
      }
      if (motionSubscription.current) {
        motionSubscription.current.remove();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Setting up motion tracking...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.metricsContainer}>
        {permissionStatus !== 'granted' && (
          <Text style={styles.warningText}>Motion tracking requires permissions</Text>
        )}
        {/* Debug Info */}
        <View style={styles.debugSection}>
          <Text style={styles.debugText}>Last Update: {debugInfo.lastUpdate || 'Never'}</Text>
          <Text style={styles.debugText}>Last Step Count: {debugInfo.lastStepCount}</Text>
          <Text style={styles.debugText}>Total Updates: {debugInfo.totalUpdates}</Text>
          <Text style={styles.debugText}>Current Acceleration: {debugInfo.acceleration}</Text>
          <Text style={styles.debugText}>
            Smoothed Acceleration: {debugInfo.smoothedAcceleration}
          </Text>
        </View>
        {/* Main Metrics */}
        <MetricCard value={currentData.steps} label="Steps" icon="directions-walk" />
        <MetricCard
          value={`${currentData.distance?.toFixed(2) ?? '0.00'} km`}
          label="Distance"
          icon="map"
        />
        <MetricCard
          value={`${currentData.calories} kcal`}
          label="Calories"
          icon="local-fire-department"
        />
        <MetricCard value={`${currentData.pace}/km`} label="Avg Pace" icon="speed" />
        <MetricCard
          value={`${(currentData.elevation || 0).toFixed(1)} m`}
          label="Elevation"
          icon="terrain"
        />

        {/* Historical Comparison */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>History</Text>
          <Text>Daily Average: {historicalData.daily}</Text>
          <Text>Weekly Progress: {historicalData.weekly}</Text>
          <Text>Monthly Goal: {historicalData.monthly}</Text>
        </View>
      </View>
    </ScrollView>
  );
};
