import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Loader2, FileImage, AlertCircle, Edit } from 'lucide-react';
import ManualExpenseModal from './ManualExpenseModal';

interface UploadReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const UploadReceiptModal: React.FC<UploadReceiptModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);
  const [extractedDataForManual, setExtractedDataForManual] = useState<any>(null);
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
      // Step 1: Upload file to storage
      console.log('Step 1: Starting file upload...');
      const imageUrl = await uploadFile(selectedFile);
      console.log('Step 1 Complete: File uploaded successfully', imageUrl);
      
      toast({
        title: "File Uploaded",
        description: `File uploaded successfully: ${imageUrl.split('/').pop()}`,
      });

      // Step 2: Process with edge function
      console.log('Step 2: Starting receipt processing...');
      const response = await supabase.functions.invoke('process-receipt', {
        body: { imageUrl, userId: user.id }
      });

      console.log('Step 2 Complete: Edge function response received', response);

      // Check for edge function errors
      if (response.error) {
        console.error('Edge function error:', response.error);
        throw response.error;
      }

      // Check the response data for specific step errors
      const { data } = response;
      if (data?.error) {
        console.error('Processing error:', data);
        
        // Handle specific error types
        if (data.step === 'ocr_empty') {
          toast({
            title: "Could not read receipt text",
            description: "The image doesn't contain readable text. Would you like to add the expense manually?",
            variant: "destructive",
          });
          
          // Offer manual input as fallback
          setShowManualModal(true);
          setIsUploading(false);
          return;
        }
        
        if (data.step === 'ocr' && !data.error.includes('200')) {
          toast({
            title: "OCR Service Failed",
            description: `OCR API returned non-200 status. ${data.details || ''}`,
            variant: "destructive",
          });
        }
        
        if (data.step === 'gpt') {
          toast({
            title: "GPT Processing Failed",
            description: "Failed to extract expense data from text. Try manual entry.",
            variant: "destructive",
          });
          setShowManualModal(true);
          setIsUploading(false);
          return;
        }
        
        if (data.step === 'db_insert') {
          toast({
            title: "Database Error",
            description: `Failed to save expense: ${data.details}`,
            variant: "destructive",
          });
        }
        
        if (data.step === 'validation') {
          console.log('Validation failed, showing extracted data for manual review:', data.extractedData);
          toast({
            title: "Data Validation Failed",
            description: "Extracted data is incomplete. Please review and complete manually.",
            variant: "destructive",
          });
          setExtractedDataForManual(data.extractedData);
          setShowManualModal(true);
          setIsUploading(false);
          return;
        }
        
        throw new Error(data.error);
      }

      // Step 3: Show preview of extracted data before confirming
      if (data?.extractedData) {
        console.log('Step 3: Showing extracted data preview', data.extractedData);
        toast({
          title: "Data Extracted Successfully",
          description: `Found: ${data.extractedData.expense_name} - $${data.extractedData.amount} (${data.extractedData.category})`,
        });
      }

      // Step 4: Success
      console.log('Step 4: Process completed successfully', data);
      toast({
        title: "Expense Added Successfully",
        description: "Your receipt has been processed and the expense has been added.",
      });

      onSuccess();
      onClose();
      setSelectedFile(null);

    } catch (error: any) {
      console.error('Error processing receipt:', error);
      
      // Log full error details
      console.error('Full error object:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        ...error
      });
      
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to process receipt. Please try again or add manually.",
        variant: "destructive",
      });
      
      // Offer manual input as fallback for any error
      setShowManualModal(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleManualModalClose = () => {
    setShowManualModal(false);
    setExtractedDataForManual(null);
  };

  const handleManualSuccess = () => {
    setShowManualModal(false);
    setExtractedDataForManual(null);
    onSuccess();
    onClose();
    setSelectedFile(null);
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null);
      onClose();
    }
  };

  return (
    <>
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
                <>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                    variant="outline"
                  >
                    Choose File
                  </Button>
                  <Button 
                    onClick={() => setShowManualModal(true)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Manual Entry
                  </Button>
                </>
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

            {/* Manual entry link */}
            <div className="text-center">
              <Button
                variant="link"
                size="sm"
                onClick={() => setShowManualModal(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                Can't scan? Add expense manually
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manual Expense Modal */}
      <ManualExpenseModal
        isOpen={showManualModal}
        onClose={handleManualModalClose}
        onSuccess={handleManualSuccess}
        prefilledData={extractedDataForManual}
      />
    </>
  );
};

export default UploadReceiptModal;