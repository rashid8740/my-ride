// src/components/product/ProductDetails.js
"use client";
import { useState } from "react";
import { Check, Award, Clock, Car, Info, Gauge, Fuel } from "lucide-react";

export default function ProductDetails({ car }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
            activeTab === "overview"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("features")}
          className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
            activeTab === "features"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Features & Options
        </button>
        <button
          onClick={() => setActiveTab("specifications")}
          className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
            activeTab === "specifications"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Technical Specifications
        </button>
        <button
          onClick={() => setActiveTab("location")}
          className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
            activeTab === "location"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Location
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            {/* Key Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Car size={20} className="text-orange-500" />
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-1">Type</div>
                <div className="font-semibold">{car.condition}</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Gauge size={20} className="text-orange-500" />
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-1">Mileage</div>
                <div className="font-semibold">
                  {car.mileage.toLocaleString()} mi
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Fuel size={20} className="text-orange-500" />
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-1">Fuel Type</div>
                <div className="font-semibold">{car.fuelType}</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Award size={20} className="text-orange-500" />
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-1">Body Type</div>
                <div className="font-semibold">{car.bodyType}</div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Description
            </h2>
            <p className="text-gray-700 mb-8 leading-relaxed">
              {car.description}
            </p>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Key Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {car.features.slice(0, 8).map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1 mr-2 text-orange-500">
                      <Check size={16} />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              {car.features.length > 8 && (
                <button
                  onClick={() => setActiveTab("features")}
                  className="mt-4 text-orange-500 hover:text-orange-600 text-sm font-medium"
                >
                  View All Features
                </button>
              )}
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Vehicle Overview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Make</span>
                  <span className="font-medium text-gray-900">{car.make}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Model</span>
                  <span className="font-medium text-gray-900">{car.model}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Year</span>
                  <span className="font-medium text-gray-900">{car.year}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Body Type</span>
                  <span className="font-medium text-gray-900">
                    {car.bodyType}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Mileage</span>
                  <span className="font-medium text-gray-900">
                    {car.mileage.toLocaleString()} mi
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">VIN</span>
                  <span className="font-medium text-gray-900">{car.vin}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Fuel Type</span>
                  <span className="font-medium text-gray-900">
                    {car.fuelType}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Transmission</span>
                  <span className="font-medium text-gray-900">
                    {car.transmission}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Drivetrain</span>
                  <span className="font-medium text-gray-900">
                    {car.drivetrain}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Exterior Color</span>
                  <span className="font-medium text-gray-900">
                    {car.exteriorColor}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Interior Color</span>
                  <span className="font-medium text-gray-900">
                    {car.interiorColor}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Stock #</span>
                  <span className="font-medium text-gray-900">
                    {car.stockNumber}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === "features" && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Features & Options
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                    <Info size={20} className="text-orange-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Comfort & Convenience
                  </h3>
                </div>
                <div className="space-y-3 pl-3 border-l-2 border-orange-100">
                  {car.features
                    .filter(
                      (f) =>
                        f.toLowerCase().includes("seat") ||
                        f.toLowerCase().includes("climate") ||
                        f.toLowerCase().includes("sunroof") ||
                        f.toLowerCase().includes("ambient") ||
                        f.toLowerCase().includes("keyless")
                    )
                    .map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="flex-shrink-0 mt-1 mr-2 text-orange-500">
                          <Check size={16} />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                    <Info size={20} className="text-orange-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Technology & Entertainment
                  </h3>
                </div>
                <div className="space-y-3 pl-3 border-l-2 border-orange-100">
                  {car.features
                    .filter(
                      (f) =>
                        f.toLowerCase().includes("display") ||
                        f.toLowerCase().includes("sound") ||
                        f.toLowerCase().includes("apple") ||
                        f.toLowerCase().includes("android") ||
                        f.toLowerCase().includes("charging") ||
                        f.toLowerCase().includes("head-up")
                    )
                    .map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="flex-shrink-0 mt-1 mr-2 text-orange-500">
                          <Check size={16} />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                    <Info size={20} className="text-orange-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Safety & Driver Assistance
                  </h3>
                </div>
                <div className="space-y-3 pl-3 border-l-2 border-orange-100">
                  {car.features
                    .filter(
                      (f) =>
                        f.toLowerCase().includes("assist") ||
                        f.toLowerCase().includes("safety") ||
                        f.toLowerCase().includes("blind") ||
                        f.toLowerCase().includes("lane") ||
                        f.toLowerCase().includes("driver") ||
                        f.toLowerCase().includes("parking")
                    )
                    .map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="flex-shrink-0 mt-1 mr-2 text-orange-500">
                          <Check size={16} />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                    <Info size={20} className="text-orange-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Exterior & Design
                  </h3>
                </div>
                <div className="space-y-3 pl-3 border-l-2 border-orange-100">
                  {car.features
                    .filter(
                      (f) =>
                        f.toLowerCase().includes("wheel") ||
                        f.toLowerCase().includes("exterior") ||
                        f.toLowerCase().includes("light") ||
                        f.toLowerCase().includes("amg") ||
                        f.toLowerCase().includes("package")
                    )
                    .map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="flex-shrink-0 mt-1 mr-2 text-orange-500">
                          <Check size={16} />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Other Features Section */}
              {car.features.filter(
                (feature) =>
                  !feature.toLowerCase().includes("seat") &&
                  !feature.toLowerCase().includes("climate") &&
                  !feature.toLowerCase().includes("sunroof") &&
                  !feature.toLowerCase().includes("ambient") &&
                  !feature.toLowerCase().includes("keyless") &&
                  !feature.toLowerCase().includes("display") &&
                  !feature.toLowerCase().includes("sound") &&
                  !feature.toLowerCase().includes("apple") &&
                  !feature.toLowerCase().includes("android") &&
                  !feature.toLowerCase().includes("charging") &&
                  !feature.toLowerCase().includes("head-up") &&
                  !feature.toLowerCase().includes("assist") &&
                  !feature.toLowerCase().includes("safety") &&
                  !feature.toLowerCase().includes("blind") &&
                  !feature.toLowerCase().includes("lane") &&
                  !feature.toLowerCase().includes("driver") &&
                  !feature.toLowerCase().includes("parking") &&
                  !feature.toLowerCase().includes("wheel") &&
                  !feature.toLowerCase().includes("exterior") &&
                  !feature.toLowerCase().includes("light") &&
                  !feature.toLowerCase().includes("amg") &&
                  !feature.toLowerCase().includes("package")
              ).length > 0 && (
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                      <Info size={20} className="text-orange-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Additional Features
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-3 border-l-2 border-orange-100">
                    {car.features
                      .filter(
                        (feature) =>
                          !feature.toLowerCase().includes("seat") &&
                          !feature.toLowerCase().includes("climate") &&
                          !feature.toLowerCase().includes("sunroof") &&
                          !feature.toLowerCase().includes("ambient") &&
                          !feature.toLowerCase().includes("keyless") &&
                          !feature.toLowerCase().includes("display") &&
                          !feature.toLowerCase().includes("sound") &&
                          !feature.toLowerCase().includes("apple") &&
                          !feature.toLowerCase().includes("android") &&
                          !feature.toLowerCase().includes("charging") &&
                          !feature.toLowerCase().includes("head-up") &&
                          !feature.toLowerCase().includes("assist") &&
                          !feature.toLowerCase().includes("safety") &&
                          !feature.toLowerCase().includes("blind") &&
                          !feature.toLowerCase().includes("lane") &&
                          !feature.toLowerCase().includes("driver") &&
                          !feature.toLowerCase().includes("parking") &&
                          !feature.toLowerCase().includes("wheel") &&
                          !feature.toLowerCase().includes("exterior") &&
                          !feature.toLowerCase().includes("light") &&
                          !feature.toLowerCase().includes("amg") &&
                          !feature.toLowerCase().includes("package")
                      )
                      .map((feature, idx) => (
                        <div key={idx} className="flex items-start">
                          <div className="flex-shrink-0 mt-1 mr-2 text-orange-500">
                            <Check size={16} />
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === "specifications" && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Technical Specifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                    <Car size={20} className="text-orange-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Engine & Performance
                  </h3>
                </div>
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <div className="divide-y divide-gray-200">
                    <div className="flex justify-between p-4 bg-gray-50">
                      <span className="text-gray-600">Engine</span>
                      <span className="font-medium text-gray-900">
                        {car.specifications.engine}
                      </span>
                    </div>
                    <div className="flex justify-between p-4">
                      <span className="text-gray-600">Horsepower</span>
                      <span className="font-medium text-gray-900">
                        {car.specifications.horsepower}
                      </span>
                    </div>
                    <div className="flex justify-between p-4 bg-gray-50">
                      <span className="text-gray-600">Torque</span>
                      <span className="font-medium text-gray-900">
                        {car.specifications.torque}
                      </span>
                    </div>
                    <div className="flex justify-between p-4">
                      <span className="text-gray-600">Acceleration</span>
                      <span className="font-medium text-gray-900">
                        {car.specifications.acceleration}
                      </span>
                    </div>
                    <div className="flex justify-between p-4 bg-gray-50">
                      <span className="text-gray-600">Top Speed</span>
                      <span className="font-medium text-gray-900">
                        {car.specifications.topSpeed}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                    <Fuel size={20} className="text-orange-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Fuel & Efficiency
                  </h3>
                </div>
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <div className="divide-y divide-gray-200">
                    <div className="flex justify-between p-4 bg-gray-50">
                      <span className="text-gray-600">Fuel Economy</span>
                      <span className="font-medium text-gray-900">
                        {car.specifications.fuelEconomy}
                      </span>
                    </div>
                    <div className="flex justify-between p-4">
                      <span className="text-gray-600">Fuel Tank</span>
                      <span className="font-medium text-gray-900">
                        {car.specifications.fuelTank}
                      </span>
                    </div>
                    <div className="flex justify-between p-4 bg-gray-50">
                      <span className="text-gray-600">Fuel Type</span>
                      <span className="font-medium text-gray-900">
                        {car.fuelType}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                    <Info size={20} className="text-orange-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Dimensions
                  </h3>
                </div>
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <div className="divide-y divide-gray-200">
                    <div className="flex justify-between p-4 bg-gray-50">
                      <span className="text-gray-600">Length</span>
                      <span className="font-medium text-gray-900">
                        {car.specifications.length}
                      </span>
                    </div>
                    <div className="flex justify-between p-4">
                      <span className="text-gray-600">Width</span>
                      <span className="font-medium text-gray-900">
                        {car.specifications.width}
                      </span>
                    </div>
                    <div className="flex justify-between p-4 bg-gray-50">
                      <span className="text-gray-600">Height</span>
                      <span className="font-medium text-gray-900">
                        {car.specifications.height}
                      </span>
                    </div>
                    <div className="flex justify-between p-4">
                      <span className="text-gray-600">Wheelbase</span>
                      <span className="font-medium text-gray-900">
                        {car.specifications.wheelbase}
                      </span>
                    </div>
                    <div className="flex justify-between p-4 bg-gray-50">
                      <span className="text-gray-600">Ground Clearance</span>
                      <span className="font-medium text-gray-900">
                        {car.specifications.groundClearance}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                    <Info size={20} className="text-orange-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Capacity</h3>
                </div>
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <div className="divide-y divide-gray-200">
                    <div className="flex justify-between p-4 bg-gray-50">
                      <span className="text-gray-600">Seating</span>
                      <span className="font-medium text-gray-900">
                        {car.specifications.seatingCapacity}
                      </span>
                    </div>
                    <div className="flex justify-between p-4">
                      <span className="text-gray-600">Cargo Capacity</span>
                      <span className="font-medium text-gray-900">
                        {car.specifications.cargoCapacity}
                      </span>
                    </div>
                    <div className="flex justify-between p-4 bg-gray-50">
                      <span className="text-gray-600">Curb Weight</span>
                      <span className="font-medium text-gray-900">
                        {car.specifications.weight}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Location Tab */}
        {activeTab === "location" && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Vehicle Location
            </h2>

            <div className="flex items-start bg-gray-50 p-6 rounded-lg mb-6">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mr-4 flex-shrink-0">
                <MapPin size={24} className="text-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  AutoDecar Dealership
                </h3>
                <p className="text-gray-700 mb-1">
                  1234 Auto Drive, Miami, FL 33101
                </p>
                <p className="text-gray-600 mb-4">{car.location}</p>

                <div className="flex flex-wrap gap-4">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      "1234 Auto Drive, Miami, FL 33101"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium text-sm"
                  >
                    <span>Get Directions</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>

                  <a
                    href="tel:+15551234567"
                    className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium text-sm"
                  >
                    <span>Contact Dealer</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center p-4">
                <p className="text-gray-600 font-medium mb-2">
                  Map Integration
                </p>
                <p className="text-gray-500 text-sm">
                  In a production environment, this would be replaced with a
                  Google Maps or similar map integration showing the dealership
                  location.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom styles for hiding scrollbars while maintaining functionality */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
