
-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Add avatar_url and completion_score columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN avatar_url text,
ADD COLUMN completion_score integer DEFAULT 0;

-- Create user_settings table
CREATE TABLE public.user_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  currency text DEFAULT 'USD',
  monthly_budget numeric DEFAULT 0,
  theme text DEFAULT 'light',
  notifications_enabled boolean DEFAULT true,
  budget_alerts boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on user_settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_settings
CREATE POLICY "Users can view their own settings" 
  ON public.user_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" 
  ON public.user_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
  ON public.user_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create function to calculate profile completion score
CREATE OR REPLACE FUNCTION public.calculate_profile_completion()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  completion_count integer := 0;
  total_fields integer := 6; -- name, phone, age, gender, income, avatar_url
BEGIN
  -- Count filled fields
  IF NEW.name IS NOT NULL AND NEW.name != '' THEN
    completion_count := completion_count + 1;
  END IF;
  
  IF NEW.phone IS NOT NULL AND NEW.phone != '' THEN
    completion_count := completion_count + 1;
  END IF;
  
  IF NEW.age IS NOT NULL THEN
    completion_count := completion_count + 1;
  END IF;
  
  IF NEW.gender IS NOT NULL AND NEW.gender != '' THEN
    completion_count := completion_count + 1;
  END IF;
  
  IF NEW.income IS NOT NULL THEN
    completion_count := completion_count + 1;
  END IF;
  
  IF NEW.avatar_url IS NOT NULL AND NEW.avatar_url != '' THEN
    completion_count := completion_count + 1;
  END IF;
  
  -- Calculate percentage
  NEW.completion_score := (completion_count * 100) / total_fields;
  
  RETURN NEW;
END;
$$;

-- Create trigger for profile completion calculation
CREATE TRIGGER update_profile_completion
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_profile_completion();

-- Update the existing handle_new_user function to also create user_settings
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.raw_user_meta_data ->> 'full_name')
  );
  
  -- Insert into user_settings
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Create storage policy for avatars bucket
CREATE POLICY "Avatar images are publicly accessible" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
