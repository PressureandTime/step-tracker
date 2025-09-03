import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MetricCard from '../../components/metrics/MetricsCard';
import BackgroundSVG from '../../components/BackgroundSVG';
import ProfileImageHeader from '../../components/ProfileImageHeader';
import styles from './InfoStyles';

const Info = () => {
  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        <BackgroundSVG />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ProfileImageHeader />
        <View style={styles.metricsContainer}>
          <Text style={styles.sectionHeader}>User Information</Text>
          <View style={styles.metricRow}>
            <MetricCard value="March 2024" label="Member Since" icon="event" />
            <MetricCard value="1,234,567" label="Total Steps" icon="directions-walk" />
          </View>
          <View style={styles.metricRow}>
            <MetricCard value="2" label="Connected Devices" icon="devices" />
            <MetricCard value="Premium" label="Account Type" icon="star" />
          </View>

          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.historyItem}>
              <Text style={styles.historyLabel}>Email</Text>
              <Text style={styles.historyValue}>support@steptracker.com</Text>
            </View>
            <View style={styles.historyItem}>
              <Text style={styles.historyLabel}>Phone</Text>
              <Text style={styles.historyValue}>+1 555-1234</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.privacyButton}>
            <MaterialIcons name="privacy-tip" size={20} color="#1565C0" />
            <Text style={styles.privacyText}>Privacy Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Info;
