import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import your screens here
import { ProfilePage } from '../pages/ProfilePage/ProfilePage';
import MapTab from '../pages/ProfilePage/Map/MapTab';
import Events from '../pages/Events/Events';
import Settings from '../pages/Settings/Settings';
import NotificationsScreen from '../pages/Notifications/Notifications';

const Tab = createBottomTabNavigator();

const CustomHeader = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerWrapper, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.headerTitle}>HikeFinder</Text>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <MaterialIcons name="person" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBar,
        {
          height: 49 + insets.bottom,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        if (route.name === 'Profile') return null;
        
        // Hide Events, Map, and Notifications tabs - only show Settings
        if (route.name !== 'Settings') return null;

        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabItem}>
            <MaterialIcons
              name="settings"
              size={24}
              color={isFocused ? '#007AFF' : '#666'}
            />
            <Text style={[styles.tabLabel, { color: isFocused ? '#007AFF' : '#666' }]}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        header: ({ navigation }) => <CustomHeader navigation={navigation} />,
        tabBarHideOnKeyboard: false,
      }}
      sceneContainerStyle={{
        backgroundColor: '#f5f5f5',
      }}
    >
      <Tab.Screen name="Events" component={Events} />
      <Tab.Screen name="Map" component={MapTab} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Settings" component={Settings} />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  headerWrapper: {
    backgroundColor: '#1a1a1a',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    paddingHorizontal: 16,
  },
  headerLeft: {
    width: 40,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  profileButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
  },
});

export default BottomTabNavigator;
