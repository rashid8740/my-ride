// src/components/calculator/LoanCalculator.jsx
"use client";
import { useState, useEffect } from "react";
import { Calculator, DollarSign, Calendar, Percent } from "lucide-react";

export default function LoanCalculator() {
  const [carPrice, setCarPrice] = useState(30000);
  const [downPayment, setDownPayment] = useState(5000);
  const [interestRate, setInterestRate] = useState(4.5);
  const [loanTerm, setLoanTerm] = useState(60);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  // Calculate monthly payment and related values
  useEffect(() => {
    // Calculate the loan amount
    const loanAmount = carPrice - downPayment;

    // Convert annual interest rate to monthly rate
    const monthlyRate = interestRate / 100 / 12;

    // Calculate monthly payment using the formula
    if (monthlyRate === 0) {
      setMonthlyPayment(loanAmount / loanTerm);
    } else {
      const x = Math.pow(1 + monthlyRate, loanTerm);
      setMonthlyPayment((loanAmount * x * monthlyRate) / (x - 1));
    }

    // Calculate total payment and interest
    const calculatedMonthlyPayment =
      (loanAmount * Math.pow(1 + monthlyRate, loanTerm) * monthlyRate) /
      (Math.pow(1 + monthlyRate, loanTerm) - 1);
    const calculatedTotalPayment = calculatedMonthlyPayment * loanTerm;
    setTotalPayment(calculatedTotalPayment);
    setTotalInterest(calculatedTotalPayment - loanAmount);
  }, [carPrice, downPayment, interestRate, loanTerm]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Custom range slider thumb component
  const RangeThumb = ({ value, max, color }) => {
    const percentage = (value / max) * 100;
    return (
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="p-6 md:p-8">
        <div className="flex items-center mb-6">
          <div className="bg-orange-500 p-3 rounded-full mr-4">
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Auto Loan Calculator
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Sliders */}
          <div className="space-y-6">
            {/* Car Price */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-white text-sm font-medium">
                  Car Price
                </label>
                <span className="text-orange-400 font-bold">
                  {formatCurrency(carPrice)}
                </span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                <div className="w-full">
                  <RangeThumb
                    value={carPrice}
                    max={100000}
                    color="bg-orange-500"
                  />
                  <input
                    type="range"
                    min="5000"
                    max="100000"
                    step="1000"
                    value={carPrice}
                    onChange={(e) => setCarPrice(Number(e.target.value))}
                    className="w-full h-2 appearance-none bg-transparent absolute mt-[-8px] cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">$5,000</span>
                <span className="text-xs text-gray-400">$100,000</span>
              </div>
            </div>

            {/* Down Payment */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-white text-sm font-medium">
                  Down Payment
                </label>
                <span className="text-orange-400 font-bold">
                  {formatCurrency(downPayment)}
                </span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                <div className="w-full">
                  <RangeThumb
                    value={downPayment}
                    max={carPrice / 2}
                    color="bg-green-500"
                  />
                  <input
                    type="range"
                    min="0"
                    max={carPrice / 2}
                    step="500"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full h-2 appearance-none bg-transparent absolute mt-[-8px] cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">$0</span>
                <span className="text-xs text-gray-400">
                  {formatCurrency(carPrice / 2)}
                </span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-white text-sm font-medium">
                  Interest Rate
                </label>
                <span className="text-orange-400 font-bold">
                  {interestRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center">
                <Percent className="h-5 w-5 text-gray-400 mr-2" />
                <div className="w-full">
                  <RangeThumb
                    value={interestRate}
                    max={20}
                    color="bg-blue-500"
                  />
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 appearance-none bg-transparent absolute mt-[-8px] cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">0%</span>
                <span className="text-xs text-gray-400">20%</span>
              </div>
            </div>

            {/* Loan Term */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-white text-sm font-medium">
                  Loan Term
                </label>
                <span className="text-orange-400 font-bold">
                  {loanTerm} months
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <div className="w-full">
                  <RangeThumb value={loanTerm} max={84} color="bg-purple-500" />
                  <input
                    type="range"
                    min="12"
                    max="84"
                    step="12"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full h-2 appearance-none bg-transparent absolute mt-[-8px] cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">12 mo</span>
                <span className="text-xs text-gray-400">84 mo</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-white font-medium mb-4 text-center">
              Loan Summary
            </h3>

            {/* Monthly Payment */}
            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <p className="text-gray-300 text-sm mb-1">
                Estimated Monthly Payment
              </p>
              <p className="text-3xl font-bold text-white">
                {formatCurrency(monthlyPayment)}
                <span className="text-sm text-gray-400">/mo</span>
              </p>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-1">Loan Amount</p>
                <p className="text-xl font-bold text-white">
                  {formatCurrency(carPrice - downPayment)}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-1">Down Payment</p>
                <p className="text-xl font-bold text-white">
                  {formatCurrency(downPayment)}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-1">Total Interest</p>
                <p className="text-xl font-bold text-orange-400">
                  {formatCurrency(totalInterest)}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-1">Total Payment</p>
                <p className="text-xl font-bold text-green-400">
                  {formatCurrency(totalPayment)}
                </p>
              </div>
            </div>

            <button className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors shadow-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Apply for Financing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
