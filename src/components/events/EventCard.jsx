import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const EventCard = ({ event }) => {
  const { title, guide, club, distance, elevation, price, date, imageUrl } = event;

  return (
    <View style={styles.card}>
      {date && (
        <View style={styles.dateTag}>
          <Text style={styles.dateText}>{date}</Text>
        </View>
      )}
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.guideRow}>
          <Text style={styles.guideLabel}>Vodič: </Text>
          <Text style={styles.guideText}>{guide}</Text>
        </View>
        <View style={styles.clubRow}>
          <Image source={{ uri: club.logoUrl }} style={styles.clubLogo} />
          <Text style={styles.clubName}>{club.name}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.details}>Dužina: {distance} km</Text>
          <Text style={styles.details}>Uspon: {elevation} m</Text>
        </View>
        <Text style={styles.price}>{price} din</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="bookmark-border" size={20} color="#007AFF" />
            <Text style={styles.actionText}>Sačuvaj</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="edit" size={20} color="#007AFF" />
            <Text style={styles.actionText}>Dopuni</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="delete-outline" size={20} color="#007AFF" />
            <Text style={styles.actionText}>Obriši</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateTag: {
    position: 'absolute',
    left: 12,
    top: 12,
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 8,
    zIndex: 1,
  },
  dateText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  guideRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  guideLabel: {
    color: '#666',
  },
  guideText: {
    fontWeight: '500',
  },
  clubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  clubLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  clubName: {
    color: '#007AFF',
    fontWeight: '500',
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  details: {
    color: '#666',
    marginRight: 16,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#007AFF',
    marginLeft: 4,
    fontSize: 12,
  },
});

export default EventCard;
