
import { Card, CardContent } from "@/components/ui/card";
import { Receipt, Zap, Camera, BarChart3, Target, Shield } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Receipt,
      title: "Manual Expense Tracking",
      description: "Add expenses with all details - name, amount, category, date, and attach receipts or bills for complete record keeping."
    },
    {
      icon: Zap,
      title: "Smart Auto-Categorization",
      description: "Automatically categorize your expenses based on history and patterns. Save time and improve accuracy with intelligent suggestions."
    },
    {
      icon: Camera,
      title: "Smart Receipt Scanning",
      description: "Simply snap a photo of your receipt and watch the magic happen. Our AI instantly reads and extracts the merchant name, total amount, date, and suggests the perfect category - all in seconds. No more manual typing!"
    },
    {
      icon: BarChart3,
      title: "Powerful Analytics",
      description: "Get detailed insights with weekly/monthly overviews, category breakdowns, spending trends, and budget tracking with beautiful charts."
    },
    {
      icon: Target,
      title: "Budget Management",
      description: "Set budgets by category and track your progress. Get alerts when you're approaching your limits to stay on track."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your financial data is encrypted and secure. Export your data anytime and maintain complete control over your information."
    }
  ];

  return (
    <section id="features-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
          Key Features to Supercharge Your Finances
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          Unlock the power of effortless expense tracking and gain complete control over your financial life.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-green-100 hover:border-green-200">
              <CardContent className="p-6">
                <feature.icon className="w-8 h-8 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
