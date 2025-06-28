
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

const CTASection = () => {
  const features = [
    "Unlimited expense tracking",
    "AI-powered categorization",
    "Receipt OCR scanning",
    "Detailed analytics & reports",
    "Budget tracking & alerts",
    "Data export capabilities"
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/4 right-0 w-32 h-32 bg-white rounded-full translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/4 w-24 h-24 bg-white rounded-full translate-y-1/2"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Take Control of
            <span className="block">Your Finances?</span>
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Join thousands of users who have transformed their spending habits with our intelligent expense tracker.
          </p>
        </div>
        
        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-12">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-6 text-left">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-xl"
            >
              Start Tracking Now - Free Forever
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-200"
            >
              Download Mobile App
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-blue-100">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Setup in 2 minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
