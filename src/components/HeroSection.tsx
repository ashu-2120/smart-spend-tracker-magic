
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      // User is already logged in, could navigate to dashboard if it exists
      return;
    } else {
      navigate('/auth');
    }
  };

  const handleTryDemo = () => {
    navigate('/demo'); // This could be implemented later
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-teal-400/20 backdrop-blur-3xl"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          {/* Badge */}
          <Badge className="inline-flex items-center space-x-2 bg-green-100 text-green-800 mb-8 px-6 py-2">
            <Zap className="w-4 h-4" />
            <span>AI-Powered Expense Tracking</span>
          </Badge>

          {/* Main Headlines */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Smarter Spending
            </span>
            <br />
            Starts Here
          </h1>

          {/* Supporting tagline */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Automatically track, categorize, and analyze your expenses — all in one place.
            Take control of your finances with intelligent insights.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleGetStarted}
            >
              {user ? "Go to Dashboard" : "Get Started"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 text-lg font-semibold transition-all duration-300"
              onClick={handleTryDemo}
            >
              Try the Demo
            </Button>
          </div>

          {/* Key benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Bank-Level Security</h3>
              <p className="text-gray-600 text-center">Your financial data is protected with enterprise-grade encryption</p>
            </div>

            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900">AI-Powered Automation</h3>
              <p className="text-gray-600 text-center">Smart categorization and OCR technology for effortless tracking</p>
            </div>

            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Actionable Insights</h3>
              <p className="text-gray-600 text-center">Get personalized recommendations to optimize your spending</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
