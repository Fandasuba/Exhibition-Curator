import React from "react";

interface Pagination{
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
    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 mb-4 p-4 bg-gray-800 rounded border border-gray-600">
      <div className="flex items-center mb-2 sm:mb-0">
        <span className="text-sm text-gray-300">
          Showing page <span className="text-blue-400 font-medium">{currentPage}</span> of <span className="text-blue-400 font-medium">{totalPages}</span>
        </span>
       
        {onPageSizeChange && (
          <div className="ml-4">
            <label className="text-sm text-gray-300 mr-2">Items per page:</label>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              disabled={disabled}
              className="border border-gray-600 rounded py-1 px-2 text-sm bg-gray-700 text-gray-300 hover:border-blue-500 focus:border-blue-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size} className="bg-gray-700">
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
     
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || disabled}
          className="px-3 py-1 rounded border border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:border-blue-500 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          &laquo;
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || disabled}
          className="px-3 py-1 rounded border border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:border-blue-500 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          &lsaquo;
        </button>
       
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={disabled}
            className={`px-3 py-1 rounded border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              currentPage === page
                ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:border-blue-500 hover:text-blue-400'
            }`}
          >
            {page}
          </button>
        ))}
       
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || disabled}
          className="px-3 py-1 rounded border border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:border-blue-500 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          &rsaquo;
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || disabled}
          className="px-3 py-1 rounded border border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600 hover:border-blue-500 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          &raquo;
        </button>
      </div>
    </div>
  );
}