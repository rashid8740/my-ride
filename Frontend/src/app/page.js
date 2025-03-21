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

      {/* Loan Calculator Section */}
      <section className="w-full py-24 bg-gray-50">
        <div className="container mx-auto px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Estimate Your Monthly Payments
            </h2>
            <p className="text-gray-600 text-lg">
              Use our loan calculator to estimate monthly payments and find
              financing options that fit your budget.
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <LoanCalculator />
          </div>
        </div>
      </section>

      <StatisticsSection id="statistics" />
      <TestimonialsSection id="testimonials" />
      <Footer />
    </main>
  );
}
