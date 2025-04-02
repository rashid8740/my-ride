// src/components/inventory/SidebarFilters.jsx
import { ChevronDown, Tag, Calendar, Fuel, Settings, ArrowRight } from "lucide-react";
import { useState } from "react";
import PriceRangeSlider from "./PriceRangeSlider";

// Filter Section with Collapsible Content
const FilterSection = ({ title, icon: Icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="py-4 border-b border-gray-100">
      <button 
        className="flex items-center justify-between w-full text-left" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center text-sm font-medium text-gray-900">
          {Icon && <Icon className="h-4 w-4 mr-2 text-gray-500" />}
          {title}
        </div>
        <ChevronDown 
          className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
        />
      </button>
      
      {isOpen && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default function SidebarFilters({
  filterOptions,
  filters,
  updateFilter,
  resetFilters
}) {
  return (
    <>
      {/* Category filter */}
      <FilterSection title="Category" icon={Tag}>
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
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range" icon={ArrowRight}>
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
      </FilterSection>

      {/* Year Range */}
      <FilterSection title="Year Range" icon={Calendar}>
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
      </FilterSection>

      {/* Fuel Type */}
      <FilterSection title="Fuel Type" icon={Fuel}>
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
      </FilterSection>

      {/* Transmission */}
      <FilterSection title="Transmission" icon={Settings}>
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
      </FilterSection>
    </>
  );
}
