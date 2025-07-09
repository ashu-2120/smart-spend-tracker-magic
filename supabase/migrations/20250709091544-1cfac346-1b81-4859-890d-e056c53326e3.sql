
-- Update attachments bucket to be public for OCR API access
UPDATE storage.buckets 
SET public = true 
WHERE id = 'attachments';
