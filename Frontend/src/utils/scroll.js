// src/utils/scroll.js

/**
 * Smoothly scrolls to the specified element
 * @param {string} elementId - The ID of the element to scroll to
 * @param {number} offset - Optional offset from the top (default: 0)
 */
export function scrollToElement(elementId, offset = 0) {
  const element = document.getElementById(elementId);

  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
}

/**
 * Adds smooth scroll behavior to all anchor links on the page
 * @param {number} offset - Optional offset from the top (default: 0)
 */
export function initSmoothScroll(offset = 0) {
  if (typeof window !== "undefined") {
    // Wait for DOM to be ready
    document.addEventListener("DOMContentLoaded", () => {
      // Find all links that point to an ID
      const anchorLinks = document.querySelectorAll('a[href^="#"]');

      anchorLinks.forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
          const targetId = anchor.getAttribute("href").substring(1);
          if (targetId) {
            e.preventDefault();
            scrollToElement(targetId, offset);
          }
        });
      });
    });
  }
}
