-- Create email notification edge function for budget alerts and invites
CREATE OR REPLACE FUNCTION public.send_budget_alert_email(
  user_email text,
  current_spending numeric,
  budget_limit numeric,
  month_year text
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function will be called when budget alerts need to be sent
  -- The actual email sending will be handled by an edge function
  -- For now, we'll just log the alert
  RAISE NOTICE 'Budget alert for %: spent % of % limit for %', user_email, current_spending, budget_limit, month_year;
  RETURN true;
END;
$$;