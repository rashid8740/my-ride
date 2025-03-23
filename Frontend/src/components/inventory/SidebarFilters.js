// src/components/inventory/SidebarFilters.jsx
import FilterOption from "./FilterOption";
import PriceRangeSlider from "./PriceRangeSlider";

export default function SidebarFilters({
  filterOptions,
  filters,
  updateFilter,
  priceRange,
  setPriceRange,
  resetFilters,
  activeFilterCount,
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 sticky top-24">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-xs text-orange-500 hover:text-orange-600 font-medium"
          >
            Reset All
          </button>
        )}
      </div>

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
  );
}
