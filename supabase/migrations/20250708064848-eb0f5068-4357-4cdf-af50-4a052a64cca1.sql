-- Create invites table for tracking friend invitations
CREATE TABLE public.invites (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inviter_id uuid REFERENCES auth.users NOT NULL,
  invitee_email text NOT NULL,
  invite_method text NOT NULL,
  invite_status text DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on invites table
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for invites
CREATE POLICY "Users can view their own invites" 
  ON public.invites 
  FOR SELECT 
  USING (auth.uid() = inviter_id);

CREATE POLICY "Users can create their own invites" 
  ON public.invites 
  FOR INSERT 
  WITH CHECK (auth.uid() = inviter_id);

-- Create function to check if email exists in auth.users
CREATE OR REPLACE FUNCTION public.check_user_exists(email_to_check text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = email_to_check
  );
$$;