import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { LineChart } from 'react-native-chart-kit';
import styles from './ActivitiesStyles';

import { MetricCard } from '../../components/metrics/MetricsCard';

export const Activities = () => {
  const [currentData, setCurrentData] = useState({
    steps: 0,
    distance: 0,
    pace: 0,
    calories: 0,
  });
  const [historicalData, setHistoricalData] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let subscription;

    const fetchStepData = async () => {
      try {
        const isAvailable = await Pedometer.isAvailableAsync();

        if (isAvailable) {
          // Get last 24 hours data
          const end = new Date();
          const start = new Date();
          start.setDate(end.getDate() - 1);

          const dailySteps = await Pedometer.getStepCountAsync(start, end);

          // Calculate additional metrics
          const distance = calculateDistance(dailySteps.steps);
          const calories = calculateCalories(dailySteps.steps);
          const pace = calculatePace(dailySteps.steps, distance);

          setCurrentData({
            steps: dailySteps.steps,
            distance,
            pace,
            calories,
          });

          // Subscribe to real-time updates
          subscription = Pedometer.watchStepCount((result) => {
            updateCurrentMetrics(result.steps);
          });
        }
      } catch (error) {
        console.error('Pedometer error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStepData();
    return () => subscription?.remove();
  }, []);

  return (
    <ScrollView>
      <View style={styles.metricsContainer}>
        {/* Main Metrics */}
        <MetricCard value={currentData.steps} label="Steps" icon="directions-walk" />
        <MetricCard value={`${currentData.distance.toFixed(2)} km`} label="Distance" icon="map" />
        <MetricCard
          value={`${currentData.calories} kcal`}
          label="Calories"
          icon="local-fire-department"
        />
        <MetricCard value={`${currentData.pace}/km`} label="Avg Pace" icon="speed" />

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
