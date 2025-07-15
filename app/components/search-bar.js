'use client';

import { useState } from 'react';
import axios from 'axios';
import styles from '../componentStyles/search-bar.module.css';
import sharedStyles from '../componentStyles/shared-layout.module.css';

export default function SearchBar( { setSearchResults, tableSelection } ) {

    // State for search input
    const [searchInput, setSearchInput] = useState('');
    // State to track whether the user has submitted a search to determine whether a message should be returned about whether the data was found or not
    const [hasSearched, setHasSearched] = useState(false);
    // State to track if the search returned results. 
    const [noResults, setNoResults] = useState(false);


    // This function sets the state variable for the search input
    function handleChange (event) {
        setSearchInput(event.target.value);
    }

    function handleSubmit (event) {
         // Prevents the page from reloading in response to the form submission, which is the default behavior.
        event.preventDefault()

        setHasSearched(true);

        // Backend url
        const url = 'http://localhost:3000/api/searchHandler';

        // Send a GET request to the backend with the correct query parameters.
        axios.get(url, { params: {query: searchInput} })
        .then((response) => {
        console.log(response.data);
        const result = response.data.result;
        setNoResults(result.length === 0);
        setSearchResults(response.data.result);
        })
        .catch((error) => {
        console.error('Search failed:', error);
        });
    }

    return (
    <div className={sharedStyles.toolbarItem}>
        <form onSubmit={handleSubmit} className={sharedStyles.toolbarForm}>
            <input type="text" value={searchInput} onChange={handleChange} className={sharedStyles.toolbarInput}/>
            <button type="submit" className={sharedStyles.toolbarButton}>Search</button>
        </form>
        {/* Notify the user that the query parameter they entered could not be found in the database*/ 
            hasSearched && noResults === true && (<p>The item entered in the search bar is not in the database.</p>)
        }
    </div>
    );
}