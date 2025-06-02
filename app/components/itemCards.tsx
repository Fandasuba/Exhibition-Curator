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
      <div className="border rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition-shadow">
        {image && (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-48 object-cover rounded mb-3"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        )}
        
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{title}</h3>
        
        {description && (
          <p className="text-gray-600 text-sm mb-2 line-clamp-3">{description}</p>
        )}
        
        {author && (
          <p className="text-gray-500 text-xs mb-1">
            <span className="font-medium">Author:</span> {author}
          </p>
        )}
        
        {provider && (
          <p className="text-gray-500 text-xs mb-1">
            <span className="font-medium">Provider:</span> {provider}
          </p>
        )}
        
        {source && (
          <a 
            href={source} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-xs underline inline-block mt-2"
          >
            View Source
          </a>
        )}

        {/* Conditionally render Add to Exhibit button */}
        {showAddButton && (
          <div className="mt-3 pt-3 border-t">
            <button
              onClick={handleAddToExhibit}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors disabled:bg-gray-400"
              disabled={!isLoggedIn}
            >
              {isLoggedIn ? 'Add to Exhibit' : 'Login to Add'}
            </button>
          </div>
        )}
      </div>

      {/* Add to Exhibit Modal */}
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