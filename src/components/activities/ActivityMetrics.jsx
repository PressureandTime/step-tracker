import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../pages/Activities/ActivitiesStyles';
import MetricCard from '../metrics/MetricsCard';

const ActivityMetrics = ({ currentData }) => {
  return (
    <>
      <Text style={styles.sectionHeader}>Today's Activity</Text>

      {/* Main Metrics */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricRow}>
          <MetricCard value={currentData.steps} label="Steps" icon="directions-walk" />
          <MetricCard
            value={`${currentData.distance?.toFixed(2) ?? '0.00'} km`}
            label="Distance"
            icon="map"
          />
        </View>
        <View style={styles.metricRow}>
          <MetricCard
            value={`${currentData.calories} kcal`}
            label="Calories"
            icon="local-fire-department"
          />
          <MetricCard value={`${currentData.pace}/km`} label="Avg Pace" icon="speed" />
        </View>
        <MetricCard
          value={`${(currentData.elevation || 0).toFixed(1)} m`}
          label="Elevation"
          icon="terrain"
        />
      </View>
    </>
  );
};

export default ActivityMetrics;
