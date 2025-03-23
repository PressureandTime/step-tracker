// MetricCard.js
import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './MetricsCardStyles';

const MetricCard = ({ value, label, icon, isActivities }) => {
  const cardStyle = isActivities ? styles.metricCardActivities : styles.metricCard;
  const iconColor = '#1565C0';
  const valueStyle = isActivities ? styles.metricValueActivities : styles.metricValue;
  const labelStyle = styles.metricLabel;

  return (
    <View style={cardStyle}>
      {icon && (
        <View style={styles.iconContainer}>
          <MaterialIcons name={icon} size={24} color={iconColor} />
        </View>
      )}
      <Text style={valueStyle}>{value}</Text>
      <Text style={labelStyle}>{label}</Text>
    </View>
  );
};

export default MetricCard;
