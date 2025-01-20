// ProfileStyles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Changed from space-around
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    marginBottom: 20,
    paddingHorizontal: 10, // Added to give some edge padding
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 12, // Reduced from 16
  },
  tabItem: {
    fontSize: 14, // Reduced from 16
    color: '#0066FF',
  },
  activeTab: {
    color: '#000',
    fontWeight: '500',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#000',
  },
  activities: {
    flexDirection: 'column',
    gap: 16,
  },
  activityCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  activityValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  activityLabel: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingBottom: 20,
    gap: 12,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  secondaryButtonText: {
    color: '#4CAF50',
  },
  // Add to your existing styles in ProfileStyles.js
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  profileImageWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#4CAF50',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },

  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
});

export default styles;
