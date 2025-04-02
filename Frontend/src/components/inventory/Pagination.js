import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ totalPages, currentPage, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Only show a window of pages around the current page
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;
    
    if (currentPage <= 4) {
      // If current page is near the start
      return [...pages.slice(0, 5), '...', totalPages];
    } else if (currentPage >= totalPages - 3) {
      // If current page is near the end
      return [1, '...', ...pages.slice(totalPages - 5)];
    } else {
      // If current page is in the middle
      return [
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages
      ];
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <nav className="flex items-center space-x-1">
        {/* Previous page button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-md hover:bg-gray-100 ${
            currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        {/* Page numbers */}
        {getVisiblePages().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md ${
                currentPage === page
                  ? 'bg-orange-500 text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        ))}
        
        {/* Next page button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md hover:bg-gray-100 ${
            currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'
          }`}
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
} 