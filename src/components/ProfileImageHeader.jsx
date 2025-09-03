import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ImagePickerModal } from './image-picker/ImagePickerModal';
import { useProfile } from '../context/ProfileContext';

const ProfileImageHeader = () => {
  const { profileImage, setProfileImage } = useProfile();
  const [modalVisible, setModalVisible] = useState(false);

  const handleImageSelect = (uri) => {
    setProfileImage(uri);
  };

  const openImagePicker = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <TouchableOpacity style={styles.imageContainer} onPress={openImagePicker}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialIcons name="person" size={40} color="#1565C0" />
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userLocation}>San Francisco, CA</Text>
        </View>
      </View>

      <ImagePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImageSelect={handleImageSelect}
        title="Upload Profile Photo"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 16,
    marginHorizontal: 12,
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 2,
    borderColor: '#1565C0',
    marginRight: 12,
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 2,
  },
  userLocation: {
    fontSize: 14,
    color: '#666',
  },
});

export default ProfileImageHeader;
