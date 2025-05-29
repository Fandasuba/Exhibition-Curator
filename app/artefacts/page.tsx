'use client';
import { useState, useEffect } from 'react';
import { searchForRNG } from '../utils/util-functions';
import Pagination from '../components/pagination';
import Card from '../components/itemCards';

interface Item {
  edmPreview: string;
  title: string;
  description: string;
  source: string;
  provider?: string;
  author?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [apiSource, setApiSource] = useState('europeana');
  const [results, setResults] = useState<Item[] | null>(null);
  // const [sourceLink, setSourceLink] = useState<string>("europeana");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [setIdea, setSearchIdea] = useState('')
  const [randomIdea, setRandomIdea] = useState<boolean>(false);

useEffect(() => {
    if (!randomIdea) {
      setSearchIdea(searchForRNG());
      setRandomIdea(true);
    }
  }, [randomIdea]);

  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });

  async function handleSearch(page = 1, limit = pagination.limit) {
  if (!query.trim()) return;
  
  setIsLoading(true);
  try {
     const response = await fetch(`/api/${apiSource}?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`)
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
   
    const data = await response.json();
    console.log("Search response:", data);
      setResults(data.items || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
  } catch (error) {
    console.error('Error fetching data:', error);
    setResults([]);
  } finally {
    setIsLoading(false);
  }
}

  const handlePageChange = (newPage: number) => {
    handleSearch(newPage, pagination.limit);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    handleSearch(1, newPageSize);
  };

  // Reset pagination when changing API source
  useEffect(() => {
    setPagination({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      limit: 10
    });
  }, [apiSource]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4"> Explore Medieval Europe</h1>
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <select
          value={apiSource}
          onChange={(e) => setApiSource(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="europeana">Europeana API</option>
          <option value="digital-bodleian-oxford">Oxford University&apos;s Digital Manuscripts</option>
          {/* <option value="fitzwilliam">FitzWilliam, Cambridge University</option>
          <option value="natmus">National Museum Denmark</option>
          <option value="finna">National Finnish Museum</option> */}
          {/* <option value="digitaltmuseum">DigitaltMuseum API</option>
          <option value="soch">Swedish Open Cultural Heritage</option> */}
        </select>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder={setIdea}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="p-2 border rounded flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <button 
            onClick={() => handleSearch()} 
            className="p-2 bg-blue-500 text-white rounded"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-8">
          {/* Simple spinner found online. Change the spinner to something with better house style later on. */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div> 
        </div>
      ) : results ? (
        <>
          {results.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((item: Item, index: number) => (
                  <Card
                    key={index}
                    title={item.title}
                    description={item.description}
                    author={item.author}
                    provider={item.provider}
                    source={item.source}
                    image={item.edmPreview}
                  />
                ))}
              </div>
              
              {/* Pagination component */}
              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  pageSize={pagination.limit}
                  onPageSizeChange={handlePageSizeChange}
                  pageSizeOptions={[10, 20, 50]}
                />
              )}
            </>
          ) : (
            <p className="text-center py-8">No results found. Try a different search term.</p>
          )}
        </>
      ) : (
        <p className="text-center py-8">Enter a search term to begin.</p>
      )}
    </div>
  );
}