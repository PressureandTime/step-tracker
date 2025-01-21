import { StyleSheet, Platform } from 'react-native';

const shadowStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  android: {
    elevation: 3,
  },
});

export default StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9F9F9',
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    ...shadowStyle,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#666',
    marginVertical: 4,
  },
  privacyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    ...shadowStyle,
  },
  privacyText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
});
