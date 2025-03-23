import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../pages/Activities/ActivitiesStyles';

const HistorySection = ({ historicalData }) => {
  return (
    <View style={styles.historySection}>
      <Text style={styles.sectionTitle}>History</Text>
      <View style={styles.historyItem}>
        <Text style={styles.historyLabel}>Daily Average:</Text>
        <Text style={styles.historyValue}>{historicalData.daily}</Text>
      </View>
      <View style={styles.historyItem}>
        <Text style={styles.historyLabel}>Weekly Progress:</Text>
        <Text style={styles.historyValue}>{historicalData.weekly}</Text>
      </View>
      <View style={styles.historyItem}>
        <Text style={styles.historyLabel}>Monthly Goal:</Text>
        <Text style={styles.historyValue}>{historicalData.monthly}</Text>
      </View>
    </View>
  );
};

export default HistorySection;
