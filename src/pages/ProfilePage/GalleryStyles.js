import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  galleryContainer: {
    flex: 1,
  },
  galleryContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingVertical: 10,
  },
  galleryImage: {
    width: 110,
    height: 110,
    margin: 5,
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
