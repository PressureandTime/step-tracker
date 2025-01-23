import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  galleryContainer: {
    flex: 1,
  },
  galleryContent: {
    paddingVertical: 10,
  },
  galleryRow: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  galleryImage: {
    width: '32%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  addImageButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
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
