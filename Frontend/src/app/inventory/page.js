// src/app/inventory/page.js
"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  Sliders,
  Filter,
  ChevronRight,
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import CarCard from "@/components/inventory/CarCard";
import SidebarFilters from "@/components/inventory/SidebarFilters";
import MobileFilters from "@/components/inventory/MobileFilters";
import { filterOptions, cars } from "./data";

export default function InventoryPage() {
  const [filters, setFilters] = useState({
    make: [],
    model: [],
    bodyType: [],
    year: [],
    transmission: [],
    fuel: [],
    features: [],
  });
  const [priceRange, setPriceRange] = useState([0, 150000]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOption, setSortOption] = useState("featured");
  const [gridView, setGridView] = useState("grid"); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState("");

  // Handle filter update
  const updateFilter = (category, values) => {
    setFilters({
      ...filters,
      [category]: values,
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      make: [],
      model: [],
      bodyType: [],
      year: [],
      transmission: [],
      fuel: [],
      features: [],
    });
    setPriceRange([0, 150000]);
    setSearchQuery("");
  };

  // Active filter count
  const activeFilterCount =
    Object.values(filters).flat().length +
    (priceRange[0] > 0 || priceRange[1] < 150000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header - Proper spacing to clear navbar */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white pt-34 md:pt-40 pb-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Our Inventory
            </h1>
            <p className="text-gray-300 max-w-2xl text-sm md:text-base mb-8">
              Browse our extensive collection of premium vehicles. Use the
              filters to find your perfect match or search for specific makes
              and models.
            </p>

            {/* Search Bar */}
            <div className="relative w-full max-w-2xl">
              <input
                type="text"
                placeholder="Search by make, model, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 pl-4 pr-12 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white">
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 py-3">
          <div className="flex items-center text-sm">
            <Link href="/" className="text-gray-500 hover:text-orange-500">
              Home
            </Link>
            <ChevronRight size={14} className="mx-2 text-gray-400" />
            <span className="text-gray-900 font-medium">Inventory</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <SidebarFilters
              filterOptions={filterOptions}
              filters={filters}
              updateFilter={updateFilter}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              resetFilters={resetFilters}
              activeFilterCount={activeFilterCount}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200 text-gray-700"
              >
                <Filter size={18} />
                <span className="font-medium">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Sorting & View Options */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-5 flex flex-wrap justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">{cars.length}</span>{" "}
                vehicles found
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {/* Sort Options */}
                <div className="relative">
                  <select
                    className="appearance-none bg-gray-50 border border-gray-200 rounded-md py-2 pl-3 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="year-new">Year: Newest First</option>
                    <option value="mileage-low">Mileage: Low to High</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  />
                </div>

                {/* Grid View Toggle */}
                <div className="flex rounded-md overflow-hidden border border-gray-200">
                  <button
                    className={`px-3 py-2 ${
                      gridView === "grid"
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-700"
                    }`}
                    onClick={() => setGridView("grid")}
                    aria-label="Grid view"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                  </button>
                  <button
                    className={`px-3 py-2 ${
                      gridView === "list"
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-700"
                    }`}
                    onClick={() => setGridView("list")}
                    aria-label="List view"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="8" y1="6" x2="21" y2="6"></line>
                      <line x1="8" y1="12" x2="21" y2="12"></line>
                      <line x1="8" y1="18" x2="21" y2="18"></line>
                      <line x1="3" y1="6" x2="3.01" y2="6"></line>
                      <line x1="3" y1="12" x2="3.01" y2="12"></line>
                      <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Car Grid */}
            <div
              className={`grid ${
                gridView === "grid"
                  ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              } gap-3 sm:gap-5`}
            >
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-1">
                <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                  Previous
                </button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`px-3 py-2 border rounded-md ${
                      page === 1
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <MobileFilters
        mobileFiltersOpen={mobileFiltersOpen}
        setMobileFiltersOpen={setMobileFiltersOpen}
        filterOptions={filterOptions}
        filters={filters}
        updateFilter={updateFilter}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        resetFilters={resetFilters}
        activeFilterCount={activeFilterCount}
        carsLength={cars.length}
      />

      <Footer />
    </div>
  );
}
