import { useState, useEffect } from 'react';
import CarCard from './CarCard';
import Pagination from './Pagination';
import Loader from '../common/Loader';
import NoResults from '../common/NoResults';

export default function CarListingsGrid({ 
  cars, 
  isLoading, 
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  searchQuery = '',
  filters = {},
}) {
  const [sortOption, setSortOption] = useState('newest');
  const [displayedCars, setDisplayedCars] = useState([]);
  
  // Effect to handle the sorting of cars
  useEffect(() => {
    if (!cars || !cars.length) {
      setDisplayedCars([]);
      return;
    }

    let sortedCars = [...cars];
    
    switch (sortOption) {
      case 'priceAsc':
        sortedCars.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        sortedCars.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sortedCars.sort((a, b) => b.year - a.year);
        break;
      case 'oldest':
        sortedCars.sort((a, b) => a.year - b.year);
        break;
      default:
        break;
    }
    
    setDisplayedCars(sortedCars);
  }, [cars, sortOption]);

  if (isLoading) {
    return <Loader />;
  }
  
  if (!displayedCars.length) {
    return <NoResults searchQuery={searchQuery} filters={filters} />;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500">
          Showing <span className="font-semibold">{displayedCars.length}</span> results
        </p>
        <div className="flex items-center">
          <label htmlFor="sort" className="mr-2 text-sm text-gray-500">Sort by:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border border-gray-300 rounded-md text-sm bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedCars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination 
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
} 