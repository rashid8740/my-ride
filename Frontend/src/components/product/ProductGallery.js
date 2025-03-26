// src/components/product/ProductGallery.js
"use client";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export default function ProductGallery({ images }) {
  const [fullscreenActive, setFullscreenActive] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");

  // Filter images by type
  const filteredImages =
    activeFilter === "all"
      ? images
      : images.filter((img) => img.type === activeFilter);

  // Calculate image types for filter buttons
  const imageTypes = [...new Set(images.map((img) => img.type))];

  // Image type labels for display
  const typeLabels = {
    exterior: "Exterior",
    interior: "Interior",
    mechanical: "Mechanical",
  };

  // Toggle fullscreen mode
  const toggleFullscreen = (index) => {
    setFullscreenActive(!fullscreenActive);
    setFullscreenIndex(index);
  };

  // Navigate through fullscreen gallery
  const navigateFullscreen = (direction) => {
    if (direction === "next") {
      setFullscreenIndex((prev) =>
        prev === filteredImages.length - 1 ? 0 : prev + 1
      );
    } else {
      setFullscreenIndex((prev) =>
        prev === 0 ? filteredImages.length - 1 : prev - 1
      );
    }
  };

  // Close fullscreen on escape key
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && fullscreenActive) {
        setFullscreenActive(false);
      }
    });
  }

  // Get image counts per type for display
  const imageCounts = imageTypes.reduce((acc, type) => {
    acc[type] = images.filter((img) => img.type === type).length;
    return acc;
  }, {});

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="p-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Vehicle Photos ({images.length})
            </h2>

            {/* View All button */}
            <button
              onClick={() => toggleFullscreen(0)}
              className="flex items-center text-orange-500 hover:text-orange-600"
            >
              <span className="text-sm font-medium mr-1">View All</span>
              <Maximize2 size={16} />
            </button>
          </div>

          {/* Filter Controls */}
          <div className="px-6 pb-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  activeFilter === "all"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({images.length})
              </button>

              {imageTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
                    activeFilter === type
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {typeLabels[type] || type} ({imageCounts[type]})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="p-6">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="relative rounded-lg overflow-hidden aspect-square cursor-pointer group"
                onClick={() => toggleFullscreen(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity flex items-center justify-center">
                  <Maximize2
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    size={20}
                  />
                </div>
              </div>
            ))}

            {filteredImages.length === 0 && (
              <div className="col-span-full py-16 text-center text-gray-500">
                No images available for this filter.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Gallery Modal */}
      {fullscreenActive && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={() => setFullscreenActive(false)}
            className="absolute top-6 right-6 text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
            aria-label="Close gallery"
          >
            <X size={24} />
          </button>

          {/* Main image */}
          <div className="w-full h-full flex items-center justify-center p-8 relative">
            <img
              src={filteredImages[fullscreenIndex].src}
              alt={filteredImages[fullscreenIndex].alt}
              className="max-w-full max-h-[80vh] object-contain"
            />

            {/* Type label */}
            <div className="absolute top-6 left-6 bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full">
              {typeLabels[filteredImages[fullscreenIndex].type] ||
                filteredImages[fullscreenIndex].type}
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={() => navigateFullscreen("prev")}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => navigateFullscreen("next")}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>

          {/* Thumbnails */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2">
              <span className="text-white text-sm">
                {fullscreenIndex + 1} / {filteredImages.length}
              </span>

              <div className="h-6 w-px bg-white/30 mx-2"></div>

              <div className="flex items-center space-x-2 overflow-x-auto hide-scrollbar max-w-xs sm:max-w-md">
                {filteredImages.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFullscreenIndex(idx);
                    }}
                    className={`w-8 h-8 rounded-md overflow-hidden flex-shrink-0 transition-opacity ${
                      idx === fullscreenIndex
                        ? "ring-2 ring-orange-500"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.src}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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
    </>
  );
}
