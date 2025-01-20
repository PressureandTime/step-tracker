import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './ProfileHeaderStyles';

const ProfileHeader = ({ user, onEditProfile }) => {
  return (
    <View style={styles.header}>
      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={onEditProfile} style={styles.profileImageWrapper}>
          <Image source={{ uri: user?.profileImage }} style={styles.profileImage} />
          <View style={styles.editIconContainer}>
            <MaterialIcons name="edit" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.userName}>{user?.name}</Text>
      <Text style={styles.location}>{user?.location}</Text>
    </View>
  );
};

export default ProfileHeader;
