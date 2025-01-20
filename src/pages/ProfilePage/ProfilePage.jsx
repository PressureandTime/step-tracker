import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { profileStyles } from './ProfileStyles';

export const ProfilePage = () => {
  return (
    <ScrollView style={profileStyles.container}>
      <View style={profileStyles.header}>
        <LinearGradient
          colors={['#2196F3', '#00E676', '#FF4081']}
          style={profileStyles.profileGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={profileStyles.profileImageContainer}>{/* image */}</View>
        </LinearGradient>

        <Text style={profileStyles.userName}>User Name</Text>
        <Text style={profileStyles.userSteps}>Your Steps</Text>
      </View>

      <View style={profileStyles.statsContainer}>
        <View style={profileStyles.statBox}>
          <Text style={profileStyles.statNumber}>2,38</Text>
          <Text style={profileStyles.statLabel}>Total Steps</Text>
        </View>
        <View style={profileStyles.statBox}>
          <Text style={profileStyles.statNumber}>2,32</Text>
          <Text style={profileStyles.statLabel}>Daily Ave</Text>
        </View>
      </View>

      <View style={profileStyles.iconContainer}>
        <View style={[profileStyles.iconCircle, { borderColor: '#2196F3' }]}>
          {/* <Image source={require('./assets/footstep.png')} style={profileStyles.icon} /> */}
        </View>
        <View style={[profileStyles.iconCircle, { borderColor: '#00E676' }]}>
          {/* <Image source={require('./assets/footstep.png')} style={profileStyles.icon} /> */}
        </View>
        <View style={[profileStyles.iconCircle, { borderColor: '#FF4081' }]}>
          {/* <Image source={require('./assets/question.png')} style={profileStyles.icon} /> */}
        </View>
      </View>

      <View style={profileStyles.graphSection}>
        <Text style={profileStyles.graphTitle}>Daily Average</Text>
        <View style={profileStyles.barChart}>{/* Add your bar chart component here */}</View>
        <Text style={profileStyles.graphSubtitle}>Weekly Rank</Text>
      </View>

      <View style={profileStyles.bottomNav}>
        <TouchableOpacity style={profileStyles.navButton}>
          {/* <Image source={require('./assets/home.png')} style={profileStyles.navIcon} /> */}
        </TouchableOpacity>
        <TouchableOpacity style={profileStyles.navButton}>
          {/* <Image source={require('./assets/stats.png')} style={profileStyles.navIcon} /> */}
        </TouchableOpacity>
        <TouchableOpacity style={profileStyles.navButton}>
          {/* <Image source={require('./assets/profile.png')} style={profileStyles.navIcon} /> */}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
