// MetricCard.js
import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './MetricsCardStyles';

export default ({ value, label, icon }) => (
  <View style={styles.metricCard}>
    {icon && (
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={28} color="#1565C0" />
      </View>
    )}
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);
