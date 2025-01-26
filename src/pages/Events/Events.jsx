import React from 'react';
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { useHikes } from '../../hooks/useHikes';
import EventCard from '../../components/events/EventCard';
import { styles } from './EventsStyles';

const Events = () => {
  const { data: hikes, isLoading, isError, error } = useHikes();

  console.log('hikes', hikes);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          {error?.response?.data?.detail || 'Failed to load hikes'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.eventsList}>
        {hikes?.map((hike, index) => {
          console.log('hola', hike?.height?.replace(' m', ''));
          return (
            <EventCard
              key={index}
              event={{
                id: index,
                title: hike.title,
                guide: hike.guide,
                club: {
                  name: hike.hiking_club_name,
                  logoUrl: 'https://placekitten.com/50/50', // Placeholder for now
                },
                distance: hike.length?.replace(' km', '') || 'N/A',
                elevation: hike?.height?.replace(' m', '') || 'N/A',
                price: hike.price?.replace(' dinara', '') || 'N/A',
                date: `${hike.start_day} ${hike.exact_date}`,
                imageUrl: hike.picture_url || 'https://picsum.photos/800/400',
                difficulty: hike.diff,
                duration: hike.time_length?.replace(' h', '') || 'N/A',
                detailLink: hike.link_to_detail_page,
              }}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

export default Events;
