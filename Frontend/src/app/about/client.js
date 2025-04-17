"use client";
import Image from "next/image";
import Link from "next/link";
import { Check, MapPin, Phone, Mail, Clock, ChevronRight, ShieldCheck, Lightbulb, Star, HandSparkles, Users, Leaf } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Team Member Component
function TeamMember({ name, position, image }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all border border-gray-100 hover:border-orange-200 transform hover:-translate-y-1">
      <div className="relative h-80 mb-6 overflow-hidden rounded-md">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform hover:scale-105 duration-500"
        />
      </div>
      <h3 className="text-xl font-bold text-gray-900">{name}</h3>
      <p className="text-orange-600 font-medium">{position}</p>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 duration-300">
      <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-5 shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}

// Improve section titles with better visibility
function SectionTitle({ children }) {
  return (
    <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 relative inline-block">
      <span className="relative z-10">{children}</span>
      <span className="absolute bottom-1 left-0 w-full h-3 bg-orange-200 -z-0 transform -rotate-1"></span>
    </h2>
  );
}

// Update team array with better bios
const team = [
  {
    name: "Sarah Johnson",
    position: "CEO & Founder",
    bio: "With over 15 years in the automotive industry, Sarah founded My Ride with a vision to transform how people buy and sell vehicles online.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500&auto=format&fit=crop",
  },
  {
    name: "Michael Rodriguez",
    position: "Chief Technology Officer",
    bio: "Michael leads our development team, bringing his expertise in creating intuitive, user-friendly platforms that make car shopping a breeze.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=500&auto=format&fit=crop",
  },
  {
    name: "David Chen",
    position: "Customer Experience Director",
    bio: "David ensures every interaction with My Ride exceeds expectations, drawing from his background in luxury automotive customer service.",
    image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=500&auto=format&fit=crop",
  },
];

export default function AboutClient() {
  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] w-full bg-gray-900">
          <Image
            src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1920&auto=format&fit=crop"
            alt="About My Ride"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white z-10 px-4 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg tracking-tight">
                About My Ride
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto drop-shadow-md mb-8 leading-relaxed">
                Your trusted partner in finding the perfect vehicle for your lifestyle and needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link
                  href="/vehicles"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-md shadow-md hover:shadow-lg transition duration-300 text-lg"
                >
                  Browse Vehicles
                </Link>
                <Link
                  href="/contact"
                  className="bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-8 rounded-md shadow-md hover:shadow-lg transition duration-300 text-lg"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <SectionTitle>Our Story</SectionTitle>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Founded in 2010, My Ride began with a simple mission: to make car buying a 
                  transparent, hassle-free experience. We understand that purchasing a vehicle 
                  is one of the most significant investments most people make. That's why we've 
                  built a platform that prioritizes your needs and preferences.
                </p>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Over the years, we've grown from a small local dealership to a nationwide 
                  service trusted by thousands of customers. Our commitment to quality, 
                  transparency, and customer satisfaction remains the cornerstone of everything we do.
                </p>
                <div className="space-y-4 mt-8">
                  <div className="flex items-start space-x-3">
                    <span className="text-orange-500 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <p className="text-gray-700 font-medium">Nationwide network of trusted dealerships</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-orange-500 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <p className="text-gray-700 font-medium">Comprehensive vehicle history reports</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-orange-500 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <p className="text-gray-700 font-medium">Award-winning customer service</p>
                  </div>
                </div>
              </div>
              <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1000&auto=format&fit=crop"
                  alt="Our company office"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Improve Mission Section */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <SectionTitle>Our Mission</SectionTitle>
                <p className="text-lg text-gray-700 mb-6">
                  At My Ride, we're committed to revolutionizing how people find and purchase vehicles. 
                  Our mission is to create a transparent, convenient, and personalized car buying 
                  experience that empowers customers to make confident decisions.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-orange-100 rounded-full p-1 mr-3 mt-1">
                      <Check className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="text-gray-700"><span className="font-medium">Customer-First Approach:</span> Every feature and service we develop starts with our customers' needs.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-orange-100 rounded-full p-1 mr-3 mt-1">
                      <Check className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="text-gray-700"><span className="font-medium">Transparency:</span> We believe in complete honesty about vehicle history, pricing, and features.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-orange-100 rounded-full p-1 mr-3 mt-1">
                      <Check className="w-5 h-5 text-orange-600" />
                    </div>
                    <p className="text-gray-700"><span className="font-medium">Innovation:</span> We constantly improve our platform to deliver the most advanced car shopping experience.</p>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="relative rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000&auto=format&fit=crop"
                    alt="Our Mission"
                    width={600}
                    height={400}
                    className="w-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-transparent mix-blend-overlay"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-24 bg-white relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-20 -right-20 w-64 h-64 bg-orange-50 rounded-full opacity-60"></div>
            <div className="absolute -bottom-10 -left-20 w-48 h-48 bg-orange-50 rounded-full opacity-50"></div>
          </div>
          
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-gray-900 relative inline-block">
                <span className="relative z-10 inline-block after:content-[''] after:absolute after:-bottom-3 after:left-0 after:w-full after:h-2 after:bg-orange-500 after:rounded-sm">Our Values</span>
              </h2>
              <p className="text-gray-700 max-w-3xl mx-auto text-lg md:text-xl mt-6">
                These core principles guide everything we do at My Ride, from how we build our platform to how we interact with our customers.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {/* Transparency Card */}
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all relative transform hover:-translate-y-2 duration-300">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-orange-600">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Transparency</h3>
                <p className="text-gray-700 leading-relaxed">
                  We believe in clear, honest communication about our vehicles, pricing, and services. No hidden fees, no small print, just straightforward information to help you make informed decisions.
                </p>
              </div>
              
              {/* Customer-Centric Card */}
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all relative transform hover:-translate-y-2 duration-300">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-orange-600">
                    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Customer-Centric</h3>
                <p className="text-gray-700 leading-relaxed">
                  Your satisfaction is our priority. We listen to your needs, provide personalized recommendations, and offer support throughout your entire journey with us, from browsing to after-sale service.
                </p>
              </div>
              
              {/* Reliability Card */}
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all relative transform hover:-translate-y-2 duration-300">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-orange-600">
                    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Reliability</h3>
                <p className="text-gray-700 leading-relaxed">
                  We stand behind our vehicles and services. Every car is thoroughly inspected and maintained to the highest standards, ensuring you drive away with confidence in your purchase.
                </p>
              </div>
              
              {/* Innovation Card */}
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all relative transform hover:-translate-y-2 duration-300">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-orange-600">
                    <path d="M12 .75a8.25 8.25 0 00-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 00.577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.75 6.75 0 1113.5 0v4.661c0 .326.277.584.6.544.364-.047.722-.112 1.074-.195a.75.75 0 00.577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0012 .75z" />
                    <path fillRule="evenodd" d="M9.75 15.75a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V16.5a.75.75 0 01.75-.75zm4.5 0a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Innovation</h3>
                <p className="text-gray-700 leading-relaxed">
                  We embrace technology to make vehicle buying and selling seamless. Our digital platform provides tools and resources that streamline the process while maintaining the human touch.
                </p>
              </div>
              
              {/* Integrity Card */}
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all relative transform hover:-translate-y-2 duration-300">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-orange-600">
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Integrity</h3>
                <p className="text-gray-700 leading-relaxed">
                  We operate with honesty and ethical standards in every aspect of our business. Our reputation is built on doing the right thing, even when no one is watching.
                </p>
              </div>
              
              {/* Community Card */}
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all relative transform hover:-translate-y-2 duration-300">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-orange-600">
                    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Community</h3>
                <p className="text-gray-700 leading-relaxed">
                  We're more than just a business—we're part of the community. We actively engage with and give back to the areas we serve, supporting local initiatives and sustainable transportation solutions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <SectionTitle>Why Choose Us</SectionTitle>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-orange-500">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 relative">
                  <span className="relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-16 after:h-1 after:bg-orange-500">Customer-Centric Approach</span>
                </h3>
                <p className="text-gray-700">
                  At My Ride, we put customers at the center of everything we do. From personalized vehicle recommendations 
                  to flexible financing options, we're dedicated to finding solutions that work for your unique situation.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-orange-500">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 relative">
                  <span className="relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-16 after:h-1 after:bg-orange-500">Transparent Transactions</span>
                </h3>
                <p className="text-gray-700">
                  We believe in complete transparency throughout the entire process. Our no-pressure approach and 
                  clear pricing ensure you always know exactly what you're getting without any surprises.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-orange-500">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 relative">
                  <span className="relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-16 after:h-1 after:bg-orange-500">Verified Quality</span>
                </h3>
                <p className="text-gray-700">
                  Every vehicle in our inventory undergoes a comprehensive inspection process. We meticulously 
                  verify the condition and history of each car so you can purchase with complete confidence.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-orange-500">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 relative">
                  <span className="relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-16 after:h-1 after:bg-orange-500">Ongoing Support</span>
                </h3>
                <p className="text-gray-700">
                  Our relationship doesn't end after purchase. From maintenance services to insurance 
                  solutions, we're here to support you throughout your entire ownership journey.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Link 
                href="/services" 
                className="px-8 py-3 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 transition-colors shadow-md hover:shadow-lg"
              >
                Explore Our Services
              </Link>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <SectionTitle>Our Team</SectionTitle>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Meet the dedicated professionals behind My Ride. Our team combines automotive 
                expertise with technological innovation to deliver the best possible experience.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-100">
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform hover:scale-105 duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-orange-500 font-medium mb-3">{member.position}</p>
                    <p className="text-gray-700">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-gray-50 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-100 rounded-full opacity-30"></div>
            <div className="absolute top-40 right-10 w-32 h-32 bg-orange-100 rounded-full opacity-50"></div>
            <div className="absolute bottom-20 -left-10 w-40 h-40 bg-orange-100 rounded-full opacity-40"></div>
          </div>
          
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-gray-900 relative inline-block">
                <span className="relative z-10 inline-block after:content-[''] after:absolute after:-bottom-3 after:left-0 after:w-full after:h-2 after:bg-orange-500 after:rounded-sm">What Our Customers Say</span>
              </h2>
              <p className="text-gray-700 max-w-3xl mx-auto text-lg md:text-xl mt-6">
                Don't just take our word for it - hear from our satisfied customers who found their perfect ride with us.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {/* Testimonial 1 */}
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all relative transform hover:-translate-y-2 duration-300">
                {/* Quote icon */}
                <div className="absolute -top-5 -right-5 bg-orange-500 text-white p-3 rounded-full shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
                </div>
                
                {/* Rating */}
                <div className="mb-6">
                  <div className="flex gap-1 text-orange-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                </div>
                
                {/* Testimonial content */}
                <p className="text-gray-700 italic text-lg mb-8 leading-relaxed">
                  "My Ride made buying my first car so easy! Their team answered all my questions and helped me find exactly what I was looking for within my budget. The process was smooth from start to finish."
                </p>
                
                {/* Customer info */}
                <div className="flex items-center mt-auto">
                  <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-orange-100 shadow-sm">
                    <Image
                      src="https://randomuser.me/api/portraits/women/33.jpg"
                      alt="Customer"
                      width={56}
                      height={56}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">Sarah Kimani</h4>
                    <p className="text-orange-500">First-time Car Owner</p>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all relative md:mt-10 transform hover:-translate-y-2 duration-300">
                {/* Quote icon */}
                <div className="absolute -top-5 -right-5 bg-orange-500 text-white p-3 rounded-full shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
                </div>
                
                {/* Rating */}
                <div className="mb-6">
                  <div className="flex gap-1 text-orange-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                </div>
                
                {/* Testimonial content */}
                <p className="text-gray-700 italic text-lg mb-8 leading-relaxed">
                  "As a business owner, I needed a reliable vehicle quickly. The My Ride team understood my requirements and found me the perfect SUV within days. Their financing options were flexible and competitive."
                </p>
                
                {/* Customer info */}
                <div className="flex items-center mt-auto">
                  <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-orange-100 shadow-sm">
                    <Image
                      src="https://randomuser.me/api/portraits/men/54.jpg"
                      alt="Customer"
                      width={56}
                      height={56}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">James Omondi</h4>
                    <p className="text-orange-500">Business Owner</p>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all relative transform hover:-translate-y-2 duration-300">
                {/* Quote icon */}
                <div className="absolute -top-5 -right-5 bg-orange-500 text-white p-3 rounded-full shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
                </div>
                
                {/* Rating */}
                <div className="mb-6">
                  <div className="flex gap-1 text-orange-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                </div>
                
                {/* Testimonial content */}
                <p className="text-gray-700 italic text-lg mb-8 leading-relaxed">
                  "I sold my car through My Ride and couldn't be happier with the experience. They handled everything professionally, found a buyer quickly, and got me a great price. I'll definitely use them again!"
                </p>
                
                {/* Customer info */}
                <div className="flex items-center mt-auto">
                  <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-orange-100 shadow-sm">
                    <Image
                      src="https://randomuser.me/api/portraits/women/67.jpg"
                      alt="Customer"
                      width={56}
                      height={56}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">Tabitha Mwangi</h4>
                    <p className="text-orange-500">Car Seller</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <Link 
                href="/inventory" 
                className="px-8 py-4 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 transition-all shadow-md hover:shadow-lg"
              >
                <span>Find Your Perfect Ride</span>
                <ChevronRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* Enhance contact section with better styling */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-gray-900 relative">
                <span className="relative z-10 inline-block after:content-[''] after:absolute after:-bottom-3 after:left-0 after:w-full after:h-2 after:bg-orange-500 after:rounded-sm">
                  Get In Touch
                </span>
              </h2>
              <p className="text-gray-700 mb-10 text-lg md:text-xl">
                Have questions about our services or need assistance? Reach out to our team today.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="w-12 h-12 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Email Us</h3>
                  <p className="text-gray-600 mb-4">We'll respond within 24 hours</p>
                  <a href="mailto:contact@myride.com" className="text-orange-500 hover:text-orange-600 font-medium transition-colors">
                    contact@myride.com
                  </a>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="w-12 h-12 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Call Us</h3>
                  <p className="text-gray-600 mb-4">Mon-Fri, 9am-5pm EST</p>
                  <a href="tel:+18005551234" className="text-orange-500 hover:text-orange-600 font-medium transition-colors">
                    (800) 555-1234
                  </a>
                </div>
              </div>
              <div className="mt-10">
                <Link href="/contact" className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-md shadow-sm transition-colors">
                  Visit Our Contact Page
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-gray-900 relative inline-block">
                <span className="relative z-10 inline-block after:content-[''] after:absolute after:-bottom-3 after:left-0 after:w-full after:h-2 after:bg-orange-500 after:rounded-sm">Visit Us</span>
              </h2>
              <p className="text-gray-700 max-w-3xl mx-auto text-lg md:text-xl mt-6">
                Drop by our office or reach out through any of our communication channels. We're always happy to help!
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 md:gap-10">
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all border border-gray-100 hover:border-orange-200 transform hover:-translate-y-1">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 border-b border-gray-100 pb-3">
                  <span className="relative inline-block">
                    <span className="relative z-10">Contact Information</span>
                    <span className="absolute -bottom-2 left-0 right-0 h-4 bg-orange-500/50 -z-10 rounded-sm"></span>
                  </span>
                </h3>
                <div className="space-y-5">
                  <div className="flex items-start">
                    <div className="bg-orange-100 p-2 rounded-full mr-4 flex-shrink-0">
                      <MapPin className="text-orange-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Address:</h4>
                      <p className="text-gray-700">
                        123 Automotive Avenue, <br />
                        Nairobi, Kenya
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-orange-100 p-2 rounded-full mr-4 flex-shrink-0">
                      <Phone className="text-orange-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Phone:</h4>
                      <p className="text-gray-700">+254 (123) 456-7890</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-orange-100 p-2 rounded-full mr-4 flex-shrink-0">
                      <Mail className="text-orange-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Email:</h4>
                      <p className="text-gray-700">info@myride.co.ke</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-orange-100 p-2 rounded-full mr-4 flex-shrink-0">
                      <Clock className="text-orange-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Business Hours:</h4>
                      <p className="text-gray-700">Monday-Friday: 9AM-6PM<br />Saturday: 10AM-4PM</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all border border-gray-100 hover:border-orange-200 transform hover:-translate-y-1">
                <div className="h-full flex flex-col">
                  <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 border-b border-gray-100 pb-3">
                    <span className="relative inline-block">
                      <span className="relative z-10">Have Questions?</span>
                      <span className="absolute -bottom-2 left-0 right-0 h-4 bg-orange-500/50 -z-10 rounded-sm"></span>
                    </span>
                  </h3>
                  <p className="text-gray-700 mb-8 text-lg">
                    Our dedicated support team is ready to assist you with any inquiries about our services or help you find your dream car.
                  </p>
                  <div className="mt-auto text-center">
                    <Link href="/contact" className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-md transition-colors shadow-lg group text-lg font-medium">
                      <span>Contact Us Today</span>
                      <ChevronRight size={20} className="ml-2 transition-transform group-hover:translate-x-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 