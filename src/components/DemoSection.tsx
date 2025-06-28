
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Plus, ChartBar } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const DemoSection = () => {
  const steps = [
    {
      icon: <Plus className="w-6 h-6 text-green-600" />,
      title: "Add Expense",
      description: "Quickly add expenses manually or upload receipt photos"
    },
    {
      icon: <Camera className="w-6 h-6 text-emerald-600" />,
      title: "Auto-Extract",
      description: "AI automatically extracts details from your receipts"
    },
    {
      icon: <ChartBar className="w-6 h-6 text-teal-600" />,
      title: "Analyze & Track",
      description: "View insights and track your spending patterns"
    }
  ];

  const categoryData = [
    { name: 'Food & Dining', value: 450, fill: '#10b981' },
    { name: 'Transport', value: 230, fill: '#34d399' },
    { name: 'Shopping', value: 180, fill: '#6ee7b7' },
    { name: 'Entertainment', value: 150, fill: '#a7f3d0' },
    { name: 'Bills', value: 320, fill: '#065f46' },
  ];

  const weeklyData = [
    { day: 'Mon', amount: 45 },
    { day: 'Tue', amount: 78 },
    { day: 'Wed', amount: 32 },
    { day: 'Thu', amount: 89 },
    { day: 'Fri', amount: 65 },
    { day: 'Sat', amount: 120 },
    { day: 'Sun', amount: 55 },
  ];

  const chartConfig = {
    amount: {
      label: "Amount",
      color: "#10b981",
    },
  };

  return (
    <section id="demo-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            See How Fintrack
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {" "}Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the power of intelligent expense tracking in three simple steps.
          </p>
        </div>
        
        {/* Analytics Dashboard Preview */}
        <div className="max-w-6xl mx-auto mb-16">
          <Card className="overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Financial Dashboard</h3>
                <p className="text-gray-600">Real-time insights into your spending patterns</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Spending by Category - Pie Chart */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 text-center">Spending by Category</h4>
                  <ChartContainer config={chartConfig} className="h-64">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value) => [`$${value}`, 'Amount']}
                      />
                    </PieChart>
                  </ChartContainer>
                  
                  {/* Legend */}
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {categoryData.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.fill }}
                        ></div>
                        <span className="text-gray-700">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Weekly Spending - Bar Chart */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 text-center">Weekly Spending</h4>
                  <ChartContainer config={chartConfig} className="h-64">
                    <BarChart data={weeklyData}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value) => [`$${value}`, 'Amount']}
                      />
                      <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>
              
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-green-100">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">$1,330</div>
                  <div className="text-sm text-gray-600">Total This Month</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">$670</div>
                  <div className="text-sm text-gray-600">Budget Remaining</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600">127</div>
                  <div className="text-sm text-gray-600">Transactions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-green-100">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
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
                  <div className="w-12 h-0.5 bg-gradient-to-r from-green-200 to-emerald-200 transform -translate-x-1/2"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200"
          >
            Try Interactive Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
