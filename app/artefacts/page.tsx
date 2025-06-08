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

interface SearchFilters {
  mediaType: string;
  reusability: string;
  hasMedia: boolean;
  hasThumbnail: boolean;
  imageSize: string;
  colourPalette: string;
  country: string;
  language: string;
  provider: string;
  yearRange: {
    from: string;
    to: string;
  };
}

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [apiSource, setApiSource] = useState('europeana');
  const [results, setResults] = useState<Item[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [setIdea, setSearchIdea] = useState('')
  const [randomIdea, setRandomIdea] = useState<boolean>(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // Enhanced filters state
  const [filters, setFilters] = useState<SearchFilters>({
    mediaType: '',
    reusability: '',
    hasMedia: false,
    hasThumbnail: false,
    imageSize: '',
    colourPalette: '',
    country: '',
    language: '',
    provider: '',
    yearRange: {
      from: '',
      to: ''
    }
  });

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

  // Build query refinements (qf parameters) based on filters
  const buildQueryRefinements = (): string[] => {
    const refinements: string[] = [];

    if (filters.mediaType) {
      refinements.push(`TYPE:${filters.mediaType}`);
    }
    if (filters.reusability) {
      refinements.push(`reusability:${filters.reusability}`);
    }
    if (filters.hasMedia) {
      refinements.push('MEDIA:true');
    }
    if (filters.hasThumbnail) {
      refinements.push('THUMBNAIL:true');
    }
    if (filters.imageSize) {
      refinements.push(`IMAGE_SIZE:${filters.imageSize}`);
    }
    if (filters.colourPalette) {
      refinements.push(`COLOURPALETTE:${filters.colourPalette}`);
    }
    if (filters.country) {
      refinements.push(`COUNTRY:${filters.country}`);
    }
    if (filters.language) {
      refinements.push(`LANGUAGE:${filters.language}`);
    }
    if (filters.provider) {
      refinements.push(`PROVIDER:"${filters.provider}"`);
    }
    if (filters.yearRange.from && filters.yearRange.to) {
      refinements.push(`YEAR:[${filters.yearRange.from} TO ${filters.yearRange.to}]`);
    }

    return refinements;
  };

  async function handleSearch(page = 1, limit = pagination.limit) {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      let url = `/api/${apiSource}?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
      
      // Add query refinements if any filters are applied (only for Europeana)
      if (apiSource === 'europeana') {
        const refinements = buildQueryRefinements();
        refinements.forEach(refinement => {
          url += `&qf=${encodeURIComponent(refinement)}`;
        });
      }

      const response = await fetch(url);
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

  const handleFilterChange = (filterName: keyof SearchFilters, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleYearRangeChange = (field: 'from' | 'to', value: string) => {
    setFilters(prev => ({
      ...prev,
      yearRange: {
        ...prev.yearRange,
        [field]: value
      }
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      mediaType: '',
      reusability: '',
      hasMedia: false,
      hasThumbnail: false,
      imageSize: '',
      colourPalette: '',
      country: '',
      language: '',
      provider: '',
      yearRange: {
        from: '',
        to: ''
      }
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.mediaType) count++;
    if (filters.reusability) count++;
    if (filters.hasMedia) count++;
    if (filters.hasThumbnail) count++;
    if (filters.imageSize) count++;
    if (filters.colourPalette) count++;
    if (filters.country) count++;
    if (filters.language) count++;
    if (filters.provider) count++;
    if (filters.yearRange.from || filters.yearRange.to) count++;
    return count;
  };

  // Reset pagination when changing API source or filters
  useEffect(() => {
    setPagination({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      limit: 10
    });
  }, [apiSource, filters]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
        {/* Hero Section - Smaller on mobile */}
        <div className="text-center mb-6 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl font-serif text-amber-800 mb-2 sm:mb-4 drop-shadow-sm">
            🏛️ <span className="sm:hidden">Historical Europe</span>
            <span className="hidden sm:inline">Explore Historical Europe</span>
          </h1>
          <p className="text-sm sm:text-lg text-stone-700 max-w-2xl mx-auto px-2">
            Discover rare manuscripts, artifacts, and treasures from Europe&apos;s greatest archives
          </p>
        </div>
        
        {/* Search Controls Section - More compact on mobile */}
        <section className="mb-6 sm:mb-12">
          <div className="bg-white/80 backdrop-blur border border-stone-300 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-700 to-amber-800 px-4 sm:px-8 py-4 sm:py-6">
              <h2 className="text-lg sm:text-2xl font-serif text-amber-50 mb-1 sm:mb-2">Search Archives</h2>
              <p className="text-xs sm:text-base text-amber-100">Access millions of historical documents and artifacts</p>
            </div>
            
            <div className="p-4 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mb-4 sm:mb-6">
                {/* API Source Selector */}
                <div className="lg:col-span-3">
                  <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2 sm:mb-3">
                    Archive Source
                  </label>
                  <select
                    value={apiSource}
                    onChange={(e) => setApiSource(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-stone-300 rounded-lg sm:rounded-xl bg-stone-50 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm transition-all text-sm sm:text-base"
                  >
                    <option value="europeana">Europeana Collection</option>
                    <option value="digital-bodleian-oxford">Oxford Digital Manuscripts</option>
                  </select>
                </div>
                
                {/* Search Input */}
                <div className="lg:col-span-7">
                  <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2 sm:mb-3">
                    Search Terms
                  </label>
                  <input
                    type="text"
                    placeholder={setIdea}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-stone-300 rounded-lg sm:rounded-xl bg-stone-50 text-stone-800 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm transition-all text-sm sm:text-base"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                  />
                </div>
                
                {/* Search Button */}
                <div className="lg:col-span-2 flex items-end">
                  <button 
                    onClick={() => handleSearch()} 
                    className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-amber-700 hover:bg-amber-800 text-amber-50 rounded-lg sm:rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-amber-50 mr-2"></div>
                        <span className="hidden sm:inline">Searching...</span>
                        <span className="sm:hidden">...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="mr-1 sm:mr-2">🔍</span>
                        Search
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Advanced Filters Toggle - Smaller on mobile */}
              <div className="border-t border-stone-300 pt-4 sm:pt-6">
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-stone-600 hover:bg-stone-700 text-stone-50 rounded-lg sm:rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 text-sm sm:text-base"
                  disabled={apiSource !== 'europeana'}
                >
                  <span className="text-base sm:text-lg">⚙️</span>
                  <span className="font-medium">
                    <span className="sm:hidden">Filters</span>
                    <span className="hidden sm:inline">Advanced Filters</span>
                  </span>
                  {apiSource !== 'europeana' && <span className="text-xs opacity-75 hidden sm:inline">(Europeana only)</span>}
                  {getActiveFilterCount() > 0 && apiSource === 'europeana' && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      {getActiveFilterCount()}
                    </span>
                  )}
                  {apiSource === 'europeana' && (
                    <span className={`transition-transform duration-200 ${showAdvancedFilters ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  )}
                </button>
              </div>

              {/* Advanced Filters Panel - Responsive grid */}
              {showAdvancedFilters && apiSource === 'europeana' && (
                <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-br from-stone-50 to-amber-50 rounded-lg sm:rounded-xl border border-stone-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    
                    {/* All filters with smaller mobile styling */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2 sm:mb-3">
                        Media Type
                      </label>
                      <select
                        value={filters.mediaType}
                        onChange={(e) => handleFilterChange('mediaType', e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="">All Types</option>
                        <option value="IMAGE">🖼️ Images</option>
                        <option value="VIDEO">🎬 Videos</option>
                        <option value="SOUND">🎵 Audio</option>
                        <option value="TEXT">📚 Books/Text</option>
                        <option value="3D">🗿 3D Objects</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2 sm:mb-3">
                        Copyright Status
                      </label>
                      <select
                        value={filters.reusability}
                        onChange={(e) => handleFilterChange('reusability', e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="">All Rights</option>
                        <option value="open">✅ Open (Free to reuse)</option>
                        <option value="restricted">⚠️ Restricted (Some limitations)</option>
                        <option value="permission">🔒 Permission Required</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2 sm:mb-3">
                        Image Quality
                      </label>
                      <select
                        value={filters.imageSize}
                        onChange={(e) => handleFilterChange('imageSize', e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="">Any Size</option>
                        <option value="small">📱 Small (&lt; 0.5MP)</option>
                        <option value="medium">💻 Medium (0.5-1MP)</option>
                        <option value="large">🖥️ Large (1-4MP)</option>
                        <option value="extra_large">📺 Extra Large (&gt; 4MP)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2 sm:mb-3">
                        Country
                      </label>
                      <select
                        value={filters.country}
                        onChange={(e) => handleFilterChange('country', e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="">All Countries</option>
                        <option value="france">🇫🇷 France</option>
                        <option value="germany">🇩🇪 Germany</option>
                        <option value="italy">🇮🇹 Italy</option>
                        <option value="netherlands">🇳🇱 Netherlands</option>
                        <option value="spain">🇪🇸 Spain</option>
                        <option value="united_kingdom">🇬🇧 United Kingdom</option>
                        <option value="poland">🇵🇱 Poland</option>
                        <option value="austria">🇦🇹 Austria</option>
                        <option value="belgium">🇧🇪 Belgium</option>
                        <option value="denmark">🇩🇰 Denmark</option>
                        <option value="sweden">🇸🇪 Sweden</option>
                        <option value="finland">🇫🇮 Finland</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2 sm:mb-3">
                        Language
                      </label>
                      <select
                        value={filters.language}
                        onChange={(e) => handleFilterChange('language', e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="">All Languages</option>
                        <option value="en">🇬🇧 English</option>
                        <option value="fr">🇫🇷 French</option>
                        <option value="de">🇩🇪 German</option>
                        <option value="it">🇮🇹 Italian</option>
                        <option value="es">🇪🇸 Spanish</option>
                        <option value="nl">🇳🇱 Dutch</option>
                        <option value="pl">🇵🇱 Polish</option>
                        <option value="da">🇩🇰 Danish</option>
                        <option value="sv">🇸🇪 Swedish</option>
                        <option value="fi">🇫🇮 Finnish</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2 sm:mb-3">
                        Dominant Color
                      </label>
                      <select
                        value={filters.colourPalette}
                        onChange={(e) => handleFilterChange('colourPalette', e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      >
                        <option value="">Any Color</option>
                        <option value="#FF0000">🔴 Red</option>
                        <option value="#0000FF">🔵 Blue</option>
                        <option value="#00FF00">🟢 Green</option>
                        <option value="#FFFF00">🟡 Yellow</option>
                        <option value="#FF8C00">🟠 Orange</option>
                        <option value="#800080">🟣 Purple</option>
                        <option value="#FFC0CB">🩷 Pink</option>
                        <option value="#A52A2A">🟤 Brown</option>
                        <option value="#000000">⚫ Black</option>
                        <option value="#FFFFFF">⚪ White</option>
                      </select>
                    </div>
                  </div>

                  {/* Year Range Filter - Responsive */}
                  <div className="mt-6 sm:mt-8">
                    <label className="block text-xs sm:text-sm font-medium text-stone-700 mb-2 sm:mb-3">
                      Year Range
                    </label>
                    <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-amber-100 border-l-4 border-amber-600 rounded-lg">
                      <div className="flex items-start">
                        <span className="text-amber-700 mr-2 text-base sm:text-lg">💡</span>
                        <div>
                          <p className="text-xs sm:text-sm text-amber-800 font-medium">Historical Dating Tip</p>
                          <p className="text-xs text-amber-700 mt-1">
                            Enter negative years for BCE dates (e.g., -500 = 500 BCE)
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        placeholder="From year"
                        value={filters.yearRange.from}
                        onChange={(e) => handleYearRangeChange('from', e.target.value)}
                        className="px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-stone-500"
                      />
                      <input
                        type="number"
                        placeholder="To year"
                        value={filters.yearRange.to}
                        onChange={(e) => handleYearRangeChange('to', e.target.value)}
                        className="px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-stone-500"
                      />
                    </div>
                  </div>

                  {/* Boolean Filters - Responsive */}
                  <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-3 sm:gap-4">
                    <label className="flex items-center gap-3 text-stone-700 text-xs sm:text-sm cursor-pointer p-3 bg-white rounded-lg border border-stone-300 hover:bg-stone-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.hasMedia}
                        onChange={(e) => handleFilterChange('hasMedia', e.target.checked)}
                        className="w-4 h-4 text-amber-600 bg-white border-stone-300 rounded focus:ring-amber-500"
                      />
                      <span>Has downloadable media</span>
                    </label>
                    <label className="flex items-center gap-3 text-stone-700 text-xs sm:text-sm cursor-pointer p-3 bg-white rounded-lg border border-stone-300 hover:bg-stone-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.hasThumbnail}
                        onChange={(e) => handleFilterChange('hasThumbnail', e.target.checked)}
                        className="w-4 h-4 text-amber-600 bg-white border-stone-300 rounded focus:ring-amber-500"
                      />
                      <span>Has thumbnail image</span>
                    </label>
                  </div>

                  {/* Clear Filters Button */}
                  {getActiveFilterCount() > 0 && (
                    <div className="mt-4 sm:mt-6 text-center">
                      <button
                        onClick={clearAllFilters}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg sm:rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
                      >
                        Clear All Filters ({getActiveFilterCount()})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section>
          {isLoading ? (
            <div className="bg-white/80 backdrop-blur border border-stone-300 rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-16 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 rounded-full mb-4 sm:mb-6">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-amber-700"></div>
              </div>
              <h3 className="text-lg sm:text-xl font-serif text-amber-800 mb-2">Searching Archives</h3>
              <p className="text-sm sm:text-base text-stone-600">Discovering historical treasures for you...</p>
            </div>
          ) : results ? (
            <>
              {results.length > 0 ? (
                <>
                  {/* Results Header - More compact on mobile */}
                  <div className="mb-4 sm:mb-8 bg-white/80 backdrop-blur border border-stone-300 rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-lg sm:text-2xl font-serif text-amber-800 mb-1">
                          Discovery Results
                        </h2>
                        <p className="text-xs sm:text-base text-stone-600">
                          Found <span className="font-bold text-amber-800">{pagination.totalItems}</span> historical items
                          {getActiveFilterCount() > 0 && (
                            <span className="text-amber-700 ml-2 hidden sm:inline">
                              • {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} applied
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-amber-600">
                        <span className="text-2xl sm:text-3xl">📜</span>
                      </div>
                    </div>
                  </div>

                  {/* Results Grid - Optimized for mobile performance */}
                  <div className="relative">
                    {/* Simplified background for mobile performance */}
                    <div className="absolute inset-0 bg-white/60 rounded-xl sm:rounded-2xl border border-stone-200 shadow-inner backdrop-blur-sm"></div>
                    
                    {/* Cards Grid - 2 columns on mobile, 4 on desktop */}
                    <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 p-3 sm:p-6 lg:p-8 z-20">
                      {results.map((item: Item, index: number) => (
                        <div key={index} className="w-full">
                          <Card
                            title={item.title}
                            description={item.description}
                            author={item.author}
                            provider={item.provider}
                            source={item.source}
                            image={item.edmPreview}
                            showAddButton={true}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Pagination component */}
                  {pagination.totalPages > 1 && (
                    <div className="flex justify-center mt-4 sm:mt-0">
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
                <div className="bg-white/80 backdrop-blur border border-stone-300 rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-16 text-center">
                  <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🔍</div>
                  <h3 className="text-lg sm:text-2xl font-serif text-amber-800 mb-4">No Treasures Found</h3>
                  <p className="text-sm sm:text-base text-stone-600 mb-4 sm:mb-6 max-w-md mx-auto">
                    We couldn&apos;t find any artifacts matching your search. Try adjusting your terms or clearing some filters.
                  </p>
                  {getActiveFilterCount() > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-amber-700 hover:bg-amber-800 text-amber-50 rounded-lg sm:rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="bg-white/80 backdrop-blur border border-stone-300 rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-16 text-center">
              <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🏛️</div>
              <h3 className="text-lg sm:text-2xl font-serif text-amber-800 mb-4">Begin Your Historical Journey</h3>
              <p className="text-sm sm:text-base text-stone-600 mb-4 sm:mb-6 max-w-lg mx-auto">
                Enter a search term above to explore thousands of medieval artifacts, illuminated manuscripts, and historical treasures from Europe&apos;s finest collections.
              </p>
              <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-100 to-stone-100 border border-stone-300 rounded-lg sm:rounded-xl">
                <span className="text-amber-600 mr-2">💡</span>
                <span className="text-stone-700 font-medium text-sm sm:text-base">Try searching for: {setIdea}</span>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}