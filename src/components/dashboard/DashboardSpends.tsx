
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { Search, Filter, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

interface Expense {
  id: string;
  expense_name: string;
  amount: number;
  category: string;
  date: string;
  attachment: string | null;
}

const expenseCategories = [
  'all', 'food', 'travel', 'bills', 'entertainment', 'shopping', 
  'healthcare', 'education', 'transportation', 'utilities', 
  'rent', 'groceries', 'clothing', 'fitness', 'subscriptions', 'other'
];

const DashboardSpends = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  
  const expensesPerPage = 10;

  useEffect(() => {
    if (user) {
      loadExpenses();
    }
  }, [user]);

  useEffect(() => {
    filterExpenses();
  }, [expenses, searchTerm, categoryFilter]);

  const loadExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      setExpenses(data || []);
    } catch (error: any) {
      console.error('Error loading expenses:', error);
      toast({
        title: "Error loading expenses",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterExpenses = () => {
    let filtered = expenses;

    if (searchTerm) {
      filtered = filtered.filter(expense =>
        expense.expense_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(expense => expense.category === categoryFilter);
    }

    setFilteredExpenses(filtered);
    setCurrentPage(1);
  };

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Expense deleted",
        description: "The expense has been successfully deleted.",
      });

      loadExpenses();
    } catch (error: any) {
      console.error('Error deleting expense:', error);
      toast({
        title: "Error deleting expense",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredExpenses.length / expensesPerPage);
  const startIndex = (currentPage - 1) * expensesPerPage;
  const endIndex = startIndex + expensesPerPage;
  const currentExpenses = filteredExpenses.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Expenses</h1>
        <p className="text-gray-600">Track and manage all your spending</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Expenses ({filteredExpenses.length})</CardTitle>
          <CardDescription>
            {filteredExpenses.length > 0 
              ? `Showing ${startIndex + 1}-${Math.min(endIndex, filteredExpenses.length)} of ${filteredExpenses.length} expenses`
              : 'No expenses found'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentExpenses.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">{expense.expense_name}</TableCell>
                        <TableCell>
                          <span className="capitalize bg-gray-100 px-2 py-1 rounded-full text-sm">
                            {expense.category}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold">${parseFloat(expense.amount.toString()).toFixed(2)}</TableCell>
                        <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingExpense(expense)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteExpense(expense.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No expenses found matching your criteria.</p>
              <Button onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSpends;
