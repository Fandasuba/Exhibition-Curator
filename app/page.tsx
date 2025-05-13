'use client';

import { useState } from 'react';

interface Item {
  edmPreview: string;
  title: string;
}

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Item[] | null>(null);

  async function handleSearch() {
    try {
      const response = await fetch(`/api/europeana?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data.items || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Viking Art Search</h1>
      <div className="flex gap-2 mb-4">
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
