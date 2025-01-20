// ProfilePage.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import styles from './ProfileStyles';

export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Activities');

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
          <View>
            <Text style={styles.sectionTitle}>Gallery</Text>
            {/* Add your Gallery content here */}
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
        <View style={styles.header}>
          <View style={styles.profileImageContainer} />
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.location}>San Francisco, CA</Text>
        </View>

        <View style={styles.tabs}>
          {['Info', 'Activities', 'Gallery', 'Friends'].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabButton}>
              <Text style={[styles.tabItem, activeTab === tab && styles.activeTab]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {renderTabContent()}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>View Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
