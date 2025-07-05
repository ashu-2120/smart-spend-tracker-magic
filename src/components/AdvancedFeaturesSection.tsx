
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  Brain, 
  Camera, 
  Scan, 
  FileImage,
  Zap,
  MessageSquare
} from "lucide-react";

const AdvancedFeaturesSection = () => {
  const features = [
    {
      icon: <PlusCircle className="w-8 h-8 text-blue-600" />,
      title: "Manual Expense Entry",
      description: "Easily add expenses with expense name, amount, category, date, and attach receipts or invoices for complete record keeping.",
      highlights: ["Custom categories", "Receipt attachments", "Date flexibility", "Detailed notes"],
      color: "blue"
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      title: "Automatic Categorization",
      description: "Intelligent AI-powered tagging automatically sorts your transactions into categories like Food, Travel, Bills, Shopping, and more.",
      highlights: ["Smart AI tagging", "Custom categories", "Learning algorithm", "Bulk categorization"],
      color: "purple"
    },
    {
      icon: <Camera className="w-8 h-8 text-green-600" />,
      title: "Screenshot-Based Recording",
      description: "Revolutionary feature to record expenses via screenshots from emails, receipts, or statements using advanced OCR technology.",
      highlights: ["OCR technology", "Email parsing", "Receipt scanning", "Auto-extraction"],
      color: "green",
      isNew: true
    }
  ];

  const ocrSteps = [
    {
      step: 1,
      icon: <FileImage className="w-6 h-6 text-blue-600" />,
      title: "Upload Screenshot",
      description: "Take or upload a screenshot of your receipt, email, or statement"
    },
    {
      step: 2,
      icon: <Scan className="w-6 h-6 text-purple-600" />,
      title: "AI Processing",
      description: "Our OCR engine automatically extracts key details from the image"
    },
    {
      step: 3,
      icon: <Zap className="w-6 h-6 text-green-600" />,
      title: "Auto-Population",
      description: "Expense details are automatically filled: name, amount, category, and date"
    }
  ];

  return (
    <section id="features-section" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Advanced Features for
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {" "}Smart Tracking
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the next generation of expense tracking with AI-powered automation, 
            intelligent categorization, and revolutionary screenshot-based recording.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="relative group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              {feature.isNew && (
                <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  NEW
                </Badge>
              )}
              <CardContent className="p-8">
                <div className="mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                
                <div className="space-y-2">
                  {feature.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full bg-${feature.color}-500`}></div>
                      <span className="text-sm text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Screenshot Feature Deep Dive */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                  Revolutionary Feature
                </Badge>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Screenshot to Expense in Seconds
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Transform the way you track expenses. Simply screenshot any receipt, email confirmation, 
                or statement, and watch our AI automatically extract and categorize all the details.
              </p>
              
              <div className="space-y-6">
                {ocrSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Step {step.step}: {step.title}
                      </h4>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80" 
                alt="OCR technology demonstration"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              
              {/* Floating OCR demo card */}
              <Card className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Extracted: "Starbucks Coffee - $4.75"</p>
                    <p className="text-xs text-gray-600">Categorized as Food & Dining</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvancedFeaturesSection;
