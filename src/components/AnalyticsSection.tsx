
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Calendar,
  Target,
  DollarSign,
  ArrowUp,
  ArrowDown
} from "lucide-react";

const AnalyticsSection = () => {
  const analyticsFeatures = [
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      title: "Comprehensive Reports",
      description: "View detailed weekly and monthly reports showing total budget spent, remaining balance, and spending trends.",
      metrics: ["Weekly summaries", "Monthly overviews", "Budget tracking", "Remaining balance"]
    },
    {
      icon: <PieChart className="w-8 h-8 text-purple-600" />,
      title: "Visual Breakdowns",
      description: "Interactive graphs showing category-wise spending, day-wise trends, and merchant-specific patterns.",
      metrics: ["Category analysis", "Daily patterns", "Merchant insights", "Trend visualization"]
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: "Comparative Analytics",
      description: "Week-over-Week and Month-over-Month comparisons to identify spending patterns and unusual spikes.",
      metrics: ["WoW comparisons", "MoM analysis", "Pattern detection", "Spike alerts"]
    },
    {
      icon: <Target className="w-8 h-8 text-orange-600" />,
      title: "Spending Splits",
      description: "Analyze expenses by ticket size to understand the frequency of small, medium, and large purchases.",
      metrics: ["Small purchases", "Medium expenses", "Large transactions", "Frequency analysis"]
    }
  ];

  const mockData = {
    weeklySpend: "$847.32",
    monthlySpend: "$2,847.50",
    weeklyChange: "-12%",
    monthlyChange: "+3%",
    categories: [
      { name: "Food & Dining", amount: "$487.30", percentage: "34%", trend: "up" },
      { name: "Transportation", amount: "$324.15", percentage: "23%", trend: "down" },
      { name: "Shopping", amount: "$298.45", percentage: "21%", trend: "up" },
      { name: "Bills & Utilities", amount: "$215.80", percentage: "15%", trend: "stable" }
    ]
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Spending Analysis &
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Smart Insights
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get actionable insights from your spending data with comprehensive analytics, 
            visual reports, and intelligent pattern recognition.
          </p>
        </div>

        {/* Analytics Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {analyticsFeatures.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{feature.description}</p>
                
                <div className="space-y-1">
                  {feature.metrics.map((metric, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <span className="text-xs text-gray-700">{metric}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Live Analytics Dashboard Preview */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Summary Cards */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Live Analytics Preview</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">This Week</p>
                      <p className="text-2xl font-bold">{mockData.weeklySpend}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <ArrowDown className="w-4 h-4" />
                        <span className="text-sm">{mockData.weeklyChange}</span>
                      </div>
                    </div>
                    <Calendar className="w-8 h-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">This Month</p>
                      <p className="text-2xl font-bold">{mockData.monthlySpend}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <ArrowUp className="w-4 h-4" />
                        <span className="text-sm">{mockData.monthlyChange}</span>
                      </div>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5 text-purple-600" />
                  <span>Category Breakdown</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-red-500' :
                          index === 1 ? 'bg-blue-500' :
                          index === 2 ? 'bg-green-500' : 'bg-orange-500'
                        }`}></div>
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-gray-900">{category.amount}</span>
                        <Badge variant="outline" className="text-xs">
                          {category.percentage}
                        </Badge>
                        {category.trend === 'up' && <ArrowUp className="w-3 h-3 text-red-500" />}
                        {category.trend === 'down' && <ArrowDown className="w-3 h-3 text-green-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visual Chart Placeholder */}
          <div className="flex flex-col justify-center">
            <Card className="h-full">
              <CardContent className="p-8 flex flex-col items-center justify-center h-full min-h-96">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80" 
                  alt="Analytics dashboard preview"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <div className="mt-6 text-center">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Interactive Charts & Graphs</h4>
                  <p className="text-gray-600 text-sm">
                    Visualize your spending patterns with dynamic charts, trend lines, and comparative analytics
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsSection;
