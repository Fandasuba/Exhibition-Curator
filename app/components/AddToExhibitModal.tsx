'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '../user-context';

interface ExhibitionItem {
  title: string;
  description?: string;
  author?: string;
  provider?: string;
  edmPreview?: string;
  source?: string;
}

interface Exhibition {
  id: string;
  title: string;
  name: string;
  savedItems?: ExhibitionItem[];
}

interface AddToExhibitModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemData: ExhibitionItem;
}

export default function AddToExhibitModal({ isOpen, onClose, itemData }: AddToExhibitModalProps) {
  const { user, isLoggedIn } = useUser();
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [selectedExhibition, setSelectedExhibition] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  // Fetch user's exhibitions when modal opens
  useEffect(() => {
    if (isOpen && isLoggedIn && user) {
      fetchExhibitions();
    }
  }, [isOpen, isLoggedIn, user]);

  const fetchExhibitions = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/exhibits?userId=${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch exhibitions');
      }
      const data: Exhibition[] = await response.json();
      setExhibitions(data);
    } catch (error) {
      console.error('Error fetching exhibitions:', error);
      setMessage('Failed to load exhibitions');
      setMessageType('error');
    }
  };

  const handleAddToExhibition = async () => {
    if (!selectedExhibition || !user) {
      setMessage('Please select an exhibition');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exhibitionId: selectedExhibition,
          userId: user.id,
          item: itemData
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add item to exhibition');
      }

      setMessage('Item added to exhibition successfully!');
      setMessageType('success');
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
        setMessage('');
        setSelectedExhibition('');
      }, 1500);

    } catch (error) {
      console.error('Error adding item to exhibition:', error);
      setMessage(error instanceof Error ? error.message : 'Failed to add item');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMessage('');
    setSelectedExhibition('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Add to Exhibition</h2>
        
        {/* Item preview */}
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <h3 className="font-medium text-sm mb-1">Adding item:</h3>
          <p className="text-sm text-gray-700 truncate">{itemData.title}</p>
        </div>

        {/* Exhibition selection */}
        {exhibitions.length > 0 ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Exhibition:
            </label>
            <select
              value={selectedExhibition}
              onChange={(e) => setSelectedExhibition(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose an exhibition...</option>
              {exhibitions.map((exhibition) => (
                <option key={exhibition.id} value={exhibition.id}>
                  {exhibition.name || exhibition.title} ({exhibition.savedItems?.length || 0} items)
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              You don&apo;t have any exhibitions yet. Create one first from the homepage.
            </p>
          </div>
        )}

        {/* Message display */}
        {message && (
          <div className={`mb-4 p-3 rounded ${
            messageType === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <p className="text-sm">{message}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleAddToExhibition}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium disabled:bg-gray-400"
            disabled={loading || !selectedExhibition || exhibitions.length === 0}
          >
            {loading ? 'Adding...' : 'Add to Exhibition'}
          </button>
        </div>
      </div>
    </div>
  );
}