import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const EventCard = ({ event }) => {
  const handleDetailPress = async () => {
    if (event.detailLink) {
      try {
        await Linking.openURL(event.detailLink);
      } catch (error) {
        console.error('Error opening URL:', error);
      }
    }
  };

  function getDifficultyColor(diff) {
    switch (diff) {
      case 1:
        return '#4CAF50'; // Easy - Green
      case 2:
        return '#FFC107'; // Medium - Yellow
      case 3:
        return '#FF5722'; // Hard - Orange

      case 4:
        return '#03A9F4'; // Very Hard - Blue

      case 5:
        return '#9C27B0'; // Extreme - Purple

      case 6:
        return '#FF9800'; // Very Extreme - Orange

      case 7:
        return '#795548'; // Extreme - Brown

      case 8:
        return '#9E9E9E'; // Extreme - Gray

      case 9:
        return '#00E676'; // Very Easy - Green

      case 10:
        return '#00E676'; // Very Easy - Green

      default:
        return '#757575'; // Unknown - Gray
    }
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handleDetailPress}>
      <View style={styles.imageContainer}>
        {event.imageUrl ? (
          <Image
            source={{ uri: event.imageUrl }}
            style={styles.image}
            onError={(e) => {
              console.error('Error loading image, falling back to icon', e);
            }}
          />
        ) : (
          <MaterialIcons name="landscape" size={80} color="#666" />
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>

        <View style={styles.guideRow}>
          <MaterialIcons name="person" size={16} color="#666" />
          <Text style={styles.guideText}>{event.guide}</Text>
        </View>

        <TouchableOpacity style={styles.clubButton}>
          <MaterialIcons name="group" size={20} color="#007AFF" />
          <Text style={styles.clubName}>{event.club.name}</Text>
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <MaterialIcons name="straighten" size={16} color="#666" />
            <Text style={styles.statText}>{event.distance} km</Text>
          </View>
          <View style={styles.stat}>
            <MaterialIcons name="terrain" size={16} color="#666" />
            <Text style={styles.statText}>{event?.elevation}</Text>
          </View>
          <View style={styles.stat}>
            <MaterialIcons name="timer" size={16} color="#666" />
            <Text style={styles.statText}>{event.duration}h</Text>
          </View>
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: getDifficultyColor(event.difficulty) },
            ]}
          >
            <Text style={styles.difficultyText}>Level {event.difficulty}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.price}>{event.price} din</Text>
          <Text style={styles.date}>{event.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  guideText: {
    marginLeft: 6,
    color: '#666',
    fontSize: 14,
  },
  clubButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  clubName: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
});

export default EventCard;
