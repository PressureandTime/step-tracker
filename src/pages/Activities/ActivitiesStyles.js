// ActivityStyles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  metricsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  historySection: {
    marginTop: 30,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(200, 220, 240, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1565C0',
    textAlign: 'center',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(200, 220, 240, 0.3)',
  },
  historyLabel: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  historyValue: {
    fontSize: 16,
    color: '#1565C0',
    fontWeight: 'bold',
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
  warningText: {
    color: '#ff6b6b',
    textAlign: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 245, 245, 0.7)',
    borderRadius: 8,
    width: '100%',
  },
  debugSection: {
    backgroundColor: 'rgba(248, 249, 250, 0.8)',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
});

export default styles;
