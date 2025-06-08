import React from "react";

interface Pagination {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageSize: number;
    onPageSizeChange?: (pageSize: number) => void;
    pageSizeOptions?: number[];
    disabled?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  disabled = false
}: Pagination) {
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 mb-4 p-6 bg-white/80 backdrop-blur border border-stone-300 rounded-2xl shadow-lg">
      
      {/* Museum-style decorative header */}
      <div className="absolute top-2 left-4 text-xs text-amber-700 font-mono opacity-60">
        PAGINATION CONTROLS • ARCHIVAL NAVIGATION
      </div>
      
      <div className="flex items-center mb-2 sm:mb-0 mt-4 sm:mt-0">
        <span className="text-sm text-stone-700 font-serif">
          Manuscript <span className="text-amber-700 font-medium">α {currentPage}</span> of <span className="text-amber-700 font-medium">{totalPages} Ω</span>
        </span>
       
        {onPageSizeChange && (
          <div className="ml-6">
            <label className="text-sm text-stone-700 mr-3 font-serif">Items per folio:</label>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              disabled={disabled}
              className="border border-stone-300 rounded-lg py-2 px-3 text-sm bg-stone-50 text-stone-800 hover:border-amber-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size} className="bg-stone-50">
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
     
      <div className="flex items-center space-x-2">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || disabled}
          className="px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 text-stone-700 hover:bg-amber-50 hover:border-amber-400 hover:text-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-serif text-sm shadow-sm"
          title="First manuscript"
        >
          ⟪
        </button>
        
        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || disabled}
          className="px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 text-stone-700 hover:bg-amber-50 hover:border-amber-400 hover:text-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-serif text-sm shadow-sm"
          title="Previous manuscript"
        >
          ⟨
        </button>
       
        {/* Page Numbers */}
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={disabled}
            className={`px-3 py-2 rounded-lg border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-serif text-sm shadow-sm ${
              currentPage === page
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-amber-50 border-amber-500 shadow-md transform scale-105'
                : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-amber-50 hover:border-amber-400 hover:text-amber-800'
            }`}
          >
            {page}
          </button>
        ))}
       
        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || disabled}
          className="px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 text-stone-700 hover:bg-amber-50 hover:border-amber-400 hover:text-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-serif text-sm shadow-sm"
          title="Next manuscript"
        >
          ⟩
        </button>
        
        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || disabled}
          className="px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 text-stone-700 hover:bg-amber-50 hover:border-amber-400 hover:text-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-serif text-sm shadow-sm"
          title="Last manuscript"
        >
          ⟫
        </button>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-1 right-3 text-amber-600 opacity-30 text-xs">⚜</div>
    </div>
  );
}