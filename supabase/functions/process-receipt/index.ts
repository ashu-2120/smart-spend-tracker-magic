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

    console.log('Step 1: File uploaded successfully', { imageUrl, userId });

    // OCR with Google Cloud Vision API
    const visionApiKey = Deno.env.get('GOOGLE_CLOUD_VISION_KEY');
    if (!visionApiKey) {
      throw new Error('Google Cloud Vision API key not configured');
    }

    console.log('Step 2: Starting OCR call to Google Vision API');
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

    console.log('Step 3: OCR response received', { 
      status: visionResponse.status, 
      statusText: visionResponse.statusText 
    });

    if (!visionResponse.ok) {
      const errorText = await visionResponse.text();
      console.error('OCR API Error:', errorText);
      return new Response(JSON.stringify({ 
        error: 'OCR service failed',
        details: errorText,
        step: 'ocr'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const visionData = await visionResponse.json();
    console.log('Step 4: OCR data parsed', visionData);
    
    const ocrText = visionData.responses?.[0]?.textAnnotations?.[0]?.description || '';

    if (!ocrText || ocrText.trim() === '') {
      console.log('Step 5: No text detected in image');
      return new Response(JSON.stringify({ 
        error: 'Could not read receipt text',
        step: 'ocr_empty'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Step 5: OCR text extracted', { textLength: ocrText.length, preview: ocrText.substring(0, 100) });

    // Extract structured data with GPT-4o
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const gptPrompt = `Extract expense data from this receipt text: ${ocrText}`;
    console.log('Step 6: Starting GPT call', { prompt: gptPrompt });

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
          content: gptPrompt
        }],
        temperature: 0.1
      }),
    });

    console.log('Step 7: GPT response received', { 
      status: gptResponse.status, 
      statusText: gptResponse.statusText 
    });

    if (!gptResponse.ok) {
      const errorText = await gptResponse.text();
      console.error('GPT API Error:', errorText);
      return new Response(JSON.stringify({ 
        error: 'GPT service failed',
        details: errorText,
        step: 'gpt'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const gptData = await gptResponse.json();
    console.log('Step 8: GPT data parsed', gptData);
    
    let extractedData;
    try {
      extractedData = JSON.parse(gptData.choices[0].message.content);
      console.log('Step 9: Extracted data parsed', extractedData);
    } catch (parseError) {
      console.error('Failed to parse GPT response:', gptData.choices[0].message.content);
      return new Response(JSON.stringify({ 
        error: 'Failed to parse expense data from GPT response',
        step: 'gpt_parse'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate required fields
    if (!extractedData.expense_name || !extractedData.amount || !extractedData.category) {
      console.error('Missing required fields:', extractedData);
      return new Response(JSON.stringify({ 
        error: 'Failed to extract required expense data',
        extractedData,
        step: 'validation'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const dbInsertData = {
      user_id: userId,
      expense_name: extractedData.expense_name,
      amount: extractedData.amount,
      category: extractedData.category,
      date: extractedData.date || new Date().toISOString().split('T')[0],
      notes: extractedData.merchant ? `Merchant: ${extractedData.merchant}` : null,
      attachment: imageUrl
    };
    console.log('Step 10: Preparing database insert', dbInsertData);

    // Insert into expenses table
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data, error } = await supabase
      .from('expenses')
      .insert(dbInsertData)
      .select()
      .single();

    if (error) {
      console.error('Step 11: Database insert failed', error);
      return new Response(JSON.stringify({ 
        error: 'Database insert failed',
        details: error.message,
        step: 'db_insert'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Step 12: Success - expense created', data);

    return new Response(JSON.stringify({ 
      success: true, 
      expense: data,
      extractedData,
      steps: {
        fileUploaded: true,
        ocrCompleted: true,
        gptCompleted: true,
        dbInserted: true
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing receipt:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      step: 'unknown'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});