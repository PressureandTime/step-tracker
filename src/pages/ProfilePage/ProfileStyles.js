import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabButton: {
    paddingHorizontal: 20,
  },
  tabItem: {
    fontSize: 16,
    color: '#666',
  },
  activeTab: {
    color: '#007AFF',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 0,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    paddingHorizontal: 10,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
    padding: 6,
    borderRadius: 8,
    alignItems: 'center',
    maxWidth: 120,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  galleryImage: {
    width: 120,
    height: 120,
    margin: 4,
    borderRadius: 8,
  },
});
