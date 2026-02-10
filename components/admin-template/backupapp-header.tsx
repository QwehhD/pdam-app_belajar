"use client"; // Wajib jika kamu pakai Next.js App Router

import React, { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Deklarasikan icon sebagai komponen kecil agar TSX tidak bingung
  const MenuIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
  );

  const CloseIcon = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <nav className="bg-blue-50/50 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-blue-700">
              Brand<span className="text-blue-400">Logo</span>
            </Link>
          </div>

          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-slate-600 hover:text-blue-600">Home</Link>
            <Link href="/about" className="text-slate-600 hover:text-blue-600">About</Link>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all">
              Get Started
            </button>
          </div>

          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-blue-600 p-2"
              aria-label="Toggle menu"
            >
              {/* Memanggil komponen icon lebih aman daripada menulis tag di sini */}
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-blue-50 p-4 space-y-2">
          <Link href="/" className="block text-slate-600 p-2 hover:bg-blue-50">Home</Link>
          <Link href="/about" className="block text-slate-600 p-2 hover:bg-blue-50">About</Link>
        </div>
      )}
    </nav>
  );
}