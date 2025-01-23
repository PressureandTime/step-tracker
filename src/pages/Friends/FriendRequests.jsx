// FriendRequests.js
import React from 'react';
import { View, Text } from 'react-native';
import styles from './FriendRequestsStyles';

export const FriendRequests = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.emptyText}>No friend requests</Text>
    </View>
  );
};
