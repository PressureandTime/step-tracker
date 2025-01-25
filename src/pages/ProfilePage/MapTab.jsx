import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import MapView, { PROVIDER_DEFAULT, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

const MapTab = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const mapRef = useRef(null);

  // Debounce function to limit API calls
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Get location suggestions from Nominatim API
  const getSuggestions = async (text) => {
    if (!text.trim() || text.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        text.trim()
      )}&limit=5&addressdetails=1`;

      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Accept-Language': 'sr,hr,en',
          'User-Agent': 'StepTracker_App/1.0',
        },
      });

      const results = await response.json();

      if (results && results.length > 0) {
        const formattedResults = results.map((item) => ({
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          displayName: item.display_name,
          type: item.type,
          address: item.address,
        }));

        setSuggestions(formattedResults);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error getting suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';

    const parts = [];

    // Add the most specific component first
    if (address.city) parts.push(address.city);
    else if (address.town) parts.push(address.town);
    else if (address.village) parts.push(address.village);
    else if (address.suburb) parts.push(address.suburb);
    else if (address.municipality) parts.push(address.municipality);
    else if (address.mountain) parts.push(address.mountain);
    else if (address.peak) parts.push(address.peak);

    // Add region information
    if (address.state) parts.push(address.state);
    if (address.country) parts.push(address.country);

    return parts.join(', ') || address.display_name;
  };

  // Debounced version of getSuggestions
  const debouncedGetSuggestions = debounce(getSuggestions, 300);

  const handleSearchInputChange = (text) => {
    setSearchQuery(text);
    debouncedGetSuggestions(text);
  };

  const handleSelectLocation = (selectedLocation) => {
    const displayAddress = selectedLocation.address
      ? formatAddress(selectedLocation.address)
      : selectedLocation.displayName;

    setSearchQuery(displayAddress);
    setSearchedLocation(selectedLocation);
    setShowSuggestions(false);

    const newRegion = {
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  };

  const focusOnCurrentLocation = async () => {
    try {
      setIsLoading(true);
      // Get a fresh location update when focusing
      const newLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        maximumAge: 1000, // Only accept locations from the last second
        timeout: 5000,
      });

      setLocation(newLocation);

      if (mapRef.current && newLocation) {
        mapRef.current.animateToRegion(
          {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          1000
        );
      }
    } catch (error) {
      Alert.alert('Location Error', 'Could not get current location: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsLoading(true);
      console.log('Searching for location:', searchQuery);

      // First, request geocoding permissions if not already granted
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for searching locations');
        return;
      }

      const results = await Location.geocodeAsync(searchQuery);
      console.log('Geocoding results:', results);

      if (results && results.length > 0) {
        const { latitude, longitude } = results[0];
        console.log('Found coordinates:', { latitude, longitude });

        setSearchedLocation({ latitude, longitude });

        // Make sure we have valid coordinates before animating
        if (latitude && longitude) {
          const newRegion = {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };

          console.log('Animating to new region:', newRegion);

          // Directly animate to the new region
          if (mapRef.current) {
            mapRef.current.animateToRegion(newRegion, 1000);
          }
        }
      } else {
        console.log('No results found for query:', searchQuery);
        Alert.alert('Location not found', 'Please try a different search term');
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert(
        'Search Error',
        'Could not find the location. Please check your internet connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        // Check if location services are enabled
        const serviceEnabled = await Location.hasServicesEnabledAsync();
        if (!serviceEnabled) {
          setErrorMsg(
            'Location services are disabled. Please enable them in your device settings.'
          );
          setIsLoading(false);
          return;
        }

        // Request permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setIsLoading(false);
          return;
        }

        // Get provider status
        const providerStatus = await Location.getProviderStatusAsync();
        console.log('Location provider status:', providerStatus);

        // Try to get last known position first
        const lastKnownPosition = await Location.getLastKnownPositionAsync({
          maxAge: 10000,
        });

        if (lastKnownPosition) {
          console.log('Using last known position:', lastKnownPosition);
          setLocation(lastKnownPosition);
        }

        // Then get current position
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
          maximumAge: 1000,
          timeout: 5000,
        });

        console.log('Current location:', currentLocation);
        setLocation(currentLocation);
      } catch (error) {
        console.error('Location error:', error);
        setErrorMsg('Error getting location: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Getting your location...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Waiting for location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search location..."
          value={searchQuery}
          onChangeText={handleSearchInputChange}
          onFocus={() => setShowSuggestions(true)}
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => setShowSuggestions(false)}>
          <MaterialIcons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <ScrollView style={styles.suggestionsContainer} keyboardShouldPersistTaps="handled">
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => handleSelectLocation(suggestion)}
            >
              <MaterialIcons name={getIconForLocationType(suggestion)} size={20} color="#666" />
              <View style={styles.suggestionTextContainer}>
                <Text style={styles.suggestionMainText} numberOfLines={1}>
                  {suggestion.osmTags?.peak ||
                    suggestion.osmTags?.mountain ||
                    suggestion.osmTags?.natural ||
                    suggestion.address?.road ||
                    suggestion.address?.city ||
                    suggestion.address?.town ||
                    ''}
                  {suggestion.osmTags?.elevation ? ` (${suggestion.osmTags.elevation}m)` : ''}
                </Text>
                <Text style={styles.suggestionSubText} numberOfLines={1}>
                  {formatAddress(suggestion.address)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        region={{
          latitude: location?.coords.latitude || 0,
          longitude: location?.coords.longitude || 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        mapType="terrain"
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        onMapReady={() => {
          console.log('Map ready, current location:', location);
        }}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You are here"
            description={`Accuracy: ${Math.round(location.coords.accuracy)} meters`}
          />
        )}
        {searchedLocation && (
          <Marker
            coordinate={{
              latitude: searchedLocation.latitude,
              longitude: searchedLocation.longitude,
            }}
            title="Searched Location"
            pinColor="green"
          />
        )}
      </MapView>
      <TouchableOpacity style={styles.locationButton} onPress={focusOnCurrentLocation}>
        <MaterialIcons name="my-location" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

// Helper function to get the appropriate icon
const getIconForLocationType = (suggestion) => {
  const type = suggestion.type?.toLowerCase() || '';
  const name = suggestion.displayName?.toLowerCase() || '';

  if (
    type.includes('peak') ||
    type.includes('mountain') ||
    name.includes('mountain') ||
    name.includes('peak')
  ) {
    return 'terrain';
  }
  if (
    type.includes('trail') ||
    type.includes('path') ||
    name.includes('trail') ||
    name.includes('hiking')
  ) {
    return 'directions-walk';
  }
  if (type.includes('park') || type.includes('natural')) {
    return 'park';
  }
  return 'location-on';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
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
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 60,
    left: 10,
    right: 10,
    maxHeight: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  suggestionMainText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  suggestionSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
    padding: 20,
  },
  text: {
    textAlign: 'center',
    marginTop: 10,
    padding: 20,
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
});

export default MapTab;
