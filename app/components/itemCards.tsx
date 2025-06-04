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
  showAddButton?: boolean; // Add this prop to conditionally show the button
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

  // Create item object to pass to modal
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
      <div className="border-2 border-gray-600 rounded bg-gray-800 p-4 shadow-lg hover:shadow-xl hover:border-blue-500 transition-all duration-300 group">
        {image && (
          <div className="relative overflow-hidden rounded mb-3 border border-gray-700">
            <img
              src={image}
              alt={title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}
       
        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-blue-400 group-hover:text-blue-300 transition-colors">
          {title}
        </h3>
       
        {description && (
          <p className="text-gray-300 text-sm mb-2 line-clamp-3">
            {description}
          </p>
        )}
       
        {author && (
          <p className="text-gray-400 text-xs mb-1">
            <span className="font-medium text-blue-400">Author:</span> {author}
          </p>
        )}
       
        {provider && (
          <p className="text-gray-400 text-xs mb-1">
            <span className="font-medium text-blue-400">Provider:</span> {provider}
          </p>
        )}
       
        {source && (
          <a
            href={source}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-xs underline inline-block mt-2 transition-colors"
          >
            View Source
          </a>
        )}
        
        {showAddButton && (
          <div className="mt-3 pt-3 border-t border-gray-600">
            <button
              onClick={handleAddToExhibit}
              className="w-full bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded text-sm font-medium transition-all duration-200 disabled:bg-gray-600 disabled:text-gray-400 border border-green-500 hover:border-green-400 disabled:border-gray-500"
              disabled={!isLoggedIn}
            >
              {isLoggedIn ? 'Add to Exhibit' : 'Login to Add'}
            </button>
          </div>
        )}
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