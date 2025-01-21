import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MetricCard from '../../components/metrics/MetricsCard';
import styles from './InfoStyles';

const Info = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.metricsContainer}>
        <MetricCard value="March 2024" label="Member Since" icon="event" />
        <MetricCard value="1,234,567" label="Total Steps" icon="directions-walk" />
        <MetricCard value="2" label="Connected Devices" icon="devices" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        <Text style={styles.text}>support@steptracker.com</Text>
        <Text style={styles.text}>+1 555-1234</Text>
      </View>

      <TouchableOpacity style={styles.privacyButton}>
        <MaterialIcons name="privacy-tip" size={20} color="#666" />
        <Text style={styles.privacyText}>Privacy Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Info;
