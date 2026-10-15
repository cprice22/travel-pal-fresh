
function PlaceFilters({
    searchText,
    onSearchTextChange,
    category,
    onCategoryChange,
    minRating,
    onMinRatingChange,
    showSavedOnly,
    onShowSavedOnlyChange,
}) {
    function resetFilters() {
        onSearchTextChange('');
        onCategoryChange('All');
        onMinRatingChange(0);
        onShowSavedOnlyChange(false);
    }

    return (
        <section aria-label = "Place filters">
            <h2>Filter loaded places</h2>

            <div>
                <label htmlFor = "search">Search Places: </label>

                <input
                    id = "search"
                    type = "search"
                    placeholder = "Enter a place name"
                    value = {searchText}
                    onChange = {(event) => onSearchTextChange(event.target.value)}
                />
            </div>

            <div>
                <label htmlFor = "category">Category: </label>

                <select
                        id = "category"
                        value = {category}
                        onChange = {(event) => onCategoryChange(event.target.value)}
                >
                    <option value = "All">All</option>
                    <option value = "Restaurants">Restaurants</option>
                    <option value = "Hotel">Hotels</option>
                    <option value = "Attraction">Attractions</option>
                </select>
            </div>

            <div>
                <label htmlFor = "rating">Minimum Rating: </label>

                <select
                        id = "rating"
                        value = {minRating}
                        onChange = {(event) => onMinRatingChange(Number(event.target.value))}
                >
                    <option value = {0}>All Ratings</option>
                    <option value = {3}>3+</option>
                    <option value = {4}>4+</option>
                    <option value = {4.5}>4.5+</option>
                    <option value = {4.8}>4.8+</option>
                </select>
            </div>

            <div>
                <label>
                    <input
                          type = "checkbox"
                          checked = {showSavedOnly}
                          onChange = {(event) => onShowSavedOnlyChange(event.target.checked)}
                    />
                    Show Saved Only
                </label>
            </div>

            <button type = "button" onClick = {resetFilters}>
                Reset Filters
            </button>

            <p>
                These filters change the displayed results without requesting new places from Google.
            </p>
        </section>
    );
}

export default PlaceFilters;