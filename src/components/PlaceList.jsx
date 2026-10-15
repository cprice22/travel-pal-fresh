// import the PlaceCard component
import PlaceCard from './PlaceCard.jsx';

function PlaceList({ places, savedIds, onToggleSave, onSelectPlace }) {
    return (
        <section className = "place-grid">
            {places.map((place) => (
                <PlaceCard 
                    key = {place.id} 
                    place = {place} 
                    isSaved = {savedIds.includes(place.id)} 
                    onToggleSave = {onToggleSave}
                    onSelectPlace = {onSelectPlace} />
            ))}
        </section>
    );
}

export default PlaceList;