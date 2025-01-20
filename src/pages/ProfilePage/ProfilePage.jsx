// ProfilePage.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, FlatList } from 'react-native';
import { ImagePickerModal } from '../../components/image-picker/ImagePickerModal';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './ProfileStyles';
import ProfileHeader from './ProfileHeader';

export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Activities');
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [galleryImages, setGalleryImages] = useState([]);
  const [modalType, setModalType] = useState('profile'); // 'profile' or 'gallery'

  const handleImageSelect = (uri) => {
    if (modalType === 'profile') {
      setProfileImage(uri);
    } else {
      setGalleryImages([...galleryImages, { id: Date.now().toString(), uri }]);
    }
  };

  const openImagePicker = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const renderGalleryItem = ({ item }) => (
    <Image source={{ uri: item.uri }} style={styles.galleryImage} />
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Info':
        return (
          <View>
            <Text style={styles.sectionTitle}>Info</Text>
            {/* Add your Info content here */}
          </View>
        );
      case 'Activities':
        return (
          <View>
            <Text style={styles.sectionTitle}>Activities</Text>
            <View style={styles.activities}>
              <View style={styles.activityCard}>
                <Text style={styles.activityValue}>12000</Text>
                <Text style={styles.activityLabel}>Steps</Text>
              </View>
              <View style={styles.activityCard}>
                <Text style={styles.activityValue}>300m</Text>
                <Text style={styles.activityLabel}>Elevation</Text>
              </View>
              <View style={styles.activityCard}>
                <Text style={styles.activityValue}>10.5km</Text>
                <Text style={styles.activityLabel}>Distance</Text>
              </View>
            </View>
          </View>
        );
      case 'Gallery':
        return (
          <View style={styles.galleryContainer}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={() => openImagePicker('gallery')}
            >
              <MaterialIcons name="add-photo-alternate" size={24} color="white" />
              <Text style={styles.addImageButtonText}>Add Image</Text>
            </TouchableOpacity>
            <FlatList
              data={galleryImages}
              renderItem={renderGalleryItem}
              keyExtractor={(item) => item.id}
              numColumns={3}
              columnWrapperStyle={styles.galleryRow}
              contentContainerStyle={styles.galleryContent}
            />
          </View>
        );
      case 'Friends':
        return (
          <View>
            <Text style={styles.sectionTitle}>Friends</Text>
            {/* Add your Friends content here */}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ProfileHeader
          user={{
            profileImage,
            name: 'John Doe',
            location: 'San Francisco, CA',
          }}
          onEditProfile={() => openImagePicker('profile')}
        />

        <View style={styles.tabs}>
          {['Info', 'Activities', 'Gallery', 'Friends'].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabButton}>
              <Text style={[styles.tabItem, activeTab === tab && styles.activeTab]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {renderTabContent()}

        {activeTab !== 'Gallery' && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        )}

        <ImagePickerModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onImageSelect={handleImageSelect}
          title={modalType === 'profile' ? 'Upload Profile Photo' : 'Add to Gallery'}
        />
      </View>
    </SafeAreaView>
  );
};
