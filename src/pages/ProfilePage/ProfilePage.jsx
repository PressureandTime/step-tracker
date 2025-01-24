// ProfilePage.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { ImagePickerModal } from '../../components/image-picker/ImagePickerModal';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './ProfileStyles';
import ProfileHeader from './ProfileHeader';
import Gallery from './Gallery';
import { Activities } from '../Activities/Activities';
import { FriendRequests } from '../Friends/FriendRequests';
import MetricCard from '../../components/metrics/MetricsCard';
import Info from '../../pages/Info/Info';
import MapTab from './MapTab';

export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Activities');
  const editButtonText = activeTab === 'Friends' ? 'Add Friend' : 'Edit Profile';
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
        return <Info />;
      case 'Activities':
        return <Activities />;
      case 'Gallery':
        return <Gallery images={galleryImages} onAddImage={() => openImagePicker('gallery')} />;
      case 'Friends':
        return <FriendRequests />;
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

        <View style={styles.contentContainer}>{renderTabContent()}</View>

        {activeTab !== 'Gallery' && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>{editButtonText}</Text>
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
