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
      {/* Book-like Card Container */}
      <div className="group perspective-1000">
        <div className="relative transform transition-all duration-300 hover:scale-105">
          {/* Layered Page Shadows - Multiple pages effect */}
          <div className="absolute inset-0 bg-amber-900 rounded-r-lg transform translate-x-4 translate-y-4 opacity-80"></div>
          <div className="absolute inset-0 bg-stone-100 rounded-r-lg transform translate-x-3 translate-y-3 opacity-90"></div>
          <div className="absolute inset-0 bg-stone-50 rounded-r-lg transform translate-x-2 translate-y-2 opacity-95"></div>
          <div className="absolute inset-0 bg-amber-50 rounded-r-lg transform translate-x-1 translate-y-1 opacity-100"></div>
          
          {/* Book Spine Effect */}
          <div className="absolute left-0 top-2 bottom-2 w-3 bg-gradient-to-b from-amber-800 via-amber-900 to-amber-800 rounded-l border-r border-amber-700"></div>
          
          {/* Main Book Body */}
          <div className="relative bg-gradient-to-br from-amber-50 via-stone-100 to-amber-100 border-2 border-amber-700 rounded-r-lg shadow-lg overflow-hidden">
            
            {/* Leather Texture Overlay */}
            <div 
              className="absolute inset-0 opacity-20 mix-blend-multiply"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, transparent 20%, rgba(139, 69, 19, 0.1) 21%, rgba(139, 69, 19, 0.1) 25%, transparent 26%), 
                                 radial-gradient(circle at 75% 75%, transparent 20%, rgba(160, 82, 45, 0.1) 21%, rgba(160, 82, 45, 0.1) 25%, transparent 26%),
                                 linear-gradient(45deg, transparent 45%, rgba(139, 69, 19, 0.05) 46%, rgba(139, 69, 19, 0.05) 54%, transparent 55%)`,
                backgroundSize: '8px 8px, 12px 12px, 4px 4px'
              }}
            ></div>
            
            {/* Book Content */}
            <div className="relative p-4 ml-2">
              
              {/* Image as Book Cover */}
              {image && (
                <div className="relative overflow-hidden rounded mb-4 border border-amber-600 shadow-inner">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  {/* Vintage Photo Frame Effect */}
                  <div className="absolute inset-0 border-4 border-amber-100 pointer-events-none opacity-30"></div>
                </div>
              )}

              {/* Book Title - Like embossed text */}
              <h3 className="font-serif font-bold text-lg mb-3 text-amber-900 leading-tight line-clamp-2 group-hover:text-amber-800 transition-colors drop-shadow-sm">
                {title}
              </h3>

              {/* Decorative Separator */}
              <div className="flex items-center mb-3">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
                <div className="mx-2 text-amber-600 text-sm">⚜</div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
              </div>

              {/* Description */}
              {description && (
                <p className="text-stone-700 text-sm mb-3 line-clamp-3 leading-relaxed font-serif">
                  {description}
                </p>
              )}

              {/* Author & Provider - Like manuscript details */}
              <div className="space-y-1 mb-4">
                {author && (
                  <p className="text-amber-800 text-xs font-medium">
                    <span className="font-serif italic">Scribed by:</span> {author}
                  </p>
                )}
                {provider && (
                  <p className="text-amber-700 text-xs">
                    <span className="font-serif italic">Collection:</span> {provider}
                  </p>
                )}
              </div>

              {/* Source Link */}
              {source && (
                <a
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-amber-700 hover:text-amber-800 text-xs underline decoration-dotted underline-offset-2 transition-colors mb-3"
                >
                  <span className="mr-1">📜</span>
                  View The Source
                </a>
              )}

              {/* Add to Exhibition Button */}
              {showAddButton && (
                <div className="pt-3 border-t border-amber-300">
                  <button
                    onClick={handleAddToExhibit}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-amber-50 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 disabled:from-stone-400 disabled:to-stone-500 disabled:text-stone-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    disabled={!isLoggedIn}
                  >
                    {isLoggedIn ? (
                      <span className="flex items-center justify-center">
                        <span className="mr-1">📖</span>
                        Add to Collection
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <span className="mr-1">🔒</span>
                        Login to Collect
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Corner Decorations - Alpha and Omega */}
            <div className="absolute top-2 right-2 text-amber-600 opacity-40 text-xl">α</div>
            <div className="absolute bottom-2 left-6 text-amber-600 opacity-40 text-xl">α</div>
            
            {/* Omega at bottom center */}
            <div className="absolute bottom-1 right-2 text-amber-600 opacity-40 text-base">Ω</div>
            
            {/* Page Edge Effect */}
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