
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    console.log('TTS function called - starting request processing');
    
    const { text } = await req.json();
    
    if (!text || typeof text !== 'string') {
      console.error('Invalid text input:', text);
      throw new Error('Valid text is required');
    }

    if (text.length > 5000) {
      console.error('Text too long:', text.length);
      throw new Error('Text is too long (max 5000 characters)');
    }

    // Get Google Cloud API key from environment
    const googleApiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    
    if (!googleApiKey) {
      console.error('Google Cloud API key not found in environment variables');
      throw new Error('Google Cloud API key not configured. Please add GOOGLE_AI_API_KEY to your Supabase secrets.');
    }

    console.log('API key found, calling Google Cloud Text-to-Speech API with text length:', text.length);
    console.log('Text preview:', text.substring(0, 100) + (text.length > 100 ? '...' : ''));

    // Use Google Cloud Text-to-Speech API with proper error handling
    const apiUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${googleApiKey}`;
    console.log('Making request to:', apiUrl.replace(googleApiKey, '[REDACTED]'));

    const requestBody = {
      input: {
        text: text.trim()
      },
      voice: {
        languageCode: 'en-US',
        name: 'en-US-Standard-F',
        ssmlGender: 'FEMALE'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        pitch: 0.0,
        volumeGainDb: 0.0
      }
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Google Cloud API response status:', response.status);
    console.log('Google Cloud API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Cloud TTS API error response:', errorText);
      
      // Parse error details if possible
      let errorDetails = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson.error?.message || errorText;
        console.error('Parsed error details:', errorJson);
      } catch (parseError) {
        console.error('Could not parse error response as JSON');
      }
      
      // Handle specific error cases with helpful messages
      if (response.status === 403) {
        throw new Error(`Google Cloud TTS API access denied (403). This usually means:
          1. The API key is invalid
          2. The Text-to-Speech API is not enabled for your project
          3. Billing is not set up for your Google Cloud project
          Error details: ${errorDetails}`);
      } else if (response.status === 400) {
        throw new Error(`Invalid request to Google Cloud TTS API (400). Error details: ${errorDetails}`);
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else if (response.status === 401) {
        throw new Error(`Authentication failed (401). Please check your API key. Error details: ${errorDetails}`);
      } else {
        throw new Error(`Google Cloud TTS API error (${response.status}): ${errorDetails}`);
      }
    }

    const data = await response.json();
    console.log('Google Cloud TTS API response received successfully');
    console.log('Response data keys:', Object.keys(data));

    if (!data.audioContent) {
      console.error('No audio content received from Google Cloud TTS API');
      console.error('Full response:', JSON.stringify(data, null, 2));
      throw new Error('No audio content received from Google Cloud TTS API');
    }

    console.log('Audio content length:', data.audioContent.length);

    // Create a data URL for the audio (Google Cloud returns base64-encoded MP3)
    const audioUrl = `data:audio/mp3;base64,${data.audioContent}`;

    return new Response(JSON.stringify({ 
      audioUrl,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in tts-synthesize function:', error);
    console.error('Error stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      audioUrl: null,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
