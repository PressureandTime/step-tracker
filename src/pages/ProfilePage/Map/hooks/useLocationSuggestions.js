import { useState } from 'react';
import { debounce } from 'lodash';

export const useLocationSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getSuggestions = async (text) => {
    if (!text?.trim() || text.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
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

      const formattedResults = results.map((item) => ({
        displayName: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        type: item.type,
        address: item.address,
      }));

      setSuggestions(formattedResults);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reduce debounce time for better responsiveness
  const debouncedGetSuggestions = debounce(getSuggestions, 150);

  return {
    suggestions,
    isLoading,
    getSuggestions: debouncedGetSuggestions,
  };
};
