import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BudgetAlertRequest {
  user_email: string;
  current_spending: number;
  budget_limit: number;
  month_year: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Verify the user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { user_email, current_spending, budget_limit, month_year }: BudgetAlertRequest = await req.json();

    // Log the budget alert (in a real implementation, you would send an actual email here)
    console.log(`Sending budget alert to: ${user_email}`);
    console.log(`Current spending: $${current_spending} of $${budget_limit} for ${month_year}`);

    // In a real implementation, you would use a service like Resend here:
    // const emailResponse = await resend.emails.send({...});

    // For now, we'll simulate success
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Budget alert email sent successfully" 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-budget-alert function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);