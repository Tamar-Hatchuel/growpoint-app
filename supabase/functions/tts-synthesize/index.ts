
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
    const googleApiKey = Deno.env.get('GOOGLE_CLOUD_API_KEY');
    
    if (!googleApiKey) {
      throw new Error('Google Cloud API key not configured');
    }

    // Call Google Cloud Text-to-Speech API
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${googleApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: 'en-US',
            name: 'en-US-Journey-F',
            ssmlGender: 'FEMALE'
          },
          audioConfig: {
            audioEncoding: 'MP3'
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google TTS API error:', errorText);
      throw new Error(`Google TTS API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Google TTS API response received');

    if (!data.audioContent) {
      throw new Error('No audio content received from Google TTS API');
    }

    // Create a data URL for the audio
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
