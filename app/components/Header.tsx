"use client";
import React from 'react';
import Link from 'next/link';
import { useUser } from '../user-context';
const Header: React.FC = () => {
  const { isLoggedIn, loading } = useUser();

  if (loading) {
    return (
      <header className="bg-white shadow-md border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Exhibition Curator</h1>
            <div className="flex space-x-4">
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-32 h-8 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-gray-900 border-b-2 border-blue-500 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <h1 className="text-xl font-bold text-blue-400 hover:text-blue-300 cursor-pointer transition-colors duration-200 drop-shadow-sm">
              Exhibition Curator
            </h1>
          </Link>
         
          <nav className="flex space-x-4">
            <Link href="/">
              <button className="px-4 py-2 text-gray-300 hover:text-blue-400 hover:bg-gray-800 rounded border border-gray-600 hover:border-blue-500 transition-all duration-200 font-medium">
                {isLoggedIn ? 'Account' : 'Login'}
              </button>
            </Link>
           
            <Link href="/artefacts">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded border border-blue-500 hover:border-blue-400 transition-all duration-200 font-medium shadow-md">
                Browse Collection
              </button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;