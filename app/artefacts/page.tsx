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
    <main className="p-8 max-w-6xl mx-auto bg-gray-900 min-h-screen">
      <h1 className="text-3xl mb-6 text-blue-400 font-bold drop-shadow-sm">🏛️ Explore Historical Europe</h1>
      
      {/* Search Controls Section */}
      <section className="mb-8 p-6 bg-gray-800 border-2 border-gray-600 rounded-lg">
        <h2 className="text-xl mb-4 text-blue-400 font-semibold">Search Archives</h2>
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* API Source Selector */}
          <div className="lg:w-80">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Archive Source
            </label>
            <select
              value={apiSource}
              onChange={(e) => setApiSource(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300 transition-colors"
            >
              <option value="europeana">Europeana API</option>
              <option value="digital-bodleian-oxford">Oxford University&apos;s Digital Manuscripts</option>
              {/* <option value="fitzwilliam">FitzWilliam, Cambridge University</option>
              <option value="natmus">National Museum Denmark</option>
              <option value="finna">National Finnish Museum</option> */}
              {/* <option value="digitaltmuseum">DigitaltMuseum API</option>
              <option value="soch">Swedish Open Cultural Heritage</option> */}
            </select>
          </div>
          
          {/* Search Input and Button */}
          <div className="flex-1 flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search Terms
              </label>
              <input
                type="text"
                placeholder={setIdea}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-3 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300 placeholder-gray-400 transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
              />
            </div>
            <div className="flex flex-col justify-end">
              <button 
                onClick={() => handleSearch()} 
                className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded border border-green-500 hover:border-green-400 transition-all duration-200 font-medium h-fit"
                disabled={isLoading}
                 onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
                
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </div>
                ) : (
                  '🔍 Search'
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="mb-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-16 bg-gray-800 border border-gray-600 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-300 text-lg">Searching archives...</p>
              <p className="text-gray-400 text-sm mt-1">This may take a moment</p>
            </div>
          </div>
        ) : results ? (
          <>
            {results.length > 0 ? (
              <>
                {/* Results Header */}
                <div className="mb-6 p-4 bg-gray-800 border border-gray-600 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-blue-400">
                      Search Results
                    </h2>
                    <p className="text-gray-400">
                      Found <span className="text-blue-400 font-medium">{pagination.totalItems}</span> items
                    </p>
                  </div>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {results.map((item: Item, index: number) => (
                    <div key={index} className="w-full max-w-sm mx-auto">
                      <Card
                        title={item.title}
                        description={item.description}
                        author={item.author}
                        provider={item.provider}
                        source={item.source}
                        image={item.edmPreview}
                        showAddButton={true} // Show the add button on the artifacts page
                      />
                    </div>
                  ))}
                </div>
                
                {/* Pagination component */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                      pageSize={pagination.limit}
                      onPageSizeChange={handlePageSizeChange}
                      pageSizeOptions={[10, 20, 50]}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="p-12 bg-gray-800 border border-gray-600 rounded-lg text-center">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-300 text-xl mb-2">No results found</p>
                <p className="text-gray-400">Try adjusting your search terms or selecting a different archive source.</p>
              </div>
            )}
          </>
        ) : (
          <div className="p-12 bg-gray-800 border border-gray-600 rounded-lg text-center">
            <div className="text-6xl mb-4">🏛️</div>
            <p className="text-gray-300 text-xl mb-2">Ready to explore historical archives</p>
            <p className="text-gray-400 mb-4">Enter a search term above to discover medieval artifacts and manuscripts.</p>
            <div className="inline-flex items-center px-4 py-2 bg-blue-900 border border-blue-600 rounded-lg text-blue-300 text-sm">
              💡 Try searching for: &quot;{setIdea}&quot;
            </div>
          </div>
        )}
      </section>
    </main>
  );
}