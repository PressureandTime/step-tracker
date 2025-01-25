export const formatAddress = (address) => {
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

export // Helper function to get the appropriate icon
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
