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
        <View style={[styles.metricRow, { marginBottom: 10 }]}>
          <MetricCard
            value={currentData.steps}
            label="Steps"
            icon="directions-walk"
            isActivities={true}
          />
          <MetricCard
            value={`${currentData.distance?.toFixed(2) ?? '0.00'} km`}
            label="Distance"
            icon="map"
            isActivities={true}
          />
        </View>
        <View style={[styles.metricRow, { marginBottom: 10 }]}>
          <MetricCard
            value={`${currentData.calories} kcal`}
            label="Calories"
            icon="local-fire-department"
            isActivities={true}
          />
          <MetricCard
            value={`${currentData.pace}/km`}
            label="Avg Pace"
            icon="speed"
            isActivities={true}
          />
        </View>
        <View style={[styles.metricRow, { marginBottom: 10 }]}>
          <MetricCard
            value={`${(currentData.elevation || 0).toFixed(1)} m`}
            label="Elevation"
            icon="terrain"
            isActivities={true}
          />
          <View style={{ flex: 1 }} />
        </View>
      </View>
    </>
  );
};

export default ActivityMetrics;
