import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PiggyBank, Clock, Lock, TrendingUp } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: PiggyBank,
      title: "Maximize Savings",
      description: "Identify areas where you can cut back and optimize your spending to achieve your financial goals faster."
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Automate expense tracking and eliminate manual data entry, freeing up your time for what matters most."
    },
    {
      icon: Lock,
      title: "Stay Secure",
      description: "Protect your financial data with advanced encryption and security measures, ensuring your peace of mind."
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your financial performance and see how your spending habits evolve over time with intuitive charts and reports."
    }
  ];

  return (
    <section id="benefits-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {" "}Fintrack?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your financial habits and take control of your money with intelligent insights and effortless tracking.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Benefits List */}
          <div className="space-y-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:from-green-200 group-hover:to-emerald-200 transition-colors duration-200">
                  <benefit.icon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Stats/Testimonial */}
          <div className="space-y-8">
            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-green-100">
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-center space-x-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">89%</div>
                      <div className="text-sm text-gray-600">Save Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-600">$847</div>
                      <div className="text-sm text-gray-600">Avg. Monthly Savings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-teal-600">95%</div>
                      <div className="text-sm text-gray-600">User Satisfaction</div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-green-100 pt-6">
                  <blockquote className="text-gray-700 italic text-lg leading-relaxed">
                    "Fintrack completely changed how I manage my finances. The receipt scanning feature alone saves me hours every week!"
                  </blockquote>
                  <div className="mt-4 flex items-center justify-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-semibold">SJ</span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">Sarah Johnson</div>
                      <div className="text-sm text-gray-600">Small Business Owner</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            <div className="text-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200"
              >
                Start Your Free Trial
              </Button>
              <p className="text-sm text-gray-500 mt-2">No credit card required • 14-day free trial</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
