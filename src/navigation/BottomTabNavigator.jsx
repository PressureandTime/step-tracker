import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Import your screens here
import { ProfilePage } from '../pages/ProfilePage/ProfilePage';
import MapTab from '../pages/ProfilePage/MapTab';
import EventCard from '../components/events/EventCard';

// Placeholder components (replace these with your actual screens)
const NotificationsScreen = () => (
  <View style={styles.screenContainer}>
    <Text>Notifications Screen</Text>
  </View>
);

// Placeholder event data
const PLACEHOLDER_EVENTS = [
  {
    id: 1,
    title: 'KOZOMOR CIRCULAR STAZAMA',
    guide: 'Branislav Makljenović',
    club: {
      name: 'Klub Džepovi Prirode',
      logoUrl: 'https://placekitten.com/50/50', // Placeholder logo
    },
    distance: 11,
    elevation: 600,
    price: '2.700',
    date: 'Sub 25.1',
    imageUrl: 'https://picsum.photos/800/400', // Placeholder image
  },
  {
    id: 2,
    title: 'MALJEN DIVČIBARE',
    guide: 'Mirjana Prokić',
    club: {
      name: 'PD Železničar 1948',
      logoUrl: 'https://placekitten.com/50/50', // Placeholder logo
    },
    distance: 13,
    elevation: 250,
    price: '2.600',
    date: 'Sub 25.1',
    imageUrl: 'https://picsum.photos/800/400', // Placeholder image
  },
];

const EventsScreen = () => (
  <ScrollView style={styles.eventsContainer}>
    <View style={styles.eventsList}>
      {PLACEHOLDER_EVENTS.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </View>
  </ScrollView>
);

const SettingsScreen = () => (
  <View style={styles.screenContainer}>
    <Text>Settings Screen</Text>
  </View>
);

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const notificationCount = 3;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e5e5e5',
        },
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTitleStyle: {
          color: 'white',
          fontSize: 24,
          fontWeight: '600',
        },
        headerTitle: 'HikeFinder',
      }}
    >
      <Tab.Screen
        name="Events"
        component={EventsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="explore" size={24} color={color} />,
          tabBarLabel: ({ color }) => <Text style={[styles.tabText, { color }]}>Events</Text>,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View>
              <MaterialIcons name="notifications" size={24} color={color} />
              {notificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{notificationCount}</Text>
                </View>
              )}
            </View>
          ),
          tabBarLabel: ({ color }) => (
            <Text style={[styles.tabText, { color }]}>Notifications</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={24} color={color} />,
          tabBarLabel: ({ color }) => <Text style={[styles.tabText, { color }]}>Profile</Text>,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={24} color={color} />
          ),
          tabBarLabel: ({ color }) => <Text style={[styles.tabText, { color }]}>Settings</Text>,
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
  eventsContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  eventsList: {
    padding: 16,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default BottomTabNavigator;
