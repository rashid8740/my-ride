// src/app/page.js
import HeroSection from "@/components/home/HeroSection";
import Navbar from "@/components/layout/Navbar";
import CarListingSection from "@/components/cars/CarListingSection";
import StatisticsSection from "@/components/home/StatisticsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import LoanCalculator from "@/components/calculator/LoanCalculator";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection id="hero" />
      <CarListingSection id="featured-cars" />

      <LoanCalculator id="loan-calculator" />

      <StatisticsSection id="statistics" />
      <TestimonialsSection id="testimonials" />
      <Footer />
    </main>
  );
}
