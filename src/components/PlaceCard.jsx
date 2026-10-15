// Displays information about one place.
// Receives that information through the place prop.

function PlaceCard({ place, isSaved, onToggleSave, onSelectPlace }) {
    {/*  */}
    const googleMapsUrl = 
        typeof place.id === 'string'
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            place.name
        )}&query_place_id=${encodeURIComponent(place.id)}`
        : null;

    return (
        <article className = "place-card">
            <h2>{place.name}</h2>
            <p>Category: {place.category}</p>
            <p>
                Rating: {place.rating != null 
                ? `${place.rating} / 5` 
                : 'Not rated'}
            </p>
            <p>Address: {place.address}</p>

            {/* Button to save or unsave the place */}
            <button
                   type="button"
                   aria-pressed={isSaved}
                   onClick={() => onToggleSave(place.id)}
            >
                  {isSaved ? 'Unsave' : 'Save'}
            </button>

            {/* button to view details of place */}
            <button 
                    type = "button" 
                    onClick = {() => onSelectPlace(place.id)}>
                        View Details
            </button>

            {/*  */}
            {googleMapsUrl && (
                <p>
                    <a
                        href = {googleMapsUrl}
                        target = "_blank"
                        rel = "noopener noreferrer"
                    >
                        Open in Google Maps
                    </a>
                </p>
            )}

        </article>
    );
}
export default PlaceCard;