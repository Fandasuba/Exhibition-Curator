'use client';

import { useState } from 'react';

interface Item {
  edmPreview: string;
  title: string;
}

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [apiSource, setApiSource] = useState('europeana');
  const [results, setResults] = useState<Item[] | null>(null);

  async function handleSearch() {
  try {
    let response;
    if (apiSource === 'natmus') {
      // POST request with JSON body for Natmus
      response = await fetch(`/api/natmus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
    } else {
      // GET request for other APIs
      response = await fetch(`/api/${apiSource}?query=${encodeURIComponent(query)}`);
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data, "This is the data <-------");

    // Set results based on API source and data structure:
    if (apiSource === 'natmus') {
      // Assuming Elasticsearch style results, adapt if needed:
      setResults(data.hits?.hits?.map((hit: any) => hit._source) || []);
    } else {
      setResults(data.items || []);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Viking Art Search</h1>
      <div className="flex gap-2 mb-4">
        <select
          value={apiSource}
          onChange={(e) => setApiSource(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="europeana">Europeana API</option>
          <option value="natmus">National Museum Denmark</option>
          <option value="finna">National Finnish Museum</option>
          {/* <option value="digitaltmuseum">DigitaltMuseum API</option>
          <option value="soch">Swedish Open Cultural Heritage</option> */}
        </select>
        <input
          type="text"
          placeholder="Search for Viking art..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 border rounded"
        />
        <button onClick={handleSearch} className="p-2 bg-blue-500 text-white rounded">
          Search
        </button>
      </div>
      <div>
        {results ? (
          <ul>
            {results.map((item: any, index: number) => (
              <li key={index} className="mb-2">
                <img src={item.edmPreview} alt={item.title} className="w-32 h-auto mb-2" />
                <p>{item.title}</p>
                {/* Additional details can be added here */}
              </li>
            ))}
          </ul>
        ) : (
          <p>No results yet.</p>
        )}
      </div>
    </div>
  );
}
