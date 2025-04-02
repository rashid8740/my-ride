import { SearchX } from 'lucide-react';

export default function NoResults({ searchQuery = '', filters = {} }) {
  // Check if there are any active filters
  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== 0 && value !== null && value !== undefined
  );
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <SearchX className="h-16 w-16 text-gray-300 mb-4" />
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No vehicles found
      </h3>
      
      <p className="text-gray-500 max-w-md mb-6">
        {searchQuery && hasActiveFilters ? (
          <>We couldn't find any vehicles matching "<span className="font-medium">{searchQuery}</span>" with your selected filters.</>
        ) : searchQuery ? (
          <>We couldn't find any vehicles matching "<span className="font-medium">{searchQuery}</span>".</>
        ) : hasActiveFilters ? (
          <>We couldn't find any vehicles with your selected filters.</>
        ) : (
          <>There are currently no vehicles available in our inventory.</>
        )}
      </p>
      
      {(searchQuery || hasActiveFilters) && (
        <div className="space-y-3">
          {searchQuery && (
            <button 
              className="block w-full px-4 py-2 text-sm font-medium text-orange-600 border border-orange-600 rounded-md hover:bg-orange-50 transition"
              onClick={() => window.location.search = ''}
            >
              Clear all and start over
            </button>
          )}
          
          {hasActiveFilters && (
            <button 
              className="block w-full px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              onClick={() => window.history.back()}
            >
              Go back
            </button>
          )}
        </div>
      )}
    </div>
  );
} 