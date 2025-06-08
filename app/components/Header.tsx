"use client";
import React from 'react';
import Link from 'next/link';
import { useUser } from '../user-context';

const Header: React.FC = () => {
  const { isLoggedIn, loading } = useUser();

  if (loading) {
    return (
      <header className="bg-gradient-to-r from-stone-100 via-amber-50 to-stone-200 shadow-md border-b border-stone-300">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-lg sm:text-xl font-serif font-bold text-amber-800">Historical Archives</h1>
            <div className="flex space-x-2 sm:space-x-4">
              <div className="w-16 sm:w-20 h-8 bg-stone-200 animate-pulse rounded-xl"></div>
              <div className="w-20 sm:w-32 h-8 bg-stone-200 animate-pulse rounded-xl"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 border-b-2 border-amber-600 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          {/* Logo/Title */}
          <Link href="/">
            <h1 className="text-lg sm:text-xl font-serif font-bold text-amber-100 hover:text-amber-50 cursor-pointer transition-colors duration-200 drop-shadow-sm flex items-center">
              🏛️ 
              <span className="ml-2">
                <span className="sm:hidden">Archives Curator</span>
                <span className="hidden sm:inline">Historical Archives Curator</span>
              </span>
            </h1>
          </Link>
         
          {/* Navigation */}
          <nav className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Link href="/">
              <button className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl border border-stone-800 hover:border-stone-1000 transition-all duration-200 font-medium backdrop-blur-sm text-sm sm:text-base">
                {isLoggedIn ? (
                  <>
                    <span className="sm:hidden">Account ⚜</span>
                    <span className="hidden sm:inline">Account ⚜</span>
                  </>
                ) : (
                  <>
                    <span className="sm:hidden">Login ⚜</span>
                    <span className="hidden sm:inline">Login ⚜</span>
                  </>
                )}
              </button>
            </Link>
           
            <Link href="/artefacts">
              <button className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl border border-stone-800 hover:border-stone-1000 transition-all duration-200 font-medium shadow-md text-sm sm:text-base">
                <span className="sm:hidden">📜 Browse</span>
                <span className="hidden sm:inline">📜 Browse Collection</span>
              </button>
            </Link>
           
            <Link href="/about">
              <button className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl border border-stone-800 hover:border-stone-1000 transition-all duration-200 font-medium shadow-md text-sm sm:text-base">
                <span className="sm:hidden">🛈 About</span>
                <span className="hidden sm:inline">🛈 About Curator</span>
              </button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;