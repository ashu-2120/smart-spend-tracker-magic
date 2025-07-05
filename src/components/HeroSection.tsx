
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowDown, TrendingUp, Camera, BarChart3 } from "lucide-react";

const HeroSection = () => {
  const scrollToFeatures = () => {
    const featuresSection = document.querySelector('#features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToDemo = () => {
    const demoSection = document.querySelector('#demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden pt-16">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-emerald-600/5 to-teal-600/10"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Content */}
        <div className="text-center lg:text-left space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Smarter Spending
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {" "}Starts Here
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl">
              Automatically track, categorize, and analyze your expenses — all in one place. Take control of your finances with intelligent insights.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200"
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-2 border-green-200 text-green-700 hover:bg-green-50 transform hover:scale-105 transition-all duration-200"
              onClick={scrollToDemo}
            >
              Try the Demo
            </Button>
          </div>
          
          <div className="flex items-center justify-center lg:justify-start space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Free forever plan</span>
            </div>
          </div>
        </div>
        
        {/* Right Column - Enhanced Visual */}
        <div className="relative lg:block">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" 
              alt="Advanced expense tracking dashboard"
              className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            />
            
            {/* Enhanced floating dashboard preview */}
            <Card className="absolute -bottom-6 -left-6 p-4 bg-white/95 backdrop-blur-sm shadow-xl border-0 max-w-xs">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Smart Insights</h3>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-600">This Month</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 mt-1">$2,847.50</p>
                  <p className="text-xs text-green-600">↓ 12% vs last month</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">🍔 Food & Dining</span>
                    <span className="font-semibold text-gray-900">$487.30</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">🚗 Transportation</span>
                    <span className="font-semibold text-gray-900">$215.80</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">🛒 Shopping</span>
                    <span className="font-semibold text-gray-900">$324.15</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Screenshot feature highlight */}
            <Card className="absolute -top-4 -right-4 p-3 bg-white/95 backdrop-blur-sm shadow-lg border-0 max-w-40">
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-xs font-semibold text-gray-900">Screenshot to Track</p>
                  <p className="text-xs text-gray-600">AI-powered OCR</p>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Floating elements */}
          <div className="absolute -top-4 left-4 w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-20 animate-pulse"></div>
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
