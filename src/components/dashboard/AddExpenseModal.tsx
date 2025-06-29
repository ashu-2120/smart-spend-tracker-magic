
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, Calendar } from 'lucide-react';

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const expenseCategories = [
  'food', 'travel', 'bills', 'entertainment', 'shopping', 
  'healthcare', 'education', 'transportation', 'utilities', 
  'rent', 'groceries', 'clothing', 'fitness', 'subscriptions', 'other'
];

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    expense_name: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    attachment: null as File | null
  });

  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('expense-attachments')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('expense-attachments')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add expenses.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      let attachmentUrl = null;
      
      if (formData.attachment) {
        attachmentUrl = await handleFileUpload(formData.attachment);
        if (!attachmentUrl) {
          return; // Upload failed, error already shown
        }
      }

      const { error } = await supabase
        .from('expenses')
        .insert({
          user_id: user.id,
          expense_name: formData.expense_name,
          amount: parseFloat(formData.amount),
          category: formData.category as any,
          date: formData.date,
          attachment: attachmentUrl
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Expense added",
        description: "Your expense has been successfully recorded.",
      });

      // Reset form
      setFormData({
        expense_name: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        attachment: null
      });
      
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error adding expense:', error);
      toast({
        title: "Error adding expense",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expense_name">Expense Name</Label>
            <Input
              id="expense_name"
              placeholder="Enter expense name"
              value={formData.expense_name}
              onChange={(e) => setFormData({ ...formData, expense_name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <div className="relative">
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachment">Attachment (Optional)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="attachment"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setFormData({ ...formData, attachment: e.target.files?.[0] || null })}
                className="flex-1"
              />
              <Upload className="h-4 w-4 text-gray-400" />
            </div>
            {formData.attachment && (
              <p className="text-sm text-gray-600">
                Selected: {formData.attachment.name}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading || uploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || uploading || !formData.expense_name || !formData.amount || !formData.category}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading || uploading ? 'Adding...' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseModal;
