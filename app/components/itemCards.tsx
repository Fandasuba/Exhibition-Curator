'use client';
import React, { useState } from 'react';
import { useUser } from '../user-context';
import AddToExhibitModal from './AddToExhibitModal';

interface CardProps {
  title: string;
  description?: string;
  author?: string;
  provider?: string;
  source?: string;
  image?: string;
  showAddButton?: boolean;
}

interface ExhibitionItem {
  title: string;
  description?: string;
  author?: string;
  provider?: string;
  edmPreview?: string;
  source?: string;
}

export default function Card({
  title,
  description,
  author,
  provider,
  source,
  image,
  showAddButton = false
}: CardProps) {
  const { isLoggedIn } = useUser();
  const [showModal, setShowModal] = useState(false);

  const itemData: ExhibitionItem = {
    title,
    description,
    author,
    provider,
    source,
    edmPreview: image
  };

  const handleAddToExhibit = () => {
    if (!isLoggedIn) {
      alert('Please log in to add items to exhibitions');
      return;
    }
    setShowModal(true);
  };

  return (
    <>
      <div className="group perspective-1000">
        <div className="relative transform transition-all duration-300 sm:hover:scale-105">
          <div className="absolute inset-0 bg-amber-900 rounded-r-lg transform translate-x-1 sm:translate-x-4 translate-y-1 sm:translate-y-4 opacity-60 sm:opacity-80"></div>
          <div className="absolute inset-0 bg-stone-100 rounded-r-lg transform translate-x-0.5 sm:translate-x-3 translate-y-0.5 sm:translate-y-3 opacity-70 sm:opacity-90 hidden sm:block"></div>
          <div className="absolute inset-0 bg-stone-50 rounded-r-lg transform translate-x-0.5 sm:translate-x-2 translate-y-0.5 sm:translate-y-2 opacity-80 sm:opacity-95 hidden sm:block"></div>
          <div className="absolute inset-0 bg-amber-50 rounded-r-lg transform translate-x-0.5 sm:translate-x-1 translate-y-0.5 sm:translate-y-1 opacity-100"></div>
          <div className="absolute left-0 top-1 sm:top-2 bottom-1 sm:bottom-2 w-2 sm:w-3 bg-gradient-to-b from-amber-800 via-amber-900 to-amber-800 rounded-l border-r border-amber-700"></div>
          <div className="relative bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100 border border-amber-700 sm:border-2 rounded-r-lg shadow-md sm:shadow-lg overflow-hidden">
            <div 
              className="absolute inset-0 opacity-10 sm:opacity-20 mix-blend-multiply"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, transparent 20%, rgba(139, 69, 19, 0.1) 21%, rgba(139, 69, 19, 0.1) 25%, transparent 26%)`,
                backgroundSize: '6px 6px'
              }}
            ></div>
            
            {/* Book Content - responsive padding */}
            <div className="relative p-2 sm:p-4 ml-1 sm:ml-2">
              
              
              {image && (
                <div className="relative overflow-hidden rounded mb-2 sm:mb-4 border border-amber-600 shadow-inner">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-24 sm:h-32 md:h-40 lg:h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  
                  <div className="absolute inset-0 border-2 sm:border-4 border-amber-100 pointer-events-none opacity-20 sm:opacity-30"></div>
                </div>
              )}

              
              <h3 className="font-serif font-bold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 text-amber-900 leading-tight line-clamp-2 group-hover:text-amber-800 transition-colors drop-shadow-sm">
                {title}
              </h3>

              {/* Decorative Separator*/}
              <div className="flex items-center mb-2 sm:mb-3">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
                <div className="mx-1 sm:mx-2 text-amber-600 text-xs sm:text-sm">⚜</div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
              </div>

              {/* Description - fewer lines on mobile */}
              {description && (
                <p className="text-stone-700 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-3 leading-relaxed font-serif">
                  {description}
                </p>
              )}

              {/* Author & Provider - smaller text on mobile */}
              <div className="space-y-0.5 sm:space-y-1 mb-2 sm:mb-4">
                {author && (
                  <p className="text-amber-800 text-xs font-medium">
                    <span className="font-serif italic">Scribed by:</span> 
                    <span className="hidden sm:inline"> {author}</span>
                    <span className="sm:hidden"> {author.length > 20 ? author.substring(0, 20) + '...' : author}</span>
                  </p>
                )}
                {provider && (
                  <p className="text-amber-700 text-xs">
                    <span className="font-serif italic">Collection:</span> 
                    <span className="hidden sm:inline"> {provider}</span>
                    <span className="sm:hidden"> {provider.length > 20 ? provider.substring(0, 20) + '...' : provider}</span>
                  </p>
                )}
              </div>

              {/* Source Link - responsive */}
              {source && (
                <a
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-amber-700 hover:text-amber-800 text-xs underline decoration-dotted underline-offset-2 transition-colors mb-2 sm:mb-3"
                >
                  <span className="mr-1">📜</span>
                  <span className="hidden sm:inline">View The Source</span>
                  <span className="sm:hidden">Source</span>
                </a>
              )}

              {/* Add to Exhibition Button - responsive sizing */}
              {showAddButton && (
                <div className="pt-2 sm:pt-3 border-t border-amber-300">
                  <button
                    onClick={handleAddToExhibit}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-amber-50 py-1.5 sm:py-2.5 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 disabled:from-stone-400 disabled:to-stone-500 disabled:text-stone-200 shadow-md hover:shadow-lg sm:transform sm:hover:-translate-y-0.5"
                    disabled={!isLoggedIn}
                  >
                    {isLoggedIn ? (
                      <span className="flex items-center justify-center">
                        <span className="mr-1">📖</span>
                        <span className="hidden sm:inline">Add to Collection</span>
                        <span className="sm:hidden">Add</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <span className="mr-1">🔒</span>
                        <span className="hidden sm:inline">Login to Collect</span>
                        <span className="sm:hidden">Login</span>
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Corner Decorations - smaller and fewer on mobile */}
            <div className="absolute top-1 sm:top-2 right-1 sm:right-2 text-amber-600 opacity-30 sm:opacity-40 text-sm sm:text-xl">α</div>
            <div className="absolute bottom-1 sm:bottom-2 left-3 sm:left-6 text-amber-600 opacity-30 sm:opacity-40 text-sm sm:text-xl hidden sm:block">α</div>
            <div className="absolute bottom-0.5 sm:bottom-1 right-1 sm:right-2 text-amber-600 opacity-30 sm:opacity-40 text-xs sm:text-base">Ω</div>
            <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-amber-600 via-amber-500 to-amber-600 opacity-50"></div>
          </div>
        </div>
      </div>

      {showModal && (
        <AddToExhibitModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          itemData={itemData}
        />
      )}
    </>
  );
}