// MetricCard.js
import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './MetricsCardStyles';

export const MetricCard = ({ value, label, icon }) => (
  <View style={styles.metricCard}>
    {icon && <MaterialIcons name={icon} size={24} color="#4CAF50" style={{ marginBottom: 8 }} />}
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);
