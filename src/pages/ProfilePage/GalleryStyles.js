import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  galleryContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 22,
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 7,
    marginHorizontal: 12,
  },
  galleryContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    borderRadius: 22,
  },
  galleryImage: {
    width: 110,
    height: 110,
    margin: 5,
    borderRadius: 8,
  },
  addImageButton: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    width: '50%',
    alignSelf: 'center',
  },
  addImageButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default styles;
