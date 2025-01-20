// FriendRequests.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import styles from './FriendRequestsStyles';

export const FriendRequests = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingRequests, setPendingRequests] = useState([]);

  return (
    <View style={styles.container}>
      {/* Search Users Section */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Pending Requests Section */}
      <View style={styles.requestsContainer}>
        {/* <Text style={styles.sectionTitle}>Friend Requests</Text> */}
        <FlatList
          data={pendingRequests}
          renderItem={({ item }) => (
            <View style={styles.requestCard}>
              <Text style={styles.userName}>{item.name}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.acceptButton}>
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.declineButton}>
                  <Text style={styles.buttonText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};
