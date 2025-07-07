
-- Add subcategory and notes columns to the expenses table
ALTER TABLE public.expenses 
ADD COLUMN sub_category text,
ADD COLUMN notes text;
