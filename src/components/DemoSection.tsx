
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Plus, ChartBar } from "lucide-react";

const DemoSection = () => {
  const steps = [
    {
      icon: <Plus className="w-6 h-6 text-blue-600" />,
      title: "Add Expense",
      description: "Quickly add expenses manually or upload receipt photos"
    },
    {
      icon: <Camera className="w-6 h-6 text-purple-600" />,
      title: "Auto-Extract",
      description: "AI automatically extracts details from your receipts"
    },
    {
      icon: <ChartBar className="w-6 h-6 text-green-600" />,
      title: "Analyze & Track",
      description: "View insights and track your spending patterns"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            See How It
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the power of intelligent expense tracking in three simple steps.
          </p>
        </div>
        
        {/* Demo Video Placeholder */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="overflow-hidden shadow-2xl border-0">
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-white/20 transition-colors cursor-pointer">
                  <div className="w-0 h-0 border-l-8 border-l-white border-y-6 border-y-transparent ml-1"></div>
                </div>
                <p className="text-white text-lg font-medium">Watch Product Demo</p>
                <p className="text-white/70 text-sm mt-1">2 minutes overview</p>
              </div>
              
              {/* Floating UI elements to simulate app interface */}
              <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-white text-sm">Live Demo</span>
                </div>
              </div>
              
              <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-white text-sm">
                  <div className="flex items-center space-x-2">
                    <ChartBar className="w-4 h-4" />
                    <span>$2,847 tracked</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {step.title}
              </h3>
              
              <p className="text-gray-600">
                {step.description}
              </p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 transform -translate-x-1/2"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
          >
            Try Interactive Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
