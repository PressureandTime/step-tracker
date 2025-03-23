import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  metricCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
    minHeight: 120,
    borderWidth: 1,
    borderColor: 'rgba(200, 220, 240, 0.5)',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(200, 230, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    textAlign: 'center',
  },
});
