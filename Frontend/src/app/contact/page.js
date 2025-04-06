// src/app/contact/page.js
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, Send, Check, AlertCircle, Loader, Car } from "lucide-react";
import apiService from "@/utils/api";

// Input Field Component
const InputField = ({ 
  id, 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  required = false,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-colors"
      />
    </div>
  );
};

// Select Field Component
const SelectField = ({ 
  id, 
  label, 
  options,
  value, 
  onChange, 
  required = false,
  placeholder = "Select an option..." 
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-colors"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Textarea Component
const TextareaField = ({ 
  id, 
  label, 
  placeholder, 
  value, 
  onChange, 
  required = false,
  rows = 4,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-colors"
      />
    </div>
  );
};

// Contact Information Card
const ContactInfoCard = ({ icon, title, children }) => {
  return (
    <div className="flex items-start mb-6">
      <div className="bg-orange-100 p-3 rounded-lg mr-4">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
        <div className="text-gray-700">{children}</div>
      </div>
    </div>
  );
};

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);

  // Fetch vehicles when component mounts
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoadingVehicles(true);
        const response = await apiService.cars.getAll();
        
        if (response.status === 'success' && Array.isArray(response.data)) {
          setVehicles(response.data);
        }
      } catch (err) {
        console.error('Error fetching vehicles:', err);
      } finally {
        setIsLoadingVehicles(false);
      }
    };
    
    fetchVehicles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Find the selected vehicle details
      let vehicleDetails = vehicle;
      if (vehicle && vehicle.startsWith('vehicle-')) {
        const vehicleId = vehicle.replace('vehicle-', '');
        const selectedVehicle = vehicles.find(v => v._id === vehicleId);
        if (selectedVehicle) {
          vehicleDetails = `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`;
        }
      }
      
      // Prepare the inquiry data
      const inquiryData = {
        name,
        email,
        phone,
        subject,
        message,
        vehicle: vehicleDetails,
        vehicleId: vehicle && vehicle.startsWith('vehicle-') ? vehicle.replace('vehicle-', '') : null
      };
      
      // Submit the inquiry to the backend
      const response = await apiService.contact.submitInquiry(inquiryData);
      
      if (response.status === 'success') {
        // Show success message
        setSubmitted(true);
        
        // Reset form fields
        setName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
        setVehicle("");
        
        // After 5 seconds, reset the submission status
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        throw new Error(response.message || 'Failed to submit inquiry');
      }
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setError(err.message || 'An error occurred while submitting your inquiry. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] w-full bg-gray-900">
        <Image
          src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1920&auto=format&fit=crop"
          alt="Contact AutoDecar"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white z-10 px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl max-w-2xl mx-auto">
              We're here to help with any questions you might have.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
              <p className="text-gray-700 mb-8">
                Have questions about buying or selling a car? Our friendly team is always ready to assist you. Feel free to reach out through any of the following channels:
              </p>
              
              <ContactInfoCard 
                icon={<MapPin size={24} className="text-orange-500" />}
                title="Our Location"
              >
                <p>123 Automotive Avenue,<br />Nairobi, Kenya</p>
              </ContactInfoCard>
              
              <ContactInfoCard 
                icon={<Phone size={24} className="text-orange-500" />}
                title="Phone Number"
              >
                <p>+254 (123) 456-7890</p>
                <p className="text-sm text-gray-500 mt-1">Mon-Fri from 9am to 6pm</p>
              </ContactInfoCard>
              
              <ContactInfoCard 
                icon={<Mail size={24} className="text-orange-500" />}
                title="Email Address"
              >
                <p>info@myride.co.ke</p>
                <p className="text-sm text-gray-500 mt-1">We'll respond as soon as possible</p>
              </ContactInfoCard>
              
              <ContactInfoCard 
                icon={<Clock size={24} className="text-orange-500" />}
                title="Working Hours"
              >
                <p>Monday - Friday: 9AM - 6PM</p>
                <p>Saturday: 10AM - 4PM</p>
                <p>Sunday: Closed</p>
              </ContactInfoCard>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              
              {submitted && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  <span>Thank you! Your inquiry has been sent successfully. Our team will contact you soon.</span>
                </div>
              )}
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span>{error}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    id="name"
                    label="Full Name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <InputField
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    id="phone"
                    label="Phone Number"
                    placeholder="(123) 456-7890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <InputField
                    id="subject"
                    label="Subject"
                    placeholder="How can we help you?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle of Interest
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Car className="h-5 w-5 text-gray-400" />
                    </div>
                    {isLoadingVehicles ? (
                      <div className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                        <Loader className="h-4 w-4 mr-2 inline animate-spin" /> Loading vehicles...
                      </div>
                    ) : (
                      <select
                        id="vehicle"
                        value={vehicle}
                        onChange={(e) => setVehicle(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-colors"
                      >
                        <option value="">Select a vehicle (optional)</option>
                        <option value="other">Other/Not listed</option>
                        {vehicles.map((car) => (
                          <option key={car._id} value={`vehicle-${car._id}`}>
                            {car.year} {car.make} {car.model} - KSh {car.price ? car.price.toLocaleString() : 'N/A'}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                
                <TextareaField
                  id="message"
                  label="Message"
                  placeholder="Please describe your question or concern in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                />
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`mt-4 ${
                    isLoading ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'
                  } text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md flex items-center justify-center`}
                >
                  {isLoading ? (
                    <>
                      <Loader size={18} className="animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Find Us</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Visit our showroom to explore our premium vehicle selection in person.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63820.98109883296!2d36.78544933953908!3d-1.2971286238125492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10a36c8bf097%3A0x877fc8fe75911ff4!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1713352800000!5m2!1sen!2sus" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="MyRide Kenya Location"
              className="w-full"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  );
}