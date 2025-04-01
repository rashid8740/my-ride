"use client";

export default function TailwindTestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Tailwind CSS Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Basic colors */}
        <div className="p-6 bg-red-500 text-white rounded-lg shadow-lg">
          Red Background
        </div>
        <div className="p-6 bg-green-500 text-white rounded-lg shadow-lg">
          Green Background
        </div>
        <div className="p-6 bg-blue-500 text-white rounded-lg shadow-lg">
          Blue Background
        </div>
        
        {/* Hover effects */}
        <div className="p-6 bg-yellow-200 hover:bg-yellow-400 transition-colors duration-300 rounded-lg shadow-lg">
          Hover me (Yellow)
        </div>
        <div className="p-6 bg-purple-200 hover:bg-purple-400 transition-colors duration-300 rounded-lg shadow-lg">
          Hover me (Purple)
        </div>
        <div className="p-6 bg-pink-200 hover:bg-pink-400 transition-colors duration-300 rounded-lg shadow-lg">
          Hover me (Pink)
        </div>
        
        {/* Custom primary color */}
        <div className="p-6 bg-primary-500 text-white rounded-lg shadow-lg">
          Primary Color
        </div>
        <div className="p-6 bg-primary-700 text-white rounded-lg shadow-lg">
          Primary Dark
        </div>
        <div className="p-6 bg-primary-300 text-white rounded-lg shadow-lg">
          Primary Light
        </div>
      </div>
      
      <div className="mt-10 text-center">
        <p className="text-sm text-gray-500">If you see correctly styled colorful boxes, Tailwind CSS is working!</p>
        <a href="/" className="mt-4 inline-block px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">
          Return Home
        </a>
      </div>
    </div>
  );
} 