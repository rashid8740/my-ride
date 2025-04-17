// src/components/sections/LoanCalculatorSection.jsx
"use client";
import { useState, useEffect } from "react";

export default function LoanCalculatorSection() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 relative bg-gray-50 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 -right-40 w-64 sm:w-96 h-64 sm:h-96 bg-orange-100 rounded-full opacity-40"></div>
        <div className="absolute -bottom-20 -left-20 w-56 sm:w-80 h-56 sm:h-80 bg-blue-100 rounded-full opacity-40"></div>
        <div className="absolute top-1/4 left-1/3 w-16 sm:w-24 h-16 sm:h-24 bg-yellow-100 rounded-full opacity-30"></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 sm:w-32 h-20 sm:h-32 bg-purple-100 rounded-full opacity-30"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-xl mx-auto">
          <SimpleLoanCalculator />
        </div>
      </div>
    </section>
  );
}

function SimpleLoanCalculator() {
  // State
  const [carPrice, setCarPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState(36);
  const [paymentFrequency, setPaymentFrequency] = useState("Monthly");

  // Calculation results
  const [downPaymentAmount, setDownPaymentAmount] = useState(0);
  const [amountFinanced, setAmountFinanced] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  // Handle number input changes
  const handleNumberInput = (e, setter) => {
    const value = e.target.value.replace(/[^\d.]/g, "");
    setter(value);
  };

  // Calculate loan details
  useEffect(() => {
    const carPriceNum = parseFloat(carPrice) || 0;
    const downPaymentNum = parseFloat(downPayment) || 0;
    const interestRateNum = parseFloat(interestRate) || 0;

    // Calculate down payment amount
    setDownPaymentAmount(downPaymentNum);

    // Calculate amount financed
    const calculatedAmountFinanced = Math.max(0, carPriceNum - downPaymentNum);
    setAmountFinanced(calculatedAmountFinanced);

    // Calculate monthly payment
    if (calculatedAmountFinanced > 0 && loanTerm > 0) {
      const monthlyRate = interestRateNum / 100 / 12;

      if (monthlyRate === 0) {
        // No interest
        setMonthlyPayment(calculatedAmountFinanced / loanTerm);
      } else {
        // With interest
        const x = Math.pow(1 + monthlyRate, loanTerm);
        const calculatedMonthlyPayment =
          (calculatedAmountFinanced * x * monthlyRate) / (x - 1);
        setMonthlyPayment(calculatedMonthlyPayment);
      }
    } else {
      setMonthlyPayment(0);
    }
  }, [carPrice, downPayment, interestRate, loanTerm]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value).replace("KES", "KSh");
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-50">
      <div className="p-5 sm:p-6 md:p-8">
        {/* Header */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
          Auto Loan Calculator
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
          Use our calculator to estimate your monthly car payments.
        </p>

        {/* Form */}
        <div className="space-y-4 sm:space-y-6">
          {/* Total Price */}
          <div>
            <label className="block text-gray-700 text-sm sm:text-base font-medium mb-1 sm:mb-2">
              Total Price
            </label>
            <div className="relative">
              <input
                type="text"
                value={carPrice}
                onChange={(e) => handleNumberInput(e, setCarPrice)}
                className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all text-gray-800"
                placeholder="Enter price in KSh"
              />
            </div>
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Down payment */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Down payment
              </label>
              <input
                type="text"
                value={downPayment}
                onChange={(e) => handleNumberInput(e, setDownPayment)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all text-gray-800"
                placeholder="0"
              />
            </div>

            {/* Payment Frequency */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Payment Frequency
              </label>
              <div className="relative">
                <select
                  value={paymentFrequency}
                  onChange={(e) => setPaymentFrequency(e.target.value)}
                  className="w-full appearance-none px-4 py-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all text-gray-800 bg-white"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Bi-weekly">Bi-weekly</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Interest rate
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={interestRate}
                  onChange={(e) => handleNumberInput(e, setInterestRate)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-800"
                  placeholder="0%"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
              </div>
            </div>

            {/* Loan Term */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Terms
              </label>
              <div className="relative">
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(parseInt(e.target.value, 10))}
                  className="w-full appearance-none px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-800 bg-white"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3e%3cpath stroke=%27%236b7280%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27M6 8l4 4 4-4%27/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
                >
                  <option value="12">12 months</option>
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                  <option value="48">48 months</option>
                  <option value="60">60 months</option>
                  <option value="72">72 months</option>
                  <option value="84">84 months</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-2 sm:space-y-3 mt-4 pt-4 sm:mt-6 sm:pt-6 border-t border-gray-200">
            {/* Down payment amount */}
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-600">
                Down payment amount
              </span>
              <span className="font-medium text-gray-900">
                {formatCurrency(downPaymentAmount)}
              </span>
            </div>

            {/* Amount financed */}
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-600">
                Amount financed
              </span>
              <span className="font-medium text-gray-900">
                {formatCurrency(amountFinanced)}
              </span>
            </div>

            {/* Monthly payment */}
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-orange-500 font-semibold">
                Monthly payment
              </span>
              <span className="font-bold text-orange-500 text-lg sm:text-xl">
                {formatCurrency(monthlyPayment)}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <button
            type="button"
            className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white py-3 sm:py-4 px-4 rounded-lg sm:rounded-xl font-medium transition-all shadow-md hover:shadow-lg text-center focus:outline-none mt-4 sm:mt-6"
          >
            Apply for a loan
          </button>
        </div>
      </div>
    </div>
  );
}
