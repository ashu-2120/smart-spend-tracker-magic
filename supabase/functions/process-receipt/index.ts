import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, userId } = await req.json();
    
    if (!imageUrl || !userId) {
      throw new Error('Missing imageUrl or userId');
    }

    // OCR with Google Cloud Vision API
    const visionApiKey = Deno.env.get('GOOGLE_CLOUD_VISION_API_KEY');
    if (!visionApiKey) {
      throw new Error('Google Cloud Vision API key not configured');
    }

    const visionResponse = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${visionApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{
          image: { source: { imageUri: imageUrl } },
          features: [{ type: 'TEXT_DETECTION', maxResults: 1 }]
        }]
      })
    });

    const visionData = await visionResponse.json();
    const ocrText = visionData.responses?.[0]?.textAnnotations?.[0]?.description || '';

    if (!ocrText) {
      throw new Error('No text detected in image');
    }

    // Extract structured data with GPT-4o
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{
          role: 'system',
          content: 'Extract structured expense data from receipt text. Return only valid JSON with these exact fields: expense_name (string), amount (number), category (one of: food, travel, bills, entertainment, shopping, healthcare, education, transportation, utilities, rent, groceries, clothing, fitness, subscriptions, other), date (YYYY-MM-DD format), merchant (string). If any field cannot be determined, use reasonable defaults.'
        }, {
          role: 'user',
          content: `Extract expense data from this receipt text: ${ocrText}`
        }],
        temperature: 0.1
      }),
    });

    const gptData = await gptResponse.json();
    const extractedData = JSON.parse(gptData.choices[0].message.content);

    // Validate required fields
    if (!extractedData.expense_name || !extractedData.amount || !extractedData.category) {
      throw new Error('Failed to extract required expense data');
    }

    // Insert into expenses table
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        user_id: userId,
        expense_name: extractedData.expense_name,
        amount: extractedData.amount,
        category: extractedData.category,
        date: extractedData.date || new Date().toISOString().split('T')[0],
        notes: extractedData.merchant ? `Merchant: ${extractedData.merchant}` : null,
        attachment: imageUrl
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ 
      success: true, 
      expense: data,
      extractedData 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing receipt:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});