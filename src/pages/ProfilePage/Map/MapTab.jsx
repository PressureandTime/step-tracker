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

  const handleImmediateSearch = async () => {
    if (!searchText.trim()) return;

    setShowSuggestions(false);

    // Move map immediately based on search text
    const approxCoords = await getApproximateCoordinates(searchText);
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...approxCoords,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        },
        500
      );
    }

    // Then get precise location
    try {
      const searchUrl = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
        searchText.trim()
      )}&limit=1&namedetails=0&addressdetails=0`;

      const response = await fetch(searchUrl, {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'StepTracker_App/1.0',
        },
      });

      const results = await response.json();

      if (results?.[0]) {
        const result = {
          latitude: parseFloat(results[0].lat),
          longitude: parseFloat(results[0].lon),
        };

        // Adjust map to precise location
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              ...result,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            },
            500
          );
        }

        // Update search text
        setSearchText(results[0].display_name || searchText);
      }
    } catch (error) {
      console.error('Error getting precise location:', error);
    }
  };

  // Get approximate coordinates quickly based on search text
  const getApproximateCoordinates = async (text) => {
    try {
      // Try to parse coordinates if entered directly
      const coordMatch = text.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
      if (coordMatch) {
        return {
          latitude: parseFloat(coordMatch[1]),
          longitude: parseFloat(coordMatch[2]),
        };
      }

      // Quick coordinate estimation for common cities/countries
      const commonPlaces = {
        'new york': { latitude: 40.7128, longitude: -74.006 },
        london: { latitude: 51.5074, longitude: -0.1278 },
        paris: { latitude: 48.8566, longitude: 2.3522 },
        tokyo: { latitude: 35.6762, longitude: 139.6503 },
        sydney: { latitude: -33.8688, longitude: 151.2093 },
        berlin: { latitude: 52.52, longitude: 13.405 },
        rome: { latitude: 41.9028, longitude: 12.4964 },
        madrid: { latitude: 40.4168, longitude: -3.7038 },
        dubai: { latitude: 25.2048, longitude: 55.2708 },
        singapore: { latitude: 1.3521, longitude: 103.8198 },
      };

      const searchLower = text.toLowerCase();
      for (const [place, coords] of Object.entries(commonPlaces)) {
        if (searchLower.includes(place)) {
          return coords;
        }
      }

      // Default to a neutral position with wider zoom
      return {
        latitude: 0,
        longitude: 0,
      };
    } catch (error) {
      console.error('Error in approximate coordinates:', error);
      return { latitude: 0, longitude: 0 };
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
          onSubmitEditing={handleImmediateSearch}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleImmediateSearch}
          disabled={isLoading}
        >
          <MaterialIcons name="search" size={24} color="#000" />
        </TouchableOpacity>
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
    paddingRight: 45,
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
  searchButton: {
    position: 'absolute',
    right: 8,
    padding: 8,
    zIndex: 2,
  },
  loadingIndicator: {
    position: 'absolute',
    right: 45,
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
