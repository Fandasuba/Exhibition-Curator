'use client';
import React, { useState, useEffect, useRef } from 'react';
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
  
  // Accessibility refs
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLSelectElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && isLoggedIn && user) {
      fetchExhibitions();
    }
  }, [isOpen, isLoggedIn, user]);


  // Manages tabbing only in the modal for accessibility.
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (exhibitions.length > 0 && firstFocusableRef.current) {
          firstFocusableRef.current.focus();
        } else if (lastFocusableRef.current) {
          lastFocusableRef.current.focus();
        }
      }, 100);
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, select, input, [tabindex]:not([tabindex="-1"])'
          );
          
          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
            // controlls for shifting to to first and thento the last element. Apparently its common practice???
            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              }
            } else {
              if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
            }
          }
        }
      };

      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleTabKey);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('keydown', handleTabKey);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, exhibitions.length]);

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

      setMessage('Item added to exhibition successfully! The modal will close shortly.');
      setMessageType('success');
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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div 
        ref={modalRef}
        className="bg-white/90 backdrop-blur-sm p-8 rounded-lg max-w-sm w-full shadow-2xl border-2 border-amber-300"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 
          id="modal-title"
          className="text-xl font-bold mb-6 text-amber-900 border-b border-amber-400 pb-3"
        >
          Add to Exhibition
        </h2>
        
        <div 
          id="modal-description"
          className="mb-4 p-3 bg-amber-100 border-l-4 border-amber-600 rounded-lg"
        >
          <h3 className="font-medium text-amber-700 mr-2 text-lg">Adding item:</h3>
          <p className="text-amber-700 truncate">{itemData.title}</p>
        </div>

        {exhibitions.length > 0 ? (
          <div className="mb-4">
            <label 
              htmlFor="exhibition-select"
              className="block text-sm font-medium text-amber-900 mb-2"
            >
              Select Exhibition:
            </label>
            <select
              id="exhibition-select"
              ref={firstFocusableRef}
              value={selectedExhibition}
              onChange={(e) => setSelectedExhibition(e.target.value)}
              className="w-full p-2 border border-amber-400 rounded bg-amber-100 text-amber-800 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500 transition-colors"
              aria-describedby="exhibition-help"
            >
              <option value="">Choose an exhibition...</option>
              {exhibitions.map((exhibition) => (
                <option key={exhibition.id} value={exhibition.id}>
                  {exhibition.name || exhibition.title} ({exhibition.saveditems?.length || 0} items)
                </option>
              ))}
            </select>
            <p id="exhibition-help" className="sr-only">
              Select which exhibition to add this historical artifact to
            </p>
          </div>
        ) : (
          <div 
            className="mb-4 p-3 bg-yellow-100 border border-yellow-600 rounded"
            role="alert"
          >
            <p className="text-sm text-yellow-800">
              You don't have any exhibitions yet. Create one first from the homepage.
            </p>
          </div>
        )}

        {message && (
          <div 
            className={`mb-4 p-3 rounded border ${
              messageType === 'success'
                ? 'bg-green-100 border-green-400 text-green-800'
                : 'bg-red-100 border-red-400 text-red-800'
            }`}
            role="alert"
            aria-live="polite"
          >
            <p className="text-sm">{message}</p>
          </div>
        )}

        <div className="flex justify-center space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded font-medium border border-amber-600 hover:border-amber-500 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            disabled={loading}
            aria-label="Cancel and close modal"
          >
            Cancel
          </button>
          <button
            ref={exhibitions.length === 0 ? lastFocusableRef : undefined}
            onClick={handleAddToExhibition}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded font-medium border border-amber-600 hover:border-amber-500 disabled:bg-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            disabled={loading || !selectedExhibition || exhibitions.length === 0}
            aria-label={loading ? 'Adding item to exhibition, please wait' : `Add ${itemData.title} to selected exhibition`}
          >
            {loading ? 'Adding...' : 'Add to Exhibition'}
          </button>
        </div>
      </div>
    </div>
  );
}