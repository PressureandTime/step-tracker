import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import NetInfo from '@react-native-community/netinfo';

export const OfflineMapView = ({
  mapRef,
  initialRegion,
  location,
  selectedLocation,
  onRegionChangeComplete,
}) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Listen for network state changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  return (
    <MapView
      ref={mapRef}
      style={{ flex: 1 }}
      initialRegion={initialRegion}
      onRegionChangeComplete={onRegionChangeComplete}
    >
      {/*
          When offline, add the UrlTile overlay that loads local offline tiles.
          You must generate and bundle the offline tiles in your assets.
          (On Android you may use "android_asset/offline_tiles" and on iOS include them in the bundle)
      */}
      {!isConnected && (
        <UrlTile
          urlTemplate="file:///path/to/your/offline_tiles/{z}/{x}/{y}.png"
          maximumZ={19}
          tileSize={256}
          flipY={false}
        />
      )}

      {location && (
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="Your Location"
          description="You are here"
          pinColor="blue"
        />
      )}

      {selectedLocation && (
        <Marker
          coordinate={{
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
          }}
          title={selectedLocation.title}
          description="Selected Location"
        />
      )}
    </MapView>
  );
};
