import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export const useCurrentLocation = (mapRef) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  return {
    location,
    errorMsg,
    isLoading,
    focusOnCurrentLocation,
  };
};
