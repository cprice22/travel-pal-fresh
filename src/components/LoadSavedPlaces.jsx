// imports the useState hook from React to manage state in functional components
import { useState } from 'react';
// imports the useMapsLibrary hook from the @vis.gl/react-google-maps package to load the Google Maps Places library
import { useMapsLibrary } from '@vis.gl/react-google-maps';

// function component that allows users to load saved places based on their IDs
function LoadSavedPlaces({ missingIds, onSavedPlacesLoaded }) {
    // variable to hold the Google Maps Places library, loaded using the useMapsLibrary hook
    const placesLibrary = useMapsLibrary('places');

    //
    const [isLoading, setIsLoading] = useState(false);

    //
    const [message, setMessage] = useState('');

    //
    async function loadSavedPlaces() {
        if(!placesLibrary || isLoading || missingIds.length === 0){
            return;
        }

        setIsLoading(true);
        setMessage('');

        //
        try {
            const results = await Promise.allSettled(
                missingIds.map(async (id) => {
                    const place = new placesLibrary.Place({id});

                    await place.fetchFields({
                        fields: [
                            'displayName',
                            'formattedAddress',
                            'location',
                            'rating',
                            'types',
                        ],
                    });

                    if(!place.location) {
                        throw new Error(`Location unavailable for ${id}`);
                    }

                    const types = place.types ?? [];

                    let category = 'Other';

                    if(types.includes('restaurant')) {
                        category = 'Restaurant';
                    } else if (
                        types.includes('hotel') ||
                        types.includes('lodging')
                    ) {
                        category = 'Hotel';
                    } else if (types.includes('tourist_attraction')) {
                        category = 'Attraction';
                    }

                    return {
                        id,
                        name: place.displayName ?? 'Unnamed place',
                        category,
                        rating: place.rating ?? null,
                        address: place.formattedAddress ?? 'Address unavailable',
                        position: {
                            lat: place.location.lat(),
                            lng: place.location.lng(),
                        },
                    };
                })
            );

            const loadedPlaces = results
                .filter((result) => result.status === 'fulfilled')
                .map((result) => result.value);

                const failures = results.filter (
                    (result) => result.status === 'rejected'
                );

                failures.forEach((result) => {
                    console.error('Saved place lookup failed:', result.reason);
                });

                onSavedPlacesLoaded(loadedPlaces);

                setMessage(`Restored ${loadedPlaces.length} places. ` + `${failures.length} could not be loaded.`);
        } catch (error) {
            console.error('Loading saved places failed:', error);
            setMessage('Could not restore saved places. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <button
                type = "button"
                onClick = {loadSavedPlaces}
                disabled = {!placesLibrary || isLoading || missingIds.length === 0}
            >
                {isLoading  ? 'Loading saved places…'  : `Load saved places (${missingIds.length})`} 
            </button>

            <p role = "status">{message}</p>
        </div>
    );
}

export default LoadSavedPlaces;