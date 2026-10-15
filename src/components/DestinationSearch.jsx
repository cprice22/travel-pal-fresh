// imports the useState hook from React, which allows the component to have state variables
import { useState } from 'react';

// imports the PlaceList component that displays a list of places
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

//  
function DestinationSearch({ onDestinationFound }) {
    // variable to hold the current destination input by the user
    const [destination, setDestination] = useState("");

    // variable to hold the loading state of the destination search
    const [isLoading, setIsLoading] = useState(false);

    // variable to hold any error messages that may occur during the destination search
    const [message, setMessage] = useState("");

    // 
    const map = useMap();

    // variable to hold the geocoding library from the Google Maps API
    const geocoding = useMapsLibrary('geocoding');

    // handleSubmit is an asynchronous function that handles the form submission for searching a destination
    async function handleSubmit(event) {
        // event.preventDefault() is called to prevent the default form submission behavior, which would cause a page reload
        event.preventDefault();

        // variable to hold the trimmed version of the destination input by the user
        const query = destination.trim();

        // condition to check if the query is empty, or if the map or geocoding library is not available, or if a search is already in progress
        if(!query || !map || !geocoding || isLoading) {
            return;
        }

        // setIsLoading(true) is called to indicate that a search is in progress
        setIsLoading(true);

        // setMessage("") is called to clear any previous error messages
        setMessage("");

        // try-catch block to handle the asynchronous geocoding request
        try {
            const geocoder = new geocoding.Geocoder();

            const response = await geocoder.geocode({
                address: query,
            });

            const result = response.results[0];

            if(!result) {
                setMessage('No destination found. Try a more specific name.');
                return;
            }

            // onDestinationFound is called with the formatted address and position of the found destination, allowing the parent component to update its state accordingly
            onDestinationFound({
                name: result.formatted_address,
                position: {
                    lat: result.geometry.location.lat(),
                    lng: result.geometry.location.lng(),
                },
            });

            // fits the map bounds to the viewport of the found destination, ensuring that the destination is visible on the map
            map.fitBounds(result.geometry.viewport);
            // shows the formatted address of the found destination in the message state variable
            setMessage(`Showing: ${result.formatted_address}`); 
        } catch (error) {
            console.error('Destination search failed:', error);
            setMessage('Search failed. Check the Console for details.');
        } finally {
            setIsLoading(false);
        }
    }

    // deals with the rendering of the form and its elements, including the input field for the destination, the submit button, and a paragraph to display status messages
    return (
        <form onSubmit = {handleSubmit}>
            <label htmlFor = "destination">Destination: </label>

            <input 
                id = "destination"
                type = "search"
                placeholder = "Example: Savannah, GA"
                value = {destination}
                onChange = {(event) => setDestination(event.target.value)}
                disabled = {isLoading}
                required
            />

            <button
                type = "submit"
                disabled = {!map || !geocoding || isLoading}
            >
                {isLoading ? 'Searching...' : 'Search Destination'}
            </button>

            <p role = "status">{message}</p>
        </form>
    );
}

export default DestinationSearch;