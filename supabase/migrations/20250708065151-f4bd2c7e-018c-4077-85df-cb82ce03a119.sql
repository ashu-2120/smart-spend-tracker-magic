-- Create exec_sql function for direct SQL execution (temporary workaround)
CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
BEGIN
  -- This is a simplified version - in production you'd want more security
  EXECUTE sql;
  GET DIAGNOSTICS result = ROW_COUNT;
  RETURN json_build_object('success', true, 'rows_affected', result);
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Better approach: Create specific functions for user_settings operations
CREATE OR REPLACE FUNCTION public.get_user_settings(user_uuid uuid)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  currency text,
  monthly_budget numeric,
  theme text,
  notifications_enabled boolean,
  budget_alerts boolean,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT us.id, us.user_id, us.currency, us.monthly_budget, us.theme, 
         us.notifications_enabled, us.budget_alerts, us.created_at, us.updated_at
  FROM user_settings us
  WHERE us.user_id = user_uuid;
$$;

CREATE OR REPLACE FUNCTION public.upsert_user_settings(
  user_uuid uuid,
  p_currency text DEFAULT 'USD',
  p_monthly_budget numeric DEFAULT 0,
  p_theme text DEFAULT 'light',
  p_notifications_enabled boolean DEFAULT true,
  p_budget_alerts boolean DEFAULT true
)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  currency text,
  monthly_budget numeric,
  theme text,
  notifications_enabled boolean,
  budget_alerts boolean
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  INSERT INTO user_settings (user_id, currency, monthly_budget, theme, notifications_enabled, budget_alerts)
  VALUES (user_uuid, p_currency, p_monthly_budget, p_theme, p_notifications_enabled, p_budget_alerts)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    currency = EXCLUDED.currency,
    monthly_budget = EXCLUDED.monthly_budget,
    theme = EXCLUDED.theme,
    notifications_enabled = EXCLUDED.notifications_enabled,
    budget_alerts = EXCLUDED.budget_alerts,
    updated_at = now()
  RETURNING us.id, us.user_id, us.currency, us.monthly_budget, us.theme, us.notifications_enabled, us.budget_alerts;
$$;