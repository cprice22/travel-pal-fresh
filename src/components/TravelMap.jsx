// imports the useEffect hook from React
import { useEffect } from 'react';
// imports the APIProvider and Map components from the @vis.gl/react-google-maps library
import { 
    APIProvider, 
    Map,
    AdvancedMarker,
    InfoWindow,
    useMap,
} from '@vis.gl/react-google-maps';

// imports the DestinationSearch component that allows users to search for destinations
import DestinationSearch from './DestinationSearch.jsx';

// imports the NearbyPlaces component that allows users to search for nearby places
import NearbyPlaces from './NearbyPlaces.jsx';

//
import LoadSavedPlaces from './LoadSavedPlaces.jsx';

// synchronizes the selected place with the map view
function MapSelection({ selectedPlace }) {
    
    const map = useMap(); // retrieves the current map instance 

    useEffect(() => {
        //prevents the effect from running if the map or selected place is not available
        if(!map || !selectedPlace) {
            return; // exits if the map or selected place is not available
        }

        // pans the map to the selected place's position and sets the zoom level
        map.panTo(selectedPlace.position);
        map.setZoom(15);
    }, [map, selectedPlace]); // runs the effect whenever the map or selected place changes
    return null; // this component does not render any visible elements
}

// creates a TravelMap component that renders a Google Map
function TravelMap({ 
    places, 
    selectedPlace, 
    onSelectPlace,
    onCloseDetails,
    onDestinationFound,
    destination,
    onPlacesFound,
    missingSavedIds,
    onSavedPlacesLoaded,
 }) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // retrieves the Google Maps API key from environment variables

    // checks if the API key is missing and displays a message if it is
    if (!apiKey) {
        return <p>Google Maps API key is missing.</p>;
    }

    // renders the APIProvider and Map components, passing the API key and map configuration
     return (
    <APIProvider apiKey={apiKey}>
        <div className = "travel-controls">
        {/* calls the DestinationSearch component */}
        <DestinationSearch onDestinationFound = {onDestinationFound} />

        {/* calls the NearbyPlaces component */}
        <NearbyPlaces
            key = {`${destination?.position.lat},${destination?.position.lng}`}
            destination = {destination}
            onPlacesFound = {onPlacesFound}
        />

        <LoadSavedPlaces
            missingIds = {missingSavedIds}
            onSavedPlacesLoaded = {onSavedPlacesLoaded}
        />
        </div>
      <div className = "map-frame">
      <Map
        style={{ width: '100%', height: '400px' }}
        defaultCenter={{ lat: 33.749, lng: -84.388 }}
        defaultZoom={12}
        gestureHandling="cooperative"
        mapId="DEMO_MAP_ID"
      >
        {/* maps over the places array and renders an AdvancedMarker for each place */}
        {places.map((place) => (
          <AdvancedMarker
            key={place.id}
            position={place.position}
            title={place.name}
            onClick={() => onSelectPlace(place.id)}
          />
        ))}

        {/* renders an InfoWindow for the selected place */}
        {selectedPlace && (
            <InfoWindow
                position = {selectedPlace.position}
                onClose = {onCloseDetails}
            >
            <div>
                <h3>{selectedPlace.name}</h3>
                <h3>{selectedPlace.category}</h3>
                <h3>Rating: {selectedPlace.rating} / 5</h3>
                <p>{selectedPlace.address}</p>    
            </div>    
            </InfoWindow>
        )}
      </Map>
      </div>

        {/* MapSelection component synchronizes the selected place with the map view */}
        <MapSelection selectedPlace = {selectedPlace} />
    </APIProvider>
  );
}

export default TravelMap;