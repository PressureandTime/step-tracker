import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import styles from './ActivitiesStyles';

// Components
import BackgroundSVG from '../../components/BackgroundSVG';
import DebugInfo from '../../components/activities/DebugInfo';
import ActivityMetrics from '../../components/activities/ActivityMetrics';
import HistorySection from '../../components/activities/HistorySection';

// Hooks
import { useMotionTracking } from '../../hooks/useMotionTracking';

export const Activities = () => {
  const [showDebug, setShowDebug] = useState(false);
  const [historicalData, setHistoricalData] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
  });

  // Use our custom hook for motion tracking
  const { currentData, isLoading, permissionStatus, debugInfo, setDebugInfo } = useMotionTracking();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Setting up motion tracking...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        <BackgroundSVG />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.metricsContainer}>
          {permissionStatus !== 'granted' && (
            <Text style={styles.warningText}>Motion tracking requires permissions</Text>
          )}

          {/* Debug Information Component */}
          <DebugInfo showDebug={showDebug} setShowDebug={setShowDebug} debugInfo={debugInfo} />

          {/* Activity Metrics Component */}
          <ActivityMetrics currentData={currentData} />

          {/* Historical Data Component */}
          <HistorySection historicalData={historicalData} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Activities;
