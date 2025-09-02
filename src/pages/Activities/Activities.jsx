import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import styles from './ActivitiesStyles';
import BackgroundSVG from '../../components/BackgroundSVG';
import ActivityMetrics from '../../components/activities/ActivityMetrics';
import { useStepCounter } from '../../context/StepCounterContext';

export const Activities = () => {
  const { steps, distance, isAvailable, errorMessage } = useStepCounter();

  const currentData = {
    steps: steps,
    distance: distance,
    calories: Math.round(steps * 0.04),
    pace: steps > 0 ? '8:00' : '0:00',
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        <BackgroundSVG />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.metricsContainer}>
          {isAvailable === 'false' && (
            <Text style={styles.warningText}>
              {errorMessage || 'Step counter not available. Please check permissions.'}
            </Text>
          )}
          <ActivityMetrics currentData={currentData} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Activities;
