import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Loader2, FileImage } from 'lucide-react';

interface UploadReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const UploadReceiptModal: React.FC<UploadReceiptModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 2MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user!.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('attachments')
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('attachments')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const processReceipt = async () => {
    if (!selectedFile || !user) return;

    setIsUploading(true);
    try {
      // Upload file to storage
      const imageUrl = await uploadFile(selectedFile);

      // Process with edge function
      const response = await supabase.functions.invoke('process-receipt', {
        body: { imageUrl, userId: user.id }
      });

      if (response.error) {
        throw response.error;
      }

      toast({
        title: "Expense Added Successfully",
        description: "Your receipt has been processed and the expense has been added.",
      });

      onSuccess();
      onClose();
      setSelectedFile(null);

    } catch (error: any) {
      console.error('Error processing receipt:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to process receipt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Receipt
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Upload a receipt image and we'll automatically extract the expense details using AI.
          </div>

          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            {selectedFile ? (
              <div className="space-y-2">
                <FileImage className="h-12 w-12 mx-auto text-muted-foreground" />
                <div className="text-sm font-medium">{selectedFile.name}</div>
                <div className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  Select a receipt image (JPG, JPEG, PNG)
                </div>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex gap-2">
            {!selectedFile ? (
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
                variant="outline"
              >
                Choose File
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  disabled={isUploading}
                >
                  Change File
                </Button>
                <Button 
                  onClick={processReceipt}
                  disabled={isUploading}
                  className="flex-1"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Upload & Process'
                  )}
                </Button>
              </>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            Maximum file size: 2MB. Supported formats: JPG, JPEG, PNG
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadReceiptModal;