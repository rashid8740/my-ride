export default function Loader() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-16">
      <div className="animate-pulse space-y-8 w-full max-w-6xl">
        {/* Filters skeleton */}
        <div className="flex justify-between mb-4">
          <div className="h-8 bg-gray-200 rounded-md w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded-md w-1/6"></div>
        </div>
        
        {/* Cards grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
              {/* Image placeholder */}
              <div className="h-48 bg-gray-200"></div>
              
              {/* Content placeholders */}
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="pt-2 flex justify-between">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 