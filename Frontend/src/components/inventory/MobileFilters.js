// src/components/inventory/MobileFilters.jsx
import { X } from "lucide-react";
import FilterOption from "./FilterOption";
import PriceRangeSlider from "./PriceRangeSlider";

export default function MobileFilters({
  mobileFiltersOpen,
  setMobileFiltersOpen,
  filterOptions,
  filters,
  updateFilter,
  priceRange,
  setPriceRange,
  resetFilters,
  activeFilterCount,
  carsLength,
}) {
  return (
    <div
      className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity ${
        mobileFiltersOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => setMobileFiltersOpen(false)}
    >
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl transform transition-transform ${
          mobileFiltersOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Price Range */}
            <div className="border-b border-gray-200 py-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Price Range
              </h3>
              <PriceRangeSlider
                min={0}
                max={150000}
                value={priceRange}
                onChange={setPriceRange}
              />
            </div>

            {/* Filter Categories */}
            <FilterOption
              label="Make"
              options={filterOptions.make}
              selected={filters.make}
              onChange={(values) => updateFilter("make", values)}
            />

            <FilterOption
              label="Body Type"
              options={filterOptions.bodyType}
              selected={filters.bodyType}
              onChange={(values) => updateFilter("bodyType", values)}
            />

            <FilterOption
              label="Year"
              options={filterOptions.year}
              selected={filters.year}
              onChange={(values) => updateFilter("year", values)}
            />

            <FilterOption
              label="Transmission"
              options={filterOptions.transmission}
              selected={filters.transmission}
              onChange={(values) => updateFilter("transmission", values)}
            />

            <FilterOption
              label="Fuel Type"
              options={filterOptions.fuel}
              selected={filters.fuel}
              onChange={(values) => updateFilter("fuel", values)}
            />

            <FilterOption
              label="Features"
              options={filterOptions.features}
              selected={filters.features}
              onChange={(values) => updateFilter("features", values)}
            />
          </div>

          <div className="p-4 border-t border-gray-200 space-y-3">
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="w-full py-2 text-orange-500 font-medium border border-orange-500 rounded-md hover:bg-orange-50"
              >
                Reset All Filters
              </button>
            )}

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600"
            >
              Show {carsLength} Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
