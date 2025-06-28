
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      title: "Gain Financial Clarity",
      description: "See exactly where your money goes with detailed breakdowns and visual insights.",
      stat: "95% of users report better financial awareness"
    },
    {
      title: "Stay Within Budget",
      description: "Set budgets and get alerts when you're approaching your limits.",
      stat: "Average 23% reduction in overspending"
    },
    {
      title: "Spot Spending Trends",
      description: "Identify unusual patterns and optimize your spending habits over time.",
      stat: "Users save an average of $340/month"
    },
    {
      title: "Save Time with Automation",
      description: "Let AI handle categorization and data entry so you can focus on what matters.",
      stat: "Save 4+ hours per month on expense tracking"
    },
    {
      title: "Plan Better with Insights",
      description: "Make informed financial decisions with comprehensive analytics and forecasting.",
      stat: "78% improvement in financial planning"
    },
    {
      title: "Secure & Private",
      description: "Your financial data is encrypted and protected with bank-level security.",
      stat: "256-bit encryption & SOC 2 compliant"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Our
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Expense Tracker?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of users who have transformed their financial habits with our intelligent tracking system.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0">
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Check className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {benefit.description}
                </p>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-blue-700">
                    {benefit.stat}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Testimonial */}
        <div className="mt-16 text-center">
          <Card className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-5 h-5 text-yellow-400 fill-current">★</div>
                ))}
              </div>
              <blockquote className="text-xl italic text-gray-700 mb-4">
                "This expense tracker completely changed how I manage my finances. The AI categorization saves me hours every month, and the insights help me make better spending decisions."
              </blockquote>
              <div className="text-gray-600">
                <p className="font-semibold">Sarah Johnson</p>
                <p className="text-sm">Marketing Manager, San Francisco</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
