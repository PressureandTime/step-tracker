// ActivityStyles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  metricsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 32,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  historySection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default styles;
