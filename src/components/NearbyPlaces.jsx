import { useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

// Options for different place types
const searchOptions = {
    Restaurant: {
      googleType: 'restaurant',
      label: 'restaurants',
    },
    Hotel: {
      googleType: 'hotel',
      label: 'hotels',
    },
    Attraction: {
      googleType: 'tourist_attraction',
      label: 'attractions',
    },
};

function NearbyPlaces({ destination, onPlacesFound }) {
  // Load the Google Maps Places library using the custom hook
  const placesLibrary = useMapsLibrary('places');
  // State to manage loading status and messages
  const [isLoading, setIsLoading] = useState(false);
  // State to hold messages for the user
  const [message, setMessage] = useState('');
  // variable to hold the selected category for searching nearby places
  const [searchCategory, setSearchCategory] = useState('Restaurant');

  async function searchNearby() {
    if (!destination || !placesLibrary || isLoading) {
      return;
    }

    // variable to hold the selected search option based on the searchCategory state
    const option = searchOptions[searchCategory];

    setIsLoading(true);
    setMessage('');

    try {
      const response = await placesLibrary.Place.searchNearby({
        fields: [
          'id',
          'displayName',
          'formattedAddress',
          'location',
          'rating',
        ],
        locationRestriction: {
          center: destination.position,
          radius: 5000,
        },
        includedPrimaryTypes: [option.googleType],
        maxResultCount: 20,
      });

      const nearbyPlaces = response.places
        .filter((place) => place.location)
        .map((place) => ({
          id: place.id,
          name: place.displayName,
          category: searchCategory,
          rating: place.rating ?? null,
          address: place.formattedAddress ?? 'Address unavailable',
          position: {
            lat: place.location.lat(),
            lng: place.location.lng(),
          },
        }));

      onPlacesFound(nearbyPlaces, destination);
      setMessage(
        `Loaded ${nearbyPlaces.length} ${option.label} near ${destination.name}.`
      );
    } catch (error) {
      console.error('Nearby search failed:', error);
      setMessage('Could not load places. Check the Console.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      {/* label for the category selection dropdown */}
      <label htmlFor = "nearby-category">Find Nearby: </label>

      {/* Dropdown to select the category of nearby places */}
      <select
            id = "nearby-category"
            value = {searchCategory}
            onChange = {(event) => setSearchCategory(event.target.value)}
            disabled = {isLoading}
      >
        <option value = "Restaurant">Restaurants</option>
        <option value = "Hotel">Hotels</option>
        <option value = "Attraction">Attractions</option>
      </select>

      {/* Button to trigger the search for nearby places */}
      <button
             type = "button"
             onClick = {searchNearby}
             disabled = {!destination || !placesLibrary || isLoading}
      >
        {isLoading ? 'Loading...' : 'Find Nearby Places'}
      </button>

      {/* Display message to the user */}
      {!destination && <p>Search For A Destination First.</p>}
      <p role = "status">{message}</p>
    </div>
  );
}

export default NearbyPlaces;