
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    // Get Google AI API key from environment
    const googleApiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    const model = Deno.env.get('GOOGLE_MODEL') || 'gemini-1.5-flash';
    
    if (!googleApiKey) {
      throw new Error('Google AI API key not configured');
    }

    // Format messages for Gemini API
    const geminiMessages = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Add system context for GrowPoint
    const systemContext = {
      role: 'user',
      parts: [{
        text: `You are GrowPoint AI, an expert assistant for team engagement and organizational health. You help analyze survey data, provide actionable insights about team dynamics, engagement scores, friction levels, and cohesion metrics. Keep responses concise, practical, and focused on improving team performance and workplace satisfaction.`
      }]
    };

    const requestBody = {
      contents: [systemContext, ...geminiMessages],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      }
    };

    console.log('Calling Gemini API with:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${googleApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Google AI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data, null, 2));

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I could not generate a response. Please try again.';

    // Store chat message in database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: dbError } = await supabase
      .from('chat_messages')
      .insert([
        { role: 'user', content: messages[messages.length - 1]?.content || '' },
        { role: 'assistant', content: reply }
      ]);

    if (dbError) {
      console.error('Database error:', dbError);
    }

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chatbot-handler:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      reply: 'I apologize, but I encountered an error. Please try again later.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
