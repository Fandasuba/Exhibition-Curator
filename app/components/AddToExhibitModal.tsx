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
  saveditems?: ExhibitionItem[];
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
      const result = await response.json();
      const exhibitions: Exhibition[] = result.data || result;
      setExhibitions(exhibitions);
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

      setMessage('Item added to exhibition successfully! The modal will now close shortly.');
      setMessageType('success');
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
        setMessage('');
        setSelectedExhibition('');
      }, 1750);

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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded border-2 border-gray-600 max-w-md w-full mx-4 shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-blue-400 border-b border-gray-600 pb-2">Add to Exhibition</h2>
        
        {/* Item preview */}
        <div className="mb-4 p-3 bg-gray-700 rounded border border-gray-600">
          <h3 className="font-medium text-sm mb-1 text-blue-400">Adding item:</h3>
          <p className="text-sm text-gray-300 truncate">{itemData.title}</p>
        </div>

        {/* Exhibition selection */}
        {exhibitions.length > 0 ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Exhibition:
            </label>
            <select
              value={selectedExhibition}
              onChange={(e) => setSelectedExhibition(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            >
              <option value="">Choose an exhibition...</option>
              {exhibitions.map((exhibition) => (
                <option key={exhibition.id} value={exhibition.id} className="bg-gray-700">
                  {exhibition.name || exhibition.title} ({exhibition.saveditems?.length || 0} items)
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-yellow-900 border border-yellow-600 rounded">
            <p className="text-sm text-yellow-300">
              You don&apos;t have any exhibitions yet. Create one first from the homepage.
            </p>
          </div>
        )}

        {/* Message display */}
        {message && (
          <div className={`mb-4 p-3 rounded border ${
            messageType === 'success' 
              ? 'bg-green-900 border-green-600 text-green-300' 
              : 'bg-red-900 border-red-600 text-red-300'
          }`}>
            <p className="text-sm">{message}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-gray-300 rounded font-medium border border-gray-500 hover:border-gray-400 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleAddToExhibition}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium disabled:bg-gray-600 disabled:text-gray-400 border border-blue-500 hover:border-blue-400 disabled:border-gray-500 transition-colors"
            disabled={loading || !selectedExhibition || exhibitions.length === 0}
          >
            {loading ? 'Adding...' : 'Add to Exhibition'}
          </button>
        </div>
      </div>
    </div>
  );
}