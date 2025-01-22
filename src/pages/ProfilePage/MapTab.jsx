import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import MapView, { PROVIDER_DEFAULT, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

const MapTab = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef(null);

  const focusOnCurrentLocation = async () => {
    try {
      setIsLoading(true);
      // Get a fresh location update when focusing
      const newLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        maximumAge: 1000, // Only accept locations from the last second
        timeout: 5000
      });
      
      setLocation(newLocation);
      
      if (mapRef.current && newLocation) {
        mapRef.current.animateToRegion({
          latitude: newLocation.coords.latitude,
          longitude: newLocation.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 1000);
      }
    } catch (error) {
      Alert.alert('Location Error', 'Could not get current location: ' + error.message);
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
          setErrorMsg('Location services are disabled. Please enable them in your device settings.');
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
          maxAge: 10000
        });
        
        if (lastKnownPosition) {
          console.log('Using last known position:', lastKnownPosition);
          setLocation(lastKnownPosition);
        }

        // Then get current position
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
          maximumAge: 1000,
          timeout: 5000
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
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        region={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
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
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="You are here"
          description={`Accuracy: ${Math.round(location.coords.accuracy)} meters`}
        />
      </MapView>
      <TouchableOpacity 
        style={styles.locationButton}
        onPress={focusOnCurrentLocation}
      >
        <MaterialIcons name="my-location" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  }
});

export default MapTab;
