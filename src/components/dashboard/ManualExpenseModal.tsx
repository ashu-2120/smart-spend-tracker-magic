import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, PlusCircle } from 'lucide-react';

interface ManualExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  prefilledData?: {
    expense_name?: string;
    amount?: number;
    category?: string;
    date?: string;
    merchant?: string;
  };
}

const categories = [
  'food', 'travel', 'bills', 'entertainment', 'shopping', 'healthcare',
  'education', 'transportation', 'utilities', 'rent', 'groceries',
  'clothing', 'fitness', 'subscriptions', 'other'
];

const ManualExpenseModal: React.FC<ManualExpenseModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  prefilledData 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    expense_name: prefilledData?.expense_name || '',
    amount: prefilledData?.amount?.toString() || '',
    category: prefilledData?.category || '',
    date: prefilledData?.date || new Date().toISOString().split('T')[0],
    notes: prefilledData?.merchant ? `Merchant: ${prefilledData.merchant}` : ''
  });

  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate required fields
    if (!formData.expense_name || !formData.amount || !formData.category) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in expense name, amount, and category.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          user_id: user.id,
          expense_name: formData.expense_name,
          amount: parseFloat(formData.amount),
          category: formData.category as any,
          date: formData.date,
          notes: formData.notes || null,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Expense Added Successfully",
        description: "Your expense has been recorded.",
      });

      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        expense_name: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });

    } catch (error: any) {
      console.error('Error adding expense:', error);
      toast({
        title: "Failed to Add Expense",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Add Expense Manually
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expense_name">Expense Name *</Label>
            <Input
              id="expense_name"
              value={formData.expense_name}
              onChange={(e) => setFormData({ ...formData, expense_name: e.target.value })}
              placeholder="e.g., Lunch at Restaurant"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Optional notes..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Expense'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManualExpenseModal;