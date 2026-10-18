import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-[#A82020] text-[#F3E6D5] flex items-center justify-center shadow-lg">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="font-display text-4xl sm:text-5xl font-black text-[#6C1A1A] dark:text-[#F3E6D5]">
        404 — Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-[#5C2222] dark:text-[#C9B29B] max-w-md">
        The forensic route you requested does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#A82020] hover:bg-[#8C1919] text-[#F3E6D5] text-xs font-bold shadow-md transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};
