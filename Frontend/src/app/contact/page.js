// src/app/contact/page.js
"use client";
import { useState } from "react";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

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
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ name, email, phone, subject, message });
    // For demo purposes, just set submitted to true
    setSubmitted(true);
    // Reset form fields
    setName("");
    setEmail("");
    setPhone("");
    setSubject("");
    setMessage("");
    // After 3 seconds, reset the submission status
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
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
                <p>123 Automotive Avenue,<br />San Francisco, CA 94158,<br />United States</p>
              </ContactInfoCard>
              
              <ContactInfoCard 
                icon={<Phone size={24} className="text-orange-500" />}
                title="Phone Number"
              >
                <p>+1 (555) 123-4567</p>
                <p className="text-sm text-gray-500 mt-1">Mon-Fri from 9am to 6pm</p>
              </ContactInfoCard>
              
              <ContactInfoCard 
                icon={<Mail size={24} className="text-orange-500" />}
                title="Email Address"
              >
                <p>info@autodecar.com</p>
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
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span>Thank you! Your message has been sent successfully.</span>
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
                    placeholder="(555) 123-4567"
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
                  className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md flex items-center"
                >
                  <Send size={18} className="mr-2" />
                  Send Message
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
          <div className="rounded-xl overflow-hidden shadow-lg h-[400px] relative">
            {/* Placeholder for an actual Google Map integration */}
            <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
              <p className="text-gray-700 font-medium">
                Map integration would be displayed here.
                <br />
                For production, replace with Google Maps API or similar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Find quick answers to common questions about our services.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-700">
                We accept all major credit cards, bank transfers, certified checks, and financing through our partner institutions. We can also discuss personalized payment plans.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Do you offer test drives?</h3>
              <p className="text-gray-700">
                Yes, we encourage test drives before making a purchase decision. You can schedule a test drive through our website or by contacting our sales team directly.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">How do I sell my car through AutoDecar?</h3>
              <p className="text-gray-700">
                Selling your car is easy. Simply create an account, complete our online form with your vehicle details, upload photos, and set your price. Our team will review your listing and publish it to our marketplace.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Do you offer delivery services?</h3>
              <p className="text-gray-700">
                Yes, we offer nationwide vehicle delivery for an additional fee. Delivery times and costs vary depending on your location. Contact our logistics team for a custom quote.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}