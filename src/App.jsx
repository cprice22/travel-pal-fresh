//allows us to use state and side effects in functional components
import { useState, useEffect, useRef } from 'react';

// imports the PlaceList component that displays a list of places
import PlaceList from './components/PlaceList.jsx';

// imports the TravelMap component that displays a Google Map
import TravelMap from './components/TravelMap.jsx';

// imports the samplePlaces data that contains information about various places
import samplePlaces from './data/places.js';

//
import PlaceFilters from './components/PlaceFilters.jsx';

import './App.css'

function App() {
  //category holds the current selection
  //setCategory updates the current selection
  //useState initializes the category state with 'All'
  const [category, setCategory] = useState('All');

  //minRating holds the minimum rating for filtering places
  // setMinRating updates the minimum rating
  // useState initializes the minRating state with 0
  const [minRating, setMinRating] = useState(0);

  // savedIds holds the IDs of places that have been saved
  // setSaveIds updates the saved IDs
  // useState initializes the savedIds state with an empty array
  const [savedIds, setSavedIds] = useState(() => {
     try {
      // Retrieve the stored saved IDs from localStorage
      const storedIds = localStorage.getItem('travelpal-saved-ids');

      // If no stored IDs are found, return an empty array
      if(storedIds === null) {
        return [];
      }

      // Parse the stored IDs as JSON
      const parsedIds = JSON.parse(storedIds);

      // Ensure the parsed IDs are an array before returning
      return Array.isArray(parsedIds) ? parsedIds : [];
     } catch {
      return [];
     }
  });

  // showSavedOnly holds whether only saved places should be displayed
  // setShowSavedOnly updates the showSavedOnly state
  // useState initializes the showSavedOnly state with false
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // useEffect saves the current savedIds to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      'travelpal-saved-ids',
      JSON.stringify(savedIds)
    );
  }, [savedIds]);

  // searchText holds the current search text for filtering places
  // setSearchText updates the search text
  // useState initializes the searchText state with an empty string
  const [searchText, setSearchText] = useState('');

  // selectedPlaceId holds the ID of the currently selected place
  // setSelectedPlaceId updates the selected place ID
  // useState initializes the selectedPlaceId state with null
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);

   // variable to hold the list of places, initialized with samplePlaces
  const [places, setPlaces] = useState(samplePlaces);

  // variable to hold the destination input by the user
  const [knownPlaces, setKnownPlaces] = useState(samplePlaces);

  //
  const missingSavedIds = savedIds.filter((id) => typeof id === 'string' && !knownPlaces.some((place) => place.id === id));

  // selectedPlace holds the object of the currently selected place
  // // It is found by matching the selectedPlaceId with the id of each place in samplePlaces
  const selectedPlace = knownPlaces.find(
    (place) => place.id === selectedPlaceId
  );

  // variable to hold the destination input by the user
  const placesToDisplay = showSavedOnly ? knownPlaces : places;

   //.filter() creates a new array containing only objects that pass the condition.
  const filteredPlaces = placesToDisplay.filter((place) => {
     // Check if the place matches the selected category and minimum rating
      const matchesCategory = category === 'All' || place.category === category;
     // Check if the place matches the minimum rating
      const matchesRating = minRating === 0 || (place.rating != null && place.rating >= minRating);

     // Check if the place matches the saved filter
     const matchesSaved = !showSavedOnly || savedIds.includes(place.id);

     // Check if the place matches the search text
     // convert the place name to lowercase and check if it includes the search text
     const matchesSearch = place.name
          .toLowerCase()
          .includes(searchText.trim().toLowerCase());

     // Return true if the place matches both the category and the minimum rating
      return (matchesCategory && matchesRating && matchesSaved && matchesSearch);
  });

  // toggleSave adds or removes a place ID from the savedIds state
  // if already saved, it will be removed; otherwise, it will be added
  function toggleSave(placeId) {
    setSavedIds((previousIds) => {
      if(previousIds.includes(placeId)) {
        return previousIds.filter((id) => id !== placeId);
      }
      return [...previousIds, placeId];
    });
  }


  // variable to hold the destination input by the user
  const [destination, setDestination] = useState(null);

  // 
  const latestDestinationRef = useRef(null);

  // handleDestinationFound is a function that updates the destination state and resets the selected place ID
  function handleDestinationFound(newDestination) {
    latestDestinationRef.current = newDestination;
    
    // Update the destination state with the new destination
    setDestination(newDestination);
    // Reset the selected place ID
    setSelectedPlaceId(null);

    //clear previous destination's search results
    setPlaces([]);
  }

  // function handlePlacesFound is a function that updates the places state with new places and resets the selected place ID and filters
  function handlePlacesFound(newPlaces, searchedDestination) {
    if(searchedDestination !== latestDestinationRef.current) {
      return;
    }
    
    // Update the places state with the new places
    setPlaces(newPlaces);
    
    // function to update the knownPlaces state with new places, ensuring no duplicates
    setKnownPlaces((previousPlaces) => {
      // Create a new array that combines previous places and new places, filtering out duplicates based on the place ID
      const newIds = newPlaces.map((place) => place.id);

      // variable to hold the previous places that are not in the new places
      const previousOnly = previousPlaces.filter((place) => !newIds.includes(place.id));

      // Return a new array that combines the previous places (excluding duplicates) and the new places
      return [...previousOnly, ...newPlaces];
    });

    //reset filters so the new results are visible
    setSelectedPlaceId(null);
    setCategory('All');
    setMinRating(0);
    setShowSavedOnly(false);
    setSearchText('');
  }

  //
  function handleSavedPlacesLoaded(restoredPlaces) {
    setKnownPlaces((previousPlaces) => {
      const restoredIds = restoredPlaces.map((place) => place.id);

      const previousOnly = previousPlaces.filter((place) => !restoredIds.includes(place.id));

      return [...previousOnly, ...restoredPlaces];
    });

    setSelectedPlaceId(null);
    setShowSavedOnly(true);
    setCategory('All');
    setMinRating(0);
    setSearchText('');
  }

  return (
    <>
      <main className = "app-shell">
        <h1>TravelPal</h1>
        <p>Find places for your next adventure.</p>

        {/* TravelMap component displays a Google Map */}
        <TravelMap 
            places = {filteredPlaces}
            selectedPlace = {selectedPlace}
            onSelectPlace = {setSelectedPlaceId}
            onCloseDetails = {() => setSelectedPlaceId(null)}
            onDestinationFound = {handleDestinationFound}
            destination = {destination}
            onPlacesFound = {handlePlacesFound}
            missingSavedIds = {missingSavedIds}
            onSavedPlacesLoaded = {handleSavedPlacesLoaded}
        />
        {/* Displays the current destination */}
        {destination && (
          <p>Exploring: {destination.name}</p>
        )}

        <PlaceFilters 
                    searchText={searchText} 
                    onSearchTextChange={setSearchText} 
                    category={category} 
                    onCategoryChange={setCategory} 
                    minRating={minRating} 
                    onMinRatingChange={setMinRating} 
                    showSavedOnly={showSavedOnly} 
                    onShowSavedOnlyChange={setShowSavedOnly} 
         /> 

        {/* Displays the number of matching places */}
        <p>{filteredPlaces.length} places found</p>

        {/*  Displays the number of saved places */}
        <p>Saved Places: {savedIds.length}</p>

        {/* Displays matching cards, or a message when none match */}
        {filteredPlaces.length > 0 ? (<PlaceList 
                                          places = {filteredPlaces}  
                                          savedIds = {savedIds} 
                                          onToggleSave={toggleSave}
                                          onSelectPlace = {setSelectedPlaceId}/>) : (
          <p>No places match your filters.</p>
        )}

        {/* Displays details of the selected place */}
        {selectedPlace && (
          <section className = "selected-details">
            <h2>Selected Place: {selectedPlace.name}</h2>

            <p>Category: {selectedPlace.category}</p>
            <p>Rating: {selectedPlace.rating}</p>
            <p>Address: {selectedPlace.address}</p>

            <button 
                    type = "button" 
                    onClick = {() => setSelectedPlaceId(null)}>
                      Close Details
            </button>
          </section>
        )}


      </main>
    </>
  );
}

export default App;
