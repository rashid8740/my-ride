// src/app/about/page.js
import AboutClient from './client';

export const metadata = {
  title: "About Us | My Ride",
  description: "Learn more about My Ride - Kenya's premium car marketplace with a dedication to excellence and customer satisfaction",
  keywords: "about us, car dealership, automotive history, kenya cars, my ride team",
};

export default function AboutPage() {
  return <AboutClient />;
}