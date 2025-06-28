
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowDown, Calendar, ChartBar, Camera } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-indigo-600/10"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Content */}
        <div className="text-center lg:text-left space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Track Smarter.
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Spend Better.
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl">
              An intelligent expense tracker that helps you manage your money with ease and gain complete financial clarity.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
            >
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-2 hover:bg-gray-50 transform hover:scale-105 transition-all duration-200"
            >
              View Demo
            </Button>
          </div>
          
          <div className="flex items-center justify-center lg:justify-start space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Free forever plan</span>
            </div>
          </div>
        </div>
        
        {/* Right Column - Dashboard Preview */}
        <div className="relative lg:block">
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-2xl border-0 transform hover:scale-105 transition-all duration-300">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Expense Dashboard</h3>
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ChartBar className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-600">This Month</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-1">$2,847</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-600">Budget Left</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-1">$1,153</p>
                </div>
              </div>
              
              {/* Recent Expenses */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Recent Expenses</h4>
                <div className="space-y-2">
                  {[
                    { name: "Coffee Shop", amount: "$4.50", category: "Food", color: "bg-orange-100 text-orange-800" },
                    { name: "Uber Ride", amount: "$12.30", category: "Transport", color: "bg-blue-100 text-blue-800" },
                    { name: "Grocery Store", amount: "$67.82", category: "Food", color: "bg-green-100 text-green-800" }
                  ].map((expense, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{expense.name}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${expense.color}`}>
                          {expense.category}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{expense.amount}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          
          {/* Floating elements */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-gray-400" />
      </div>
    </section>
  );
};

export default HeroSection;
