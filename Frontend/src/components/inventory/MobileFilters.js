// src/components/inventory/MobileFilters.jsx
import { X, Sliders, Tag, Calendar, Fuel, Settings, Filter, ArrowRight } from "lucide-react";

export default function MobileFilters({
  filterOptions,
  filters,
  updateFilter,
  resetFilters,
  closeFilters
}) {
  // Count active filters
  const getActiveFilterCount = () => {
    return Object.values(filters).filter(val => val !== "").length;
  };
  
  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex" onClick={closeFilters}>
      <div 
        className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Sliders className="h-5 w-5 mr-2 text-orange-500" />
              Filters
            </h2>
            <button
              onClick={closeFilters}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Category filter */}
            <div className="p-4 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Tag className="h-4 w-4 mr-2 text-gray-500" />
                Category
              </div>
              <select
                name="category"
                value={filters.category}
                onChange={updateFilter}
                className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-700"
              >
                <option value="">All Categories</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="truck">Truck</option>
                <option value="coupe">Coupe</option>
                <option value="convertible">Convertible</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
            
            {/* Price Range */}
            <div className="p-4 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <ArrowRight className="h-4 w-4 mr-2 text-gray-500" />
                Price Range
              </div>
              <div className="flex gap-3 mb-3">
                <div className="flex-1">
                  <label htmlFor="minPrice" className="block text-xs text-gray-500 mb-1">
                    Min Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      id="minPrice"
                      name="minPrice"
                      placeholder="0"
                      value={filters.minPrice}
                      onChange={updateFilter}
                      className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label htmlFor="maxPrice" className="block text-xs text-gray-500 mb-1">
                    Max Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      id="maxPrice"
                      name="maxPrice"
                      placeholder="Any"
                      value={filters.maxPrice}
                      onChange={updateFilter}
                      className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Year Range */}
            <div className="p-4 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                Year Range
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label htmlFor="minYear" className="block text-xs text-gray-500 mb-1">
                    Min Year
                  </label>
                  <input
                    type="number"
                    id="minYear"
                    name="minYear"
                    placeholder="Any"
                    value={filters.minYear}
                    onChange={updateFilter}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="maxYear" className="block text-xs text-gray-500 mb-1">
                    Max Year
                  </label>
                  <input
                    type="number"
                    id="maxYear"
                    name="maxYear"
                    placeholder="Any"
                    value={filters.maxYear}
                    onChange={updateFilter}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>
            
            {/* Fuel Type */}
            <div className="p-4 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Fuel className="h-4 w-4 mr-2 text-gray-500" />
                Fuel Type
              </div>
              <select
                name="fuel"
                value={filters.fuel}
                onChange={updateFilter}
                className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-700"
              >
                <option value="">All Fuel Types</option>
                <option value="gasoline">Gasoline</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
                <option value="plugin_hybrid">Plug-in Hybrid</option>
              </select>
            </div>
            
            {/* Transmission */}
            <div className="p-4 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Settings className="h-4 w-4 mr-2 text-gray-500" />
                Transmission
              </div>
              <select
                name="transmission"
                value={filters.transmission}
                onChange={updateFilter}
                className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-700"
              >
                <option value="">All Transmissions</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
                <option value="cvt">CVT</option>
                <option value="semi-automatic">Semi-Automatic</option>
              </select>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 space-y-3 bg-gray-50">
            {activeFilterCount > 0 && (
              <div className="text-xs text-gray-500 mb-2">
                {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} active
              </div>
            )}
            
            <div className="flex gap-3">
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                  className="flex-1 py-2.5 text-orange-600 bg-white font-medium border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors text-sm"
              >
                  Clear All
              </button>
            )}

            <button
                onClick={closeFilters}
                className={`${activeFilterCount > 0 ? 'flex-1' : 'w-full'} py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center text-sm`}
            >
                <Filter className="h-4 w-4 mr-1.5" />
                Apply Filters
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
