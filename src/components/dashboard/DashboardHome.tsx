import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Upload, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import AddExpenseModal from './AddExpenseModal';
import UploadReceiptModal from './UploadReceiptModal';
import BudgetAlert from './BudgetAlert';

interface ExpenseSummary {
  totalAmount: number;
  topCategory: string;
  recentExpenses: any[];
  categoryBreakdown: Record<string, number>;
}

interface UserSettings {
  monthly_budget: number;
}

const DashboardHome = () => {
  const { user } = useAuth();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isUploadReceiptOpen, setIsUploadReceiptOpen] = useState(false);
  const [expenseSummary, setExpenseSummary] = useState<ExpenseSummary>({
    totalAmount: 0,
    topCategory: '',
    recentExpenses: [],
    categoryBreakdown: {}
  });
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadExpenseSummary();
      loadUserSettings();
    }
  }, [user]);

  const loadUserSettings = async () => {
    try {
      const { data, error } = await supabase.rpc('get_user_settings', { 
        user_uuid: user?.id 
      });

      if (error) throw error;

      if (data && data.length > 0) {
        setUserSettings(data[0]);
      } else {
        // Create default settings if they don't exist
        const { data: newSettings, error: createError } = await supabase.rpc('upsert_user_settings', {
          user_uuid: user?.id,
          p_monthly_budget: 5000
        });
        
        if (createError) throw createError;
        
        if (newSettings && newSettings.length > 0) {
          setUserSettings(newSettings[0]);
        }
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
      // Set default budget if loading fails
      setUserSettings({ monthly_budget: 5000 });
    }
  };

  // Auto-refresh when expenses are added
  useEffect(() => {
    const channel = supabase
      .channel('expense-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'expenses',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          console.log('New expense added, refreshing data...');
          loadExpenseSummary();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const loadExpenseSummary = async () => {
    try {
      const currentMonth = new Date();
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      // Get current month expenses
      const { data: expenses, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user?.id)
        .gte('date', firstDay.toISOString().split('T')[0])
        .lte('date', lastDay.toISOString().split('T')[0])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading expenses:', error);
        return;
      }

      // Calculate summary
      const totalAmount = expenses?.reduce((sum, expense) => sum + parseFloat(expense.amount.toString()), 0) || 0;
      
      // Category breakdown
      const categoryBreakdown: Record<string, number> = {};
      expenses?.forEach(expense => {
        const amount = parseFloat(expense.amount.toString());
        categoryBreakdown[expense.category] = (categoryBreakdown[expense.category] || 0) + amount;
      });

      // Top category
      const topCategory = Object.entries(categoryBreakdown).reduce((a, b) => 
        categoryBreakdown[a[0]] > categoryBreakdown[b[0]] ? a : b, ['', 0]
      )[0] || '';

      // Recent expenses (last 5)
      const recentExpenses = expenses?.slice(0, 5) || [];

      setExpenseSummary({
        totalAmount,
        topCategory,
        recentExpenses,
        categoryBreakdown
      });
    } catch (error) {
      console.error('Error loading expense summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthlyBudget = userSettings?.monthly_budget || 5000;
  const budgetProgress = (expenseSummary.totalAmount / monthlyBudget) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BudgetAlert />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Here's your expense overview for this month.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setIsAddExpenseOpen(true)}>
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <Plus className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Expense</h3>
              <p className="text-gray-600">Quickly record a new expense</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setIsUploadReceiptOpen(true)}>
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <Upload className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Receipt</h3>
              <p className="text-gray-600">Scan and extract expense data</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${expenseSummary.totalAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {budgetProgress > 100 ? '+' : ''}{(budgetProgress - 100).toFixed(1)}% from budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{expenseSummary.topCategory || 'None'}</div>
            <p className="text-xs text-muted-foreground">
              ${(expenseSummary.categoryBreakdown[expenseSummary.topCategory] || 0).toFixed(2)} spent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgetProgress.toFixed(1)}%</div>
            <Progress value={Math.min(budgetProgress, 100)} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Expenses */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription>Your latest spending activity</CardDescription>
        </CardHeader>
        <CardContent>
          {expenseSummary.recentExpenses.length > 0 ? (
            <div className="space-y-4">
              {expenseSummary.recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
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
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No expenses recorded yet this month.</p>
              <Button onClick={() => setIsAddExpenseOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Expense
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddExpenseModal 
        open={isAddExpenseOpen} 
        onOpenChange={setIsAddExpenseOpen}
        onSuccess={loadExpenseSummary}
      />
      
      <UploadReceiptModal 
        isOpen={isUploadReceiptOpen}
        onClose={() => setIsUploadReceiptOpen(false)}
        onSuccess={loadExpenseSummary}
      />
    </div>
  );
};

export default DashboardHome;
