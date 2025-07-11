import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BudgetAlertProps {
  onDismiss?: () => void;
}

const BudgetAlert: React.FC<BudgetAlertProps> = ({ onDismiss }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [alertData, setAlertData] = useState<{
    currentSpending: number;
    budgetLimit: number;
    percentage: number;
  } | null>(null);

  useEffect(() => {
    if (user) {
      checkBudgetAlert();
    }
  }, [user]);

  const checkBudgetAlert = async () => {
    if (!user) return;

    try {
      // Get user settings
      const { data: settingsData, error: settingsError } = await supabase.rpc('get_user_settings', {
        user_uuid: user.id
      });

      if (settingsError || !settingsData || settingsData.length === 0) return;

      const settings = settingsData[0];
      if (!settings.budget_alerts || settings.monthly_budget <= 0) return;

      // Get current month's expenses
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('amount')
        .eq('user_id', user.id)
        .gte('date', firstDay.toISOString().split('T')[0])
        .lte('date', lastDay.toISOString().split('T')[0]);

      if (expensesError) throw expensesError;

      const totalSpending = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
      const percentage = (totalSpending / settings.monthly_budget) * 100;

      // Show alert if spending is over 80% of budget
      if (percentage >= 80) {
        setAlertData({
          currentSpending: totalSpending,
          budgetLimit: settings.monthly_budget,
          percentage: Math.round(percentage)
        });
        setIsVisible(true);

        // Send email alert if spending is over 100%
        if (percentage >= 100) {
          await sendBudgetAlertEmail(totalSpending, settings.monthly_budget);
        }
      }
    } catch (error) {
      console.error('Error checking budget alert:', error);
    }
  };

  const sendBudgetAlertEmail = async (currentSpending: number, budgetLimit: number) => {
    try {
      const monthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      const response = await fetch(`/functions/v1/send-budget-alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          user_email: user?.email,
          current_spending: currentSpending,
          budget_limit: budgetLimit,
          month_year: monthYear,
        }),
      });

      if (!response.ok) {
        console.error('Failed to send budget alert email');
      }
    } catch (error) {
      console.error('Error sending budget alert email:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!isVisible || !alertData) return null;

  const isOverBudget = alertData.percentage >= 100;

  return (
    <Alert className={`mb-4 ${isOverBudget ? 'border-red-500 bg-red-50' : 'border-orange-500 bg-orange-50'}`}>
      <AlertTriangle className={`h-4 w-4 ${isOverBudget ? 'text-red-600' : 'text-orange-600'}`} />
      <div className="flex-1">
        <AlertTitle className={isOverBudget ? 'text-red-800' : 'text-orange-800'}>
          {isOverBudget ? 'Budget Exceeded!' : 'Budget Alert'}
        </AlertTitle>
        <AlertDescription className={isOverBudget ? 'text-red-700' : 'text-orange-700'}>
          You've spent ${alertData.currentSpending.toFixed(2)} ({alertData.percentage}%) of your ${alertData.budgetLimit.toFixed(2)} monthly budget.
          {isOverBudget ? ' Consider reviewing your expenses.' : ' You\'re approaching your budget limit.'}
        </AlertDescription>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDismiss}
        className="ml-auto p-1"
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
};

export default BudgetAlert;