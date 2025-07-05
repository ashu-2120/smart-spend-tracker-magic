
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Target, 
  Heart, 
  Lightbulb,
  Shield,
  Zap,
  CheckCircle
} from "lucide-react";

const ValuePropositionSection = () => {
  const benefits = [
    {
      icon: <Eye className="w-8 h-8 text-blue-600" />,
      title: "Enhanced Financial Visibility",
      description: "Get complete transparency into your spending habits with detailed breakdowns and real-time insights.",
      impact: "Know exactly where every dollar goes"
    },
    {
      icon: <Target className="w-8 h-8 text-green-600" />,
      title: "Smarter Budgeting",
      description: "Set intelligent budgets based on your spending patterns and receive proactive alerts and recommendations.",
      impact: "Save 20% more on average"
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: "Reduced Financial Stress",
      description: "Eliminate the anxiety of not knowing your financial status with automated tracking and clear reporting.",
      impact: "Peace of mind, guaranteed"
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-yellow-600" />,
      title: "Actionable Insights",
      description: "Receive personalized recommendations and insights to optimize your spending and improve your financial health.",
      impact: "Make better financial decisions"
    }
  ];

  const advantages = [
    "AI-powered automation saves hours of manual tracking",
    "Revolutionary screenshot OCR technology",
    "Bank-level security for your financial data",
    "Cross-platform synchronization",
    "Intelligent categorization learns your habits",
    "Comprehensive analytics and reporting",
    "No subscription fees for core features",
    "Export data anytime, anywhere"
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-white/20 text-white mb-4">
            Why Choose Our Expense Tracker?
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Transform Your Financial Future
          </h2>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Experience the benefits of enhanced financial visibility, smarter budgeting, 
            reduced stress, and actionable insights through our AI-enhanced platform.
          </p>
        </div>

        {/* Core Benefits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold mb-3">{benefit.title}</h3>
                <p className="text-green-100 text-sm mb-4 leading-relaxed">{benefit.description}</p>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                  <span className="text-green-200 text-sm font-medium">{benefit.impact}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Platform Advantages */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-6">
              The Smart Choice for Modern Finance Management
            </h3>
            <p className="text-green-100 text-lg mb-8 leading-relaxed">
              Our expense tracker combines cutting-edge AI technology with intuitive design 
              to deliver an unparalleled personal finance experience. Join thousands of users 
              who have already transformed their financial habits.
            </p>
            
            <div className="grid grid-cols-1 gap-3">
              {advantages.map((advantage, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                  </div>
                  <span className="text-green-100">{advantage}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-6">
                  <Shield className="w-8 h-8 text-green-300" />
                  <Zap className="w-8 h-8 text-yellow-300" />
                </div>
                <h4 className="text-2xl font-bold mb-4">Trusted by 50,000+ Users</h4>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-3xl font-bold text-green-300">98%</p>
                    <p className="text-green-100 text-sm">Accuracy Rate</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-green-300">5hrs</p>
                    <p className="text-green-100 text-sm">Saved Weekly</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-green-300">20%</p>
                    <p className="text-green-100 text-sm">More Savings</p>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Floating testimonial */}
            <Card className="absolute -top-4 -right-4 bg-white text-gray-900 p-4 max-w-64 shadow-xl">
              <p className="text-sm italic mb-2">
                "This app completely changed how I manage my finances. The OCR feature is a game-changer!"
              </p>
              <p className="text-xs text-gray-600">- Sarah M., Product Manager</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuePropositionSection;
