import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import { useLocationSuggestions } from './hooks/useLocationSuggestions';
import { useCurrentLocation } from './hooks/useCurrentLocation';

const MapTab = () => {
  const mapRef = useRef(null);
  const [searchText, setSearchText] = useState('');
  const { suggestions, isLoading, getSuggestions } = useLocationSuggestions();
  const {
    location,
    errorMsg,
    isLoading: locationLoading,
    focusOnCurrentLocation,
  } = useCurrentLocation(mapRef);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleLocationSelect = (suggestion) => {
    setSearchText(suggestion.displayName);
    setShowSuggestions(false);

    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: suggestion.latitude,
        longitude: suggestion.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
    setShowSuggestions(true);
    getSuggestions(text);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={
          location
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
            : null
        }
      />

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search location..."
          value={searchText}
          onChangeText={handleSearchChange}
          onFocus={() => setShowSuggestions(true)}
        />
        {isLoading && <ActivityIndicator style={styles.loadingIndicator} />}
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <ScrollView style={styles.suggestionsContainer} keyboardShouldPersistTaps="handled">
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => handleLocationSelect(suggestion)}
            >
              <MaterialIcons name="location-on" size={20} color="#666" />
              <Text style={styles.suggestionText}>{suggestion.displayName}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.locationButton} onPress={focusOnCurrentLocation}>
        <MaterialIcons name="my-location" size={24} color="#000" />
      </TouchableOpacity>

      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingIndicator: {
    position: 'absolute',
    right: 16,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 65,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    marginLeft: 10,
    fontSize: 16,
  },
  locationButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  errorText: {
    position: 'absolute',
    bottom: 70,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
});

export default MapTab;
