// src/app/about/page.js
import Image from "next/image";
import Link from "next/link";
import { Check, MapPin, Phone, Mail, Clock, ChevronRight } from "lucide-react";

export const metadata = {
  title: "About Us | AutoDecar",
  description: "Learn more about AutoDecar - your premium car marketplace",
};

// Team Member Component
function TeamMember({ name, position, image }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:shadow-lg">
      <div className="h-64 relative">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="text-gray-600">{position}</p>
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] w-full bg-gray-900">
        <Image
          src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1920&auto=format&fit=crop"
          alt="About AutoDecar"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white z-10 px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About AutoDecar</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Your trusted partner in finding the perfect vehicle for your lifestyle and needs.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded in 2015, AutoDecar started with a simple mission: to make car buying and selling transparent, convenient, and enjoyable. What began as a small startup has now grown into a trusted marketplace connecting thousands of buyers and sellers.
              </p>
              <p className="text-gray-700 mb-4">
                Our team of automotive enthusiasts and technology experts work together to provide an exceptional platform that puts you in control of your car buying journey.
              </p>
              <p className="text-gray-700 mb-6">
                We believe everyone deserves a hassle-free experience when finding their next vehicle, and we're committed to making that a reality through innovation and dedication to customer satisfaction.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Check size={20} className="text-orange-500 mr-2" />
                  <span className="text-gray-800">Transparent pricing with no hidden fees</span>
                </div>
                <div className="flex items-center">
                  <Check size={20} className="text-orange-500 mr-2" />
                  <span className="text-gray-800">Thoroughly inspected and verified vehicles</span>
                </div>
                <div className="flex items-center">
                  <Check size={20} className="text-orange-500 mr-2" />
                  <span className="text-gray-800">Dedicated customer support throughout your journey</span>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=800&auto=format&fit=crop"
                alt="AutoDecar Office"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              At AutoDecar, our core values drive everything we do, from how we build our platform to how we interact with our customers.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Trust & Transparency"
              description="We believe in complete honesty about every vehicle on our platform, with detailed history reports and upfront pricing."
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>}
            />
            <FeatureCard
              title="Customer First"
              description="Your satisfaction is our priority. We're here to guide you through every step of the car buying or selling process."
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>}
            />
            <FeatureCard
              title="Innovation"
              description="We continuously improve our platform with the latest technology to make your car shopping experience seamless and enjoyable."
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>}
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Meet the passionate individuals who make AutoDecar the premier destination for car enthusiasts and buyers.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <TeamMember
              name="Alex Morgan"
              position="CEO & Founder"
              image="https://randomuser.me/api/portraits/men/32.jpg"
            />
            <TeamMember
              name="Sarah Chen"
              position="Head of Operations"
              image="https://randomuser.me/api/portraits/women/44.jpg"
            />
            <TeamMember
              name="David Wilson"
              position="Chief Technology Officer"
              image="https://randomuser.me/api/portraits/men/68.jpg"
            />
            <TeamMember
              name="Michelle Rodriguez"
              position="Marketing Director"
              image="https://randomuser.me/api/portraits/women/65.jpg"
            />
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Visit Us</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Drop by our office or reach out through any of our communication channels. We're always happy to help!
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md h-full">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="text-orange-500 mt-1 mr-3 flex-shrink-0" size={20} />
                  <p className="text-gray-700">
                    123 Automotive Avenue, <br />
                    San Francisco, CA 94158, <br />
                    United States
                  </p>
                </div>
                <div className="flex items-center">
                  <Phone className="text-orange-500 mr-3 flex-shrink-0" size={20} />
                  <p className="text-gray-700">+1 (555) 123-4567</p>
                </div>
                <div className="flex items-center">
                  <Mail className="text-orange-500 mr-3 flex-shrink-0" size={20} />
                  <p className="text-gray-700">info@autodecar.com</p>
                </div>
                <div className="flex items-center">
                  <Clock className="text-orange-500 mr-3 flex-shrink-0" size={20} />
                  <p className="text-gray-700">Monday-Friday: 9AM-6PM, Saturday: 10AM-4PM</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md h-full">
              <div className="h-full flex flex-col">
                <h3 className="text-xl font-semibold mb-4">Have Questions?</h3>
                <p className="text-gray-700 mb-6">
                  Our dedicated support team is ready to assist you with any inquiries about our services or help you find your dream car.
                </p>
                <div className="mt-auto">
                  <Link href="/contact" className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md transition-colors shadow-lg">
                    <span className="font-medium">Contact Us</span>
                    <ChevronRight size={16} className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}