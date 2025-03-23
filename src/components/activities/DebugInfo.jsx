import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../pages/Activities/ActivitiesStyles';

const DebugInfo = ({ showDebug, setShowDebug, debugInfo }) => {
  return (
    <>
      {/* Debug Toggle Button */}
      <View style={styles.debugToggleContainer}>
        <TouchableOpacity style={styles.debugToggleButton} onPress={() => setShowDebug(!showDebug)}>
          <Text style={styles.debugToggleText}>
            {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Debug Info */}
      {showDebug && (
        <View style={styles.debugSection}>
          <Text style={styles.debugText}>Last Update: {debugInfo.lastUpdate || 'Never'}</Text>
          <Text style={styles.debugText}>Last Step Count: {debugInfo.lastStepCount}</Text>
          <Text style={styles.debugText}>Total Updates: {debugInfo.totalUpdates}</Text>
          <Text style={styles.debugText}>Current Acceleration: {debugInfo.acceleration}</Text>
          <Text style={styles.debugText}>
            Smoothed Acceleration: {debugInfo.smoothedAcceleration}
          </Text>
        </View>
      )}
    </>
  );
};

export default DebugInfo;
