
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { DollarSign, TrendingUp, Calendar, CreditCard } from 'lucide-react';

interface Expense {
  id: string;
  expense_name: string;
  amount: number;
  category: string;
  sub_category: string | null;
  date: string;
  notes: string | null;
  attachment: string | null;
}

interface CategoryData {
  category: string;
  amount: number;
  count: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

const DashboardExpenseSummary = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadExpenses();
    }
  }, [user]);

  const loadExpenses = async () => {
    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      const expenseData = data || [];
      setExpenses(expenseData);

      // Calculate total amount
      const total = expenseData.reduce((sum, expense) => sum + parseFloat(expense.amount.toString()), 0);
      setTotalAmount(total);

      // Process category data
      const categoryMap: Record<string, { amount: number; count: number }> = {};
      expenseData.forEach(expense => {
        const amount = parseFloat(expense.amount.toString());
        if (!categoryMap[expense.category]) {
          categoryMap[expense.category] = { amount: 0, count: 0 };
        }
        categoryMap[expense.category].amount += amount;
        categoryMap[expense.category].count += 1;
      });

      const categoryData = Object.entries(categoryMap).map(([category, data]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        amount: data.amount,
        count: data.count
      })).sort((a, b) => b.amount - a.amount);

      setCategoryData(categoryData);

      // Process monthly trend data
      const monthlyMap: Record<string, number> = {};
      expenseData.forEach(expense => {
        const expenseDate = new Date(expense.date);
        const month = expenseDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
        monthlyMap[month] = (monthlyMap[month] || 0) + parseFloat(expense.amount.toString());
      });

      const monthlyTrend = Object.entries(monthlyMap)
        .map(([month, amount]) => ({ month, amount }))
        .slice(-6); // Last 6 months

      setMonthlyTrend(monthlyTrend);
    } catch (error: any) {
      console.error('Error loading expenses:', error);
      setError('Failed to load expenses');
      toast({
        title: "Error loading expenses",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <Button onClick={loadExpenses} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Expense Summary</h1>
        <p className="text-gray-600">Overview of your spending patterns and key metrics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              All time total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenses.length}</div>
            <p className="text-xs text-muted-foreground">
              Recorded expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg per Transaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${expenses.length > 0 ? (totalAmount / expenses.length).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Average amount
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryData.length}</div>
            <p className="text-xs text-muted-foreground">
              Unique categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {categoryData.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Category Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>Distribution of expenses across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percentage }) => `${category} (${(percentage || 0).toFixed(1)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`$${value.toFixed(2)}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Categories Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
                <CardDescription>Highest spending categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [`$${value.toFixed(2)}`, 'Amount']} />
                    <Bar dataKey="amount" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trend */}
          {monthlyTrend.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Monthly Spending Trend</CardTitle>
                <CardDescription>Your spending pattern over recent months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [`$${value.toFixed(2)}`, 'Amount']} />
                    <Line type="monotone" dataKey="amount" stroke="#22c55e" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Recent Expenses */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>Your latest spending activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{expense.expense_name}</p>
                      <p className="text-sm text-gray-600 capitalize">{expense.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${parseFloat(expense.amount.toString()).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{new Date(expense.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">No expense data available. Start by adding your first expense!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardExpenseSummary;
