
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Check, Camera, ChartBar } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Plus className="w-8 h-8 text-blue-600" />,
      title: "Manual Expense Tracking",
      description: "Add expenses quickly with all the details you need - name, amount, category, date, and attachments.",
      details: ["Expense Name & Amount", "Smart Categories", "Date Selection", "Receipt Attachments"],
      gradient: "from-blue-50 to-indigo-50"
    },
    {
      icon: <Check className="w-8 h-8 text-green-600" />,
      title: "Smart Auto-Categorization",
      description: "Let AI automatically categorize your expenses based on history and patterns to save you time.",
      details: ["AI-Powered Recognition", "Learning Algorithm", "Custom Categories", "Bulk Categorization"],
      gradient: "from-green-50 to-emerald-50"
    },
    {
      icon: <Camera className="w-8 h-8 text-purple-600" />,
      title: "Screenshot-Based Detection",
      description: "Upload receipt photos and let OCR technology extract all the details automatically.",
      details: ["OCR Technology", "Auto-Extract Details", "Multiple Formats", "High Accuracy"],
      gradient: "from-purple-50 to-pink-50"
    },
    {
      icon: <ChartBar className="w-8 h-8 text-orange-600" />,
      title: "Powerful Analytics",
      description: "Get detailed insights with comprehensive reports, trends, and spending analysis.",
      details: ["Weekly & Monthly Reports", "Budget Tracking", "Trend Analysis", "Merchant Insights"],
      gradient: "from-orange-50 to-red-50"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Smart Tracking
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to take control of your finances, powered by intelligent automation and detailed analytics.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-8">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
