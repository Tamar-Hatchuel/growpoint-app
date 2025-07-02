
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
    const { text } = await req.json();
    
    if (!text) {
      throw new Error('Text is required');
    }

    // Get Google Cloud API key from environment
    const googleApiKey = Deno.env.get('GOOGLE_AI_API_KEY');
    
    if (!googleApiKey) {
      throw new Error('Google Cloud API key not configured');
    }

    console.log('Calling Google Cloud Text-to-Speech API with text:', text.substring(0, 50) + '...');

    // Use Google Cloud Text-to-Speech API
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${googleApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: {
            text: text
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
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Cloud TTS API error:', response.status, errorText);
      
      // Handle specific error cases
      if (response.status === 403) {
        throw new Error('Google Cloud TTS API access denied. Please check your API key and ensure the Text-to-Speech API is enabled.');
      } else if (response.status === 400) {
        throw new Error('Invalid request to Google Cloud TTS API. Please check the text input.');
      } else {
        throw new Error(`Google Cloud TTS API error: ${response.status} - ${errorText}`);
      }
    }

    const data = await response.json();
    console.log('Google Cloud TTS API response received successfully');

    if (!data.audioContent) {
      throw new Error('No audio content received from Google Cloud TTS API');
    }

    // Create a data URL for the audio (Google Cloud returns base64-encoded MP3)
    const audioUrl = `data:audio/mp3;base64,${data.audioContent}`;

    return new Response(JSON.stringify({ audioUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in tts-synthesize:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      audioUrl: null
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
