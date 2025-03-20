// src/app/page.js
import HeroSection from "@/components/home/HeroSection";
import Navbar from "@/components/layout/Navbar";
import CarListingSection from "@/components/cars/CarListingSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <CarListingSection />
    </main>
  );
}
