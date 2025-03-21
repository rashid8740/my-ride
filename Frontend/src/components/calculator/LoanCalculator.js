// src/components/sections/LoanCalculatorSection.jsx
"use client";
import { useState, useEffect } from "react";
import {
  DollarSign,
  Calendar,
  Percent,
  Car,
  ArrowRight,
  Check,
  ChevronDown,
} from "lucide-react";

export default function LoanCalculatorSection() {
  return (
    <section className="w-full py-16 sm:py-20 relative bg-gray-50 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 -right-40 w-96 h-96 bg-orange-100 rounded-full opacity-40"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-100 rounded-full opacity-40"></div>
        <div className="absolute top-1/4 left-1/3 w-24 h-24 bg-yellow-100 rounded-full opacity-30"></div>
        <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-purple-100 rounded-full opacity-30"></div>
      </div>

      {/* Section Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Estimate Your Monthly Payments
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Use our loan calculator to estimate monthly payments and find
            financing options that fit your budget.
          </p>
        </div>

        {/* Loan Calculator Component */}
        <div className="max-w-5xl mx-auto">
          <LoanCalculator />
        </div>

        {/* Additional Info */}
        <div className="max-w-4xl mx-auto mt-8 sm:mt-12 text-center text-gray-600 text-sm">
          <p>
            This calculator provides an estimate only. Actual terms may vary
            based on credit history, down payment, and other factors. Contact
            our financing department for personalized options.
          </p>
        </div>
      </div>
    </section>
  );
}

function LoanCalculator() {
  // Main calculator state
  const [carPrice, setCarPrice] = useState(30000);
  const [downPayment, setDownPayment] = useState(5000);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(60);

  // UI state
  const [focusedInput, setFocusedInput] = useState(null);
  const [showTermDropdown, setShowTermDropdown] = useState(false);

  // Calculation results
  const [loanAmount, setLoanAmount] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  // Payment breakdown
  const [principal, setPrincipal] = useState(0);
  const [interest, setInterest] = useState(0);

  // Calculate all loan values
  useEffect(() => {
    // Calculate the loan amount
    const calculatedLoanAmount = carPrice - downPayment;
    setLoanAmount(calculatedLoanAmount);

    // Convert annual interest rate to monthly rate
    const monthlyRate = interestRate / 100 / 12;

    if (monthlyRate === 0) {
      setMonthlyPayment(calculatedLoanAmount / loanTerm);
      setTotalPayment(calculatedLoanAmount);
      setTotalInterest(0);
    } else {
      const x = Math.pow(1 + monthlyRate, loanTerm);
      const calculatedMonthlyPayment =
        (calculatedLoanAmount * x * monthlyRate) / (x - 1);
      setMonthlyPayment(calculatedMonthlyPayment);

      const calculatedTotalPayment = calculatedMonthlyPayment * loanTerm;
      setTotalPayment(calculatedTotalPayment);
      setTotalInterest(calculatedTotalPayment - calculatedLoanAmount);
    }

    // Calculate monthly principal and interest
    const monthlyPrincipal = calculatedLoanAmount / loanTerm;
    setPrincipal(monthlyPrincipal);
    setInterest(monthlyPayment - monthlyPrincipal);
  }, [carPrice, downPayment, interestRate, loanTerm, monthlyPayment]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Handle number input changes with validation
  const handleInputChange = (e, setter, min, max) => {
    let value = e.target.value.replace(/[^0-9.]/g, "");

    if (value === "" || value === ".") {
      e.target.value = ""; // Clear the field for better UX
      return;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      if (numValue < min) setter(min);
      else if (numValue > max) setter(max);
      else setter(numValue);
    }
  };

  // Generate loan term options
  const termOptions = [12, 24, 36, 48, 60, 72, 84].map((months) => ({
    value: months,
    label: `${months} months${
      months === 60
        ? " (5 years)"
        : months === 72
        ? " (6 years)"
        : months === 84
        ? " (7 years)"
        : months === 36
        ? " (3 years)"
        : months === 48
        ? " (4 years)"
        : months === 24
        ? " (2 years)"
        : months === 12
        ? " (1 year)"
        : ""
    }`,
  }));

  // Get selected term label
  const getSelectedTermLabel = () => {
    const option = termOptions.find((opt) => opt.value === loanTerm);
    return option ? option.label : `${loanTerm} months`;
  };

  // Calculate what percentage of payment is principal vs interest
  const principalPercentage =
    monthlyPayment > 0 ? (principal / monthlyPayment) * 100 : 0;
  const interestPercentage = 100 - principalPercentage;

  return (
    <div className="overflow-hidden rounded-xl shadow-xl bg-white border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 sm:p-5">
        <h3 className="text-xl sm:text-2xl font-bold text-white">
          Auto Loan Calculator
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Input Column */}
        <div className="lg:col-span-7 p-4 sm:p-5 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {/* Car Price Input */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label className="text-gray-700 font-medium flex items-center text-sm">
                  <Car className="h-4 w-4 mr-1 text-orange-500" />
                  Vehicle Price
                </label>
                <div className="text-sm text-gray-500">
                  Loan:{" "}
                  <span className="font-semibold text-gray-800">
                    {formatCurrency(loanAmount)}
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign
                    className={`h-4 w-4 transition-colors ${
                      focusedInput === "carPrice"
                        ? "text-orange-500"
                        : "text-gray-400"
                    }`}
                  />
                </div>

                <input
                  type="text"
                  value={carPrice.toLocaleString()}
                  onChange={(e) =>
                    handleInputChange(e, setCarPrice, 5000, 150000)
                  }
                  onFocus={() => setFocusedInput("carPrice")}
                  onBlur={() => setFocusedInput(null)}
                  className="block w-full pl-9 pr-16 py-3 border-2 border-gray-200 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-800 text-base font-medium"
                  placeholder="Enter vehicle price"
                />

                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <div className="flex space-x-1">
                    <button
                      onClick={() =>
                        setCarPrice((prev) => Math.max(5000, prev - 1000))
                      }
                      className="bg-gray-100 hover:bg-gray-200 text-gray-600 h-7 w-7 rounded-full flex items-center justify-center transition-colors"
                    >
                      <span className="text-base font-bold">-</span>
                    </button>
                    <button
                      onClick={() =>
                        setCarPrice((prev) => Math.min(150000, prev + 1000))
                      }
                      className="bg-gray-100 hover:bg-gray-200 text-gray-600 h-7 w-7 rounded-full flex items-center justify-center transition-colors"
                    >
                      <span className="text-base font-bold">+</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Down Payment Input */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center text-sm">
                <DollarSign className="h-4 w-4 mr-1 text-orange-500" />
                Down Payment
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={downPayment.toLocaleString()}
                  onChange={(e) =>
                    handleInputChange(e, setDownPayment, 0, carPrice / 2)
                  }
                  onFocus={() => setFocusedInput("downPayment")}
                  onBlur={() => setFocusedInput(null)}
                  className="block w-full pl-3 pr-16 py-3 border-2 border-gray-200 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-800 text-base font-medium"
                  placeholder="Enter down payment"
                />

                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                  <span className="bg-gray-100 rounded-lg px-1.5 py-0.5 text-xs text-gray-500 mr-1">
                    {downPayment > 0
                      ? Math.round((downPayment / carPrice) * 100)
                      : 0}
                    %
                  </span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() =>
                        setDownPayment((prev) => Math.max(0, prev - 500))
                      }
                      className="bg-gray-100 hover:bg-gray-200 text-gray-600 h-7 w-7 rounded-full flex items-center justify-center transition-colors"
                    >
                      <span className="text-base font-bold">-</span>
                    </button>
                    <button
                      onClick={() =>
                        setDownPayment((prev) =>
                          Math.min(carPrice / 2, prev + 500)
                        )
                      }
                      className="bg-gray-100 hover:bg-gray-200 text-gray-600 h-7 w-7 rounded-full flex items-center justify-center transition-colors"
                    >
                      <span className="text-base font-bold">+</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Down Payment Quick Selectors */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[0, 10, 20, 30].map((percent) => (
                  <button
                    key={percent}
                    onClick={() =>
                      setDownPayment(Math.round(carPrice * (percent / 100)))
                    }
                    className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                      Math.round((downPayment / carPrice) * 100) === percent
                        ? "bg-orange-100 text-orange-600 border border-orange-200"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100"
                    }`}
                  >
                    {percent}%
                  </button>
                ))}
              </div>
            </div>

            {/* Loan Term Dropdown */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-1 text-orange-500" />
                Loan Term
              </label>

              <div className="relative">
                <button
                  onClick={() => setShowTermDropdown(!showTermDropdown)}
                  className={`w-full bg-white px-3 py-3 border-2 border-gray-200 rounded-lg text-left flex justify-between items-center transition-all ${
                    showTermDropdown
                      ? "border-orange-500 ring-1 ring-orange-500"
                      : "hover:border-gray-300"
                  }`}
                >
                  <span className="text-gray-800 font-medium text-base">
                    {getSelectedTermLabel()}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform ${
                      showTermDropdown ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {showTermDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-1 max-h-48 overflow-auto">
                    {termOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setLoanTerm(option.value);
                          setShowTermDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-orange-50 ${
                          loanTerm === option.value
                            ? "bg-orange-50 text-orange-600"
                            : "text-gray-700"
                        }`}
                      >
                        {option.label}
                        {loanTerm === option.value && (
                          <Check size={14} className="text-orange-500" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Interest Rate Input */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center text-sm">
                <Percent className="h-4 w-4 mr-1 text-orange-500" />
                Interest Rate
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={interestRate}
                  onChange={(e) => handleInputChange(e, setInterestRate, 0, 20)}
                  onFocus={() => setFocusedInput("interestRate")}
                  onBlur={() => setFocusedInput(null)}
                  className="block w-full pl-3 pr-16 py-3 border-2 border-gray-200 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-800 text-base font-medium"
                  placeholder="Enter interest rate"
                />

                <div className="absolute inset-y-0 right-10 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium">%</span>
                </div>

                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <button
                    onClick={() =>
                      setInterestRate((prev) =>
                        Math.max(0, parseFloat((prev - 0.25).toFixed(2)))
                      )
                    }
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 h-7 w-7 rounded-full flex items-center justify-center transition-colors"
                  >
                    <span className="text-base font-bold">-</span>
                  </button>
                  <button
                    onClick={() =>
                      setInterestRate((prev) =>
                        Math.min(20, parseFloat((prev + 0.25).toFixed(2)))
                      )
                    }
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 h-7 w-7 rounded-full flex items-center justify-center transition-colors"
                  >
                    <span className="text-base font-bold">+</span>
                  </button>
                </div>
              </div>

              {/* Interest Rate Quick Selectors */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[3.5, 4.5, 5.5, 6.5].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setInterestRate(rate)}
                    className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                      interestRate === rate
                        ? "bg-orange-100 text-orange-600 border border-orange-200"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-100"
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-5 flex flex-col">
          {/* Monthly Payment */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
            <span className="text-gray-300 text-sm">
              Estimated Monthly Payment
            </span>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">
                {formatCurrency(monthlyPayment)}
              </span>
              <span className="text-gray-300 ml-1.5 text-sm">/month</span>
            </div>

            {/* Payment Breakdown */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Principal</span>
                <span className="font-medium">
                  {formatCurrency(principal)}/mo
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Interest</span>
                <span className="font-medium text-orange-300">
                  {formatCurrency(interest)}/mo
                </span>
              </div>

              {/* Visual breakdown bar */}
              <div className="h-1.5 bg-gray-700 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full"
                  style={{ width: `${principalPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1 text-gray-400">
                <span>Principal {Math.round(principalPercentage)}%</span>
                <span>Interest {Math.round(interestPercentage)}%</span>
              </div>
            </div>
          </div>

          {/* Loan Details */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Vehicle price:</span>
              <span className="font-medium">{formatCurrency(carPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Down payment:</span>
              <span className="font-medium">{formatCurrency(downPayment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Loan amount:</span>
              <span className="font-medium">{formatCurrency(loanAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Loan term:</span>
              <span className="font-medium">{loanTerm} months</span>
            </div>
            <div className="col-span-2 flex justify-between border-t border-gray-700 pt-2 mt-1">
              <span className="text-gray-300">Total interest:</span>
              <span className="font-medium text-orange-300">
                {formatCurrency(totalInterest)}
              </span>
            </div>
            <div className="col-span-2 flex justify-between font-bold">
              <span className="text-gray-300">Total of all payments:</span>
              <span>{formatCurrency(totalPayment)}</span>
            </div>
          </div>

          {/* Financing CTA */}
          <div className="mt-auto">
            <button className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center group">
              Apply for Financing
              <ArrowRight
                className="ml-2 group-hover:translate-x-1 transition-transform"
                size={16}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
