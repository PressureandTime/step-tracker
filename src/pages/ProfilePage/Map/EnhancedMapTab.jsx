import React from 'react';
import { useNetInfo } from '@react-native-community/netinfo';
import MapTab from './MapTab';
import { OfflineMapView } from './OfflineMaps/OfflineMapView';

export const EnhancedMapTab = (props) => {
  const netInfo = useNetInfo();
  const isOnline = netInfo.isConnected;

  // You can pass the same props to both components.
  // expected props: mapRef, initialRegion, location, selectedLocation, onRegionChangeComplete
  const commonProps = { ...props };

  if (!isOnline) {
    // Render the offline map if there is no connectivity
    return <OfflineMapView {...commonProps} />;
  }

  // Otherwise, show the default online MapTab
  return <MapTab {...commonProps} />;
};
