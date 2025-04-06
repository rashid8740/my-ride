// src/components/product/ProductActions.js
"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronRight,
  Check,
  Shield,
  ThumbsUp,
  Star,
} from "lucide-react";

export default function ProductActions({ car }) {
  const [loanAmount] = useState(
    typeof car.discountedPrice === 'number' 
      ? car.discountedPrice 
      : typeof car.price === 'number' 
        ? car.price 
        : parseFloat((car.price || '0').toString().replace(/[^\d.-]/g, ''))
  );
  const [downPayment, setDownPayment] = useState(5000);
  const [interestRate, setInterestRate] = useState(4.9);
  const [loanTerm, setLoanTerm] = useState(60);
  const [formExpanded, setFormExpanded] = useState(false);
  const [financingExpanded, setFinancingExpanded] = useState(false);

  // Calculate monthly payment
  const calculateMonthlyPayment = () => {
    const principal = loanAmount - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm;

    if (monthlyRate === 0) {
      return principal / numberOfPayments;
    }

    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    return monthlyPayment;
  };

  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle form input change
  const handleInputChange = (e, setter) => {
    const value = e.target.value.replace(/[^\d.]/g, "");
    setter(parseFloat(value) || 0);
  };

  return (
    <div className="space-y-6">
      {/* Price Information */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mr-4">
              <ThumbsUp size={22} className="text-orange-500" />
            </div>
            <div>
              <div className="text-gray-500 text-sm">Fair Market Price</div>
              <div className="text-3xl font-bold text-gray-900">
                KSh
                {car.discountedPrice
                  ? (typeof car.discountedPrice === 'number' 
                      ? car.discountedPrice.toLocaleString() 
                      : parseFloat(car.discountedPrice.toString().replace(/[^\d.-]/g, '') || '0').toLocaleString())
                  : (typeof car.price === 'number' 
                      ? car.price.toLocaleString() 
                      : parseFloat(car.price?.toString().replace(/[^\d.-]/g, '') || '0').toLocaleString())}
              </div>
            </div>
          </div>

          {car.discountedPrice && car.price > car.discountedPrice && (
            <div className="flex items-center text-green-600">
              <Check size={16} className="mr-1" />
              <span>
                KSh {(
                  (typeof car.price === 'number' ? car.price : parseFloat(car.price?.toString().replace(/[^\d.-]/g, '') || '0')) - 
                  (typeof car.discountedPrice === 'number' ? car.discountedPrice : parseFloat(car.discountedPrice.toString().replace(/[^\d.-]/g, '') || '0'))
                ).toLocaleString()} below
                market average
              </span>
            </div>
          )}
        </div>

        {/* Estimate Payment */}
        <div className="p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Estimate Payment</h3>
            <button
              onClick={() => setFinancingExpanded(!financingExpanded)}
              className="text-orange-500 text-sm flex items-center"
            >
              <span>Customize</span>
              <ChevronDown
                size={16}
                className={`ml-1 transition-transform ${
                  financingExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Monthly payment display */}
          <div className="text-3xl font-bold text-gray-900 mb-2">
            KSh {Math.round(calculateMonthlyPayment()).toLocaleString()}
            <span className="text-lg font-normal text-gray-600">/mo</span>
          </div>

          {/* Default values */}
          <div className="text-sm text-gray-600 mb-4">
            KSh {downPayment.toLocaleString()} down, {loanTerm} months,{" "}
            {interestRate}% APR
          </div>

          {/* Expanded calculator */}
          <div
            className={`transition-all duration-300 overflow-hidden ${
              financingExpanded
                ? "max-h-[500px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="space-y-4 pt-4 border-t border-gray-200">
              {/* Down Payment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Down Payment
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    KSh
                  </span>
                  <input
                    type="text"
                    value={formatNumber(downPayment)}
                    onChange={(e) => handleInputChange(e, setDownPayment)}
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Loan Term */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Term
                </label>
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="24">24 months (2 years)</option>
                  <option value="36">36 months (3 years)</option>
                  <option value="48">48 months (4 years)</option>
                  <option value="60">60 months (5 years)</option>
                  <option value="72">72 months (6 years)</option>
                  <option value="84">84 months (7 years)</option>
                </select>
              </div>

              {/* Interest Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interest Rate (APR %)
                </label>
                <input
                  type="text"
                  value={interestRate}
                  onChange={(e) => handleInputChange(e, setInterestRate)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="pt-4 text-xs text-gray-500 text-center">
                This is just an estimate. Rates and eligibility depend on your
                credit.
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Link
              href="/financing-application"
              className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Apply for Financing
            </Link>
          </div>
        </div>
      </div>

      {/* Contact Actions */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Interested in this car?
          </h3>

          <div className="flex flex-col space-y-3">
            {/* Phone Button */}
            <a
              href="tel:+18005551234"
              className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg transition-colors shadow-sm"
            >
              <Phone size={18} className="mr-2" />
              <span className="font-medium">Call Dealer</span>
            </a>

            {/* Message Button */}
            <button
              onClick={() => setFormExpanded(!formExpanded)}
              className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <MessageSquare size={18} className="mr-2 text-gray-700" />
                <span className="font-medium">Message Dealer</span>
              </div>
              <ChevronDown
                size={18}
                className={`transition-transform ${
                  formExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Contact Form */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                formExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pt-4 space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="I'm interested in this car and would like more information..."
                    defaultValue={`I'm interested in this ${car.year} ${car.make} ${car.model} ${car.trim}`}
                  ></textarea>
                </div>

                <div className="flex items-start mb-2">
                  <input
                    type="checkbox"
                    id="consent"
                    className="mt-1 h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label
                    htmlFor="consent"
                    className="ml-2 text-sm text-gray-600"
                  >
                    I agree to receive communications about this vehicle and
                    related offers from the dealer.
                  </label>
                </div>

                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg transition-colors shadow-sm font-medium">
                  Send Message
                </button>
              </div>
            </div>

            {/* Email Button */}
            <a
              href={`mailto:sales@autodecar.com?subject=Inquiry about ${car.year} ${car.make} ${car.model}&body=I'm interested in this ${car.year} ${car.make} ${car.model} ${car.trim} (Stock #${car.stockNumber}).`}
              className="flex items-center justify-center border border-gray-300 hover:bg-gray-50 text-gray-800 py-3 px-6 rounded-lg transition-colors"
            >
              <Mail size={18} className="mr-2 text-gray-700" />
              <span className="font-medium">Email Dealer</span>
            </a>

            {/* Test Drive Button */}
            <Link
              href="/test-drive"
              className="flex items-center justify-center border border-gray-300 hover:bg-gray-50 text-gray-800 py-3 px-6 rounded-lg transition-colors"
            >
              <Calendar size={18} className="mr-2 text-gray-700" />
              <span className="font-medium">Schedule Test Drive</span>
            </Link>
          </div>

          {/* Dealership Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center mb-3">
              <MapPin size={18} className="mr-2 text-orange-500" />
              <h4 className="font-medium text-gray-900">Vehicle Location</h4>
            </div>
            <div className="text-gray-600 mb-4 pl-6">
              AutoDecar Miami Showroom
              <br />
              1234 Auto Drive, Miami, FL 33101
            </div>
            <div className="pl-6">
              <Link
                href="/dealerships/miami"
                className="text-orange-500 text-sm font-medium inline-flex items-center hover:text-orange-600"
              >
                View dealership info
                <ChevronRight size={14} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
              <Shield size={16} className="text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900">AutoDecar Certified</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            This vehicle has undergone our rigorous 150-point inspection and
            comes with our 7-day money-back guarantee.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center">
              <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-700">7-Day Return Policy</span>
            </div>
            <div className="flex items-center">
              <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-700">
                150-Point Inspection
              </span>
            </div>
            <div className="flex items-center">
              <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-700">90-Day Warranty</span>
            </div>
            <div className="flex items-center">
              <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-700">Roadside Assistance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Vehicles */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Similar Vehicles</h3>
        </div>

        <div className="divide-y divide-gray-100">
          {car.similarVehicles.map((vehicle) => (
            <Link
              key={vehicle.id}
              href={`/cars/${vehicle.id}`}
              className="flex p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden mr-4">
                <img
                  src={vehicle.image}
                  alt={vehicle.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                  {vehicle.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <span>KSh {vehicle.price.toLocaleString()}</span>
                  <span className="mx-1.5">•</span>
                  <span>{vehicle.mileage.toLocaleString()} mi</span>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={12}
                      className={
                        star <= 4
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="p-4 text-center border-t border-gray-100">
          <Link
            href="/inventory"
            className="text-orange-500 text-sm font-medium inline-flex items-center hover:text-orange-600"
          >
            View all inventory
            <ChevronRight size={14} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
