"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DollarSign, Shield, Wrench, ChevronRight, ChevronDown, Check, CreditCard, ShieldCheck } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const styles = {
  '.animate-fade-in-up': {
    animation: 'fadeInUp 0.6s ease-out forwards',
  },
  '.animation-delay-300': {
    animationDelay: '300ms',
  }
};

// Enhanced ServiceCard component with better shadows and contrast
function ServiceCard({ icon: Icon, title, description, features }) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-100 hover:shadow-lg transition-all group hover:border-orange-200">
      <div className="flex mb-4">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shadow-sm mr-4 group-hover:bg-orange-200 transition-colors">
          {Icon && <Icon className="h-6 w-6 text-orange-600" />}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">{title}</h3>
          <p className="text-gray-700">{description}</p>
          
          {features && features.length > 0 && (
            <div className="mt-4">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center text-orange-600 hover:text-orange-700 font-medium"
              >
                <span>{expanded ? 'Hide Details' : 'View Details'}</span>
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>
              
              {expanded && (
                <div className="mt-3 pl-4 border-l-2 border-orange-200 space-y-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Hero Section with Navigation
function ServicesHero() {
  return (
    <div className="relative">
      <section className="relative h-[55vh] min-h-[450px] w-full bg-gray-900">
        <Image
          src="https://images.unsplash.com/photo-1582641547274-093dd3f16127?q=80&w=1920&auto=format&fit=crop"
          alt="Services"
          fill
          priority
          className="object-cover opacity-25 hover:scale-105 transition-transform duration-10000"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white z-10 px-4 md:px-8 max-w-4xl">
            <div className="mb-6 animate-fade-in-up">
              <span className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-medium tracking-wide shadow-md inline-block mb-4">PREMIUM SERVICES</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-xl">Our Services</h1>
            </div>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto drop-shadow-md mb-8 leading-relaxed">
              We offer a comprehensive range of services to support you throughout your vehicle ownership journey.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animation-delay-300">
              <Link href="#financing" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 px-7 rounded-lg shadow-lg transition-all hover:translate-y-[-3px]">
                Explore Financing
              </Link>
              <Link href="#maintenance" className="bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3.5 px-7 rounded-lg shadow-lg transition-all hover:translate-y-[-3px]">
                View Maintenance
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Add a new TestimonialsSection component before export default
function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-medium tracking-wide mb-4 inline-block">
            CUSTOMER EXPERIENCES
          </span>
          <h2 className="text-3xl md:text-4xl font-bold relative inline-block">
            <span className="relative z-10">What Our Customers Say</span>
            <span className="absolute bottom-0 left-0 w-full h-3 bg-orange-500/30 -z-10 transform -rotate-1"></span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-xl hover:shadow-orange-500/10 hover:translate-y-[-5px] transition-all duration-300 border border-gray-700">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center text-xl font-bold mr-4">
                JD
              </div>
              <div>
                <h3 className="font-semibold text-lg">John Doe</h3>
                <p className="text-gray-400 text-sm">Financing Customer</p>
              </div>
            </div>
            <div className="mb-4 flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-300 mb-4">"The financing options provided by My Ride were exactly what I needed. The team made the entire process smooth and manageable. I couldn't be happier with my new car and payment plan!"</p>
            <p className="text-sm text-orange-400 font-medium">October 15, 2023</p>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-xl hover:shadow-orange-500/10 hover:translate-y-[-5px] transition-all duration-300 border border-gray-700">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center text-xl font-bold mr-4">
                JS
              </div>
              <div>
                <h3 className="font-semibold text-lg">Jane Smith</h3>
                <p className="text-gray-400 text-sm">Insurance Customer</p>
              </div>
            </div>
            <div className="mb-4 flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-300 mb-4">"I was surprised by how affordable their insurance plans were. The coverage is comprehensive and the customer service is outstanding. They even helped me file a claim when I had a minor accident."</p>
            <p className="text-sm text-orange-400 font-medium">November 3, 2023</p>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-xl hover:shadow-orange-500/10 hover:translate-y-[-5px] transition-all duration-300 border border-gray-700">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center text-xl font-bold mr-4">
                RJ
              </div>
              <div>
                <h3 className="font-semibold text-lg">Robert Johnson</h3>
                <p className="text-gray-400 text-sm">Maintenance Customer</p>
              </div>
            </div>
            <div className="mb-4 flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-300 mb-4">"The maintenance team at My Ride is exceptional. They're thorough, professional, and always explain what needs to be done. My car has never run better since I started using their maintenance services."</p>
            <p className="text-sm text-orange-400 font-medium">December 12, 2023</p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/contact" 
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all hover:translate-y-[-3px]">
            Contact Us
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20">
        <ServicesHero />
        
        {/* Financing Section */}
        <section id="financing" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 relative">
                <span className="relative z-10 inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[8px] after:w-32 after:mx-auto after:bg-orange-500/40 after:-z-10">Financing Solutions</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Flexible options to help you drive your dream car home today, with plans tailored to your budget and needs.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
              <div className="md:w-1/2">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <DollarSign className="h-6 w-6 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 relative">
                    <span className="relative z-10 inline-block border-b-[3px] border-orange-500 pb-1">Financing Solutions</span>
                  </h2>
                </div>
                <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                  Getting the right financing is as important as choosing the right vehicle. Our financing services are designed to provide flexible options that fit your budget and lifestyle, with competitive rates and transparent terms.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                  <ServiceCard 
                    icon={CreditCard}
                    title="Loan Options"
                    description="Find the perfect loan terms to match your financial needs."
                    features={[
                      "Competitive interest rates starting at 2.9% APR",
                      "Flexible repayment periods from 24 to 84 months",
                      "No early repayment penalties",
                      "Pre-approval in as little as 15 minutes"
                    ]}
                  />
                  <ServiceCard 
                    icon={DollarSign}
                    title="Leasing Programs"
                    description="Enjoy lower monthly payments and the flexibility to upgrade."
                    features={[
                      "Lower monthly payments compared to financing",
                      "Option to upgrade to a new vehicle every 2-3 years",
                      "Multiple mileage packages available",
                      "Gap insurance included with all leases"
                    ]}
                  />
                </div>
                
                <Link 
                  href="/contact?subject=Financing" 
                  className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3.5 rounded-md transition-all duration-300 shadow-md hover:shadow-lg mt-4 group"
                >
                  <span className="font-medium">Talk to a Finance Specialist</span>
                  <ChevronRight size={16} className="ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>
              
              <div className="md:w-1/2 relative h-[300px] md:h-[450px] rounded-lg overflow-hidden shadow-xl group">
                <Image
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1000&auto=format&fit=crop"
                  alt="Car Financing"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Insurance Section */}
        <section id="insurance" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 relative">
                <span className="relative z-10 inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[8px] after:w-32 after:mx-auto after:bg-orange-500/40 after:-z-10">Insurance Coverage</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Protect your investment with our comprehensive insurance plans designed for your peace of mind.
              </p>
            </div>
            <div className="flex flex-col md:flex-row-reverse gap-8 md:gap-12 items-center">
              <div className="md:w-1/2">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <Shield className="h-6 w-6 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 relative">
                    <span className="relative z-10 inline-block border-b-[3px] border-orange-500 pb-1">Insurance Coverage</span>
                  </h2>
                </div>
                <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                  Protect your investment with our comprehensive insurance options. We partner with leading providers to offer you the best coverage at competitive rates, giving you peace of mind on and off the road.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                  <ServiceCard 
                    icon={ShieldCheck}
                    title="Comprehensive Plans"
                    description="Full protection against theft, damage, and liability."
                    features={[
                      "Collision and comprehensive coverage",
                      "24/7 roadside assistance included",
                      "Rental car reimbursement during repairs",
                      "Personal injury protection for all passengers"
                    ]}
                  />
                  <ServiceCard 
                    icon={Shield}
                    title="Extended Warranties"
                    description="Additional coverage beyond the manufacturer's warranty."
                    features={[
                      "Coverage for up to 7 years or 100,000 miles",
                      "Zero deductible option available",
                      "Nationwide network of certified repair facilities",
                      "Transferable coverage if you sell your vehicle"
                    ]}
                  />
                </div>
                
                <Link 
                  href="/contact?subject=Insurance" 
                  className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3.5 rounded-md transition-all duration-300 shadow-md hover:shadow-lg mt-4 group"
                >
                  <span className="font-medium">Get an Insurance Quote</span>
                  <ChevronRight size={16} className="ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>
              
              <div className="md:w-1/2 relative h-[300px] md:h-[450px] rounded-lg overflow-hidden shadow-xl group">
                <Image
                  src="https://images.unsplash.com/photo-1621252179027-1226549feb43?q=80&w=1000&auto=format&fit=crop"
                  alt="Car Insurance"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Maintenance Section */}
        <section id="maintenance" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 relative">
                <span className="relative z-10 inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[8px] after:w-32 after:mx-auto after:bg-orange-500/40 after:-z-10">Maintenance Services</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Keep your vehicle in optimal condition with our expert maintenance and repair services.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
              <div className="md:w-1/2">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <Wrench className="h-6 w-6 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 relative">
                    <span className="relative z-10 inline-block border-b-[3px] border-orange-500 pb-1">Maintenance Services</span>
                  </h2>
                </div>
                <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                  Keep your vehicle running at its best with our expert maintenance services. Our certified technicians use state-of-the-art equipment and genuine parts to ensure the longevity and performance of your vehicle.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                  <ServiceCard 
                    icon={Wrench}
                    title="Regular Servicing"
                    description="Scheduled maintenance to keep your vehicle in peak condition."
                    features={[
                      "Comprehensive multi-point inspection with every service",
                      "Genuine manufacturer parts for all replacements",
                      "Service reminder program to keep you on schedule",
                      "Complimentary shuttle service or loaner vehicles"
                    ]}
                  />
                  <ServiceCard 
                    icon={Wrench}
                    title="Repair Services"
                    description="Expert diagnosis and repair for all vehicle issues."
                    features={[
                      "State-of-the-art diagnostic equipment",
                      "ASE certified technicians for all repairs",
                      "Written estimates before work begins",
                      "All repairs backed by a 12-month/12,000-mile warranty"
                    ]}
                  />
                </div>
                
                <Link 
                  href="/contact?subject=Maintenance" 
                  className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3.5 rounded-md transition-all duration-300 shadow-md hover:shadow-lg mt-4 group"
                >
                  <span className="font-medium">Schedule a Service</span>
                  <ChevronRight size={16} className="ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>
              
              <div className="md:w-1/2 relative h-[300px] md:h-[450px] rounded-lg overflow-hidden shadow-xl group">
                <Image
                  src="https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?q=80&w=1000&auto=format&fit=crop"
                  alt="Car Maintenance"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-14 md:py-20 bg-gradient-to-r from-orange-600 to-orange-500 text-white">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-5 md:mb-6 drop-shadow-lg">Ready to Experience Our Services?</h2>
            <p className="text-base md:text-lg text-white mb-8 md:mb-10 max-w-2xl mx-auto opacity-90">
              Whether you're looking to finance your next vehicle, secure the right insurance coverage, or keep your car in top condition, our team is here to help.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl group text-lg font-semibold"
            >
              <span>Get in Touch</span>
              <ChevronRight size={20} className="ml-2.5 transition-transform group-hover:translate-x-1.5 duration-300" />
            </Link>
          </div>
        </section>
      </main>
      <TestimonialsSection />
      <Footer />
    </>
  );
} 