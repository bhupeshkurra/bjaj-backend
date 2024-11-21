import React, { useState } from 'react';
import axios from 'axios';

function JsonInputForm() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]); // State for multiple filters

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async () => {
    // Reset the previous output
    setResponse(null);
    setError('');
    
    // Validate JSON input
    try {
      const parsedJson = JSON.parse(jsonInput);
      if (parsedJson.data && Array.isArray(parsedJson.data)) {
        setError('');
        await fetchData(parsedJson);
      } else {
        setError('Invalid JSON structure. Ensure "data" is an array.');
      }
    } catch (err) {
      setError('Invalid JSON input.');
    }
  };

  const fetchData = async (data) => {
    try {
      const response = await axios.post('https://bhupesh-bfhl-api.vercel.app/bfhl', { data });
      if (response.data.is_success) {
        setResponse(response.data);
      } else {
        setError('Error: Response indicates failure.');
      }
    } catch (error) {
      setError('Error fetching data from the backend.', error);
    }
  };

  // Function to toggle the filter selection
  const toggleFilter = (filter) => {
    setSelectedFilters((prevFilters) => {
      if (prevFilters.includes(filter)) {
        // If filter is already selected, remove it
        return prevFilters.filter(item => item !== filter);
      } else {
        // If filter is not selected, add it
        return [...prevFilters, filter];
      }
    });
  };

  // Function to render sections based on selected filters
  const renderFilteredData = () => {
    const filteredData = [];

    if (selectedFilters.includes('Alphabets') && response.alphabets) {
      filteredData.push(
        <div key="alphabets">
          <h4>Alphabets:</h4>
          <ul>
            {response.alphabets.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      );
    }

    if (selectedFilters.includes('Numbers') && response.numbers) {
      filteredData.push(
        <div key="numbers">
          <h4>Numbers:</h4>
          <ul>
            {response.numbers.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      );
    }

    if (selectedFilters.includes('Highest lowercase alphabet') && response.highest_lowercase_alphabet) {
      filteredData.push(
        <div key="highest_lowercase_alphabet">
          <h4>Highest Lowercase Alphabet:</h4>
          <ul>
            {response.highest_lowercase_alphabet.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      );
    }

    // Render all response details at once
    filteredData.push(
      <div key="allDetails">
        <h4>All Details:</h4>
        <ul>
          {Object.keys(response).map((key, index) => {
            if (key !== 'alphabets' && key !== 'numbers' && key !== 'highest_lowercase_alphabet') {
              return (
                <li key={index}>
                  <strong>{key}:</strong> {JSON.stringify(response[key])}
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
    );

    return filteredData;
  };

  return (
    <div>
      <textarea
        value={jsonInput}
        onChange={handleInputChange}
        placeholder="Enter JSON data here"
        rows="5"
        cols="40"
      />
      <button onClick={handleSubmit}>Submit</button>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* Display filters as clickable buttons */}
      {response && (
        <div>
          <h3>Select Filters:</h3>
          <button
            onClick={() => toggleFilter('Alphabets')}
            style={{
              backgroundColor: selectedFilters.includes('Alphabets') ? 'lightblue' : 'white',
              color: 'black' // Set text color to black
            }}
          >
            Alphabets
          </button>
          <button
            onClick={() => toggleFilter('Numbers')}
            style={{
              backgroundColor: selectedFilters.includes('Numbers') ? 'lightblue' : 'white',
              color: 'black' // Set text color to black
            }}
          >
            Numbers
          </button>
          <button
            onClick={() => toggleFilter('Highest lowercase alphabet')}
            style={{
              backgroundColor: selectedFilters.includes('Highest lowercase alphabet') ? 'lightblue' : 'white',
              color: 'black' // Set text color to black
            }}
          >
            Highest lowercase alphabet
          </button>
        </div>
      )}

      {/* Render filtered and unfiltered response */}
      {response && renderFilteredData()}
    </div>
  );
}

export default JsonInputForm;
