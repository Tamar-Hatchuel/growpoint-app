
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
    console.log('ElevenLabs TTS function called - starting request processing');
    
    const { text } = await req.json();
    
    if (!text || typeof text !== 'string') {
      console.error('Invalid text input:', text);
      throw new Error('Valid text is required');
    }

    if (text.length > 2500) {
      console.error('Text too long:', text.length);
      throw new Error('Text is too long (max 2500 characters)');
    }

    // Get ElevenLabs API key from environment
    const elevenlabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    
    if (!elevenlabsApiKey) {
      console.error('ElevenLabs API key not found in environment variables');
      throw new Error('ElevenLabs API key not configured. Please add ELEVENLABS_API_KEY to your Supabase secrets.');
    }

    console.log('API key found, calling ElevenLabs TTS API with text length:', text.length);
    console.log('Text preview:', text.substring(0, 100) + (text.length > 100 ? '...' : ''));

    // Use ElevenLabs TTS API with high-quality voice "Aria"
    const voiceId = '9BWtsMINqrJLrRacOk9x'; // Aria voice
    const apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    
    console.log('Making request to ElevenLabs API');

    const requestBody = {
      text: text.trim(),
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 0.0,
        use_speaker_boost: true
      }
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenlabsApiKey,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('ElevenLabs API response status:', response.status);
    console.log('ElevenLabs API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs TTS API error response:', errorText);
      
      // Parse error details if possible
      let errorDetails = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson.detail?.message || errorJson.message || errorText;
        console.error('Parsed error details:', errorJson);
      } catch (parseError) {
        console.error('Could not parse error response as JSON');
      }
      
      // Handle specific error cases with helpful messages
      if (response.status === 401) {
        throw new Error(`ElevenLabs API authentication failed. Please check your API key. Error details: ${errorDetails}`);
      } else if (response.status === 400) {
        throw new Error(`Invalid request to ElevenLabs API. Error details: ${errorDetails}`);
      } else if (response.status === 422) {
        throw new Error(`ElevenLabs API validation error. Please check your input text. Error details: ${errorDetails}`);
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else if (response.status === 500) {
        throw new Error('ElevenLabs server error. Please try again.');
      } else {
        throw new Error(`ElevenLabs TTS API error (${response.status}): ${errorDetails}`);
      }
    }

    // Get the audio data as array buffer
    const audioBuffer = await response.arrayBuffer();
    console.log('Audio buffer received, size:', audioBuffer.byteLength);

    if (audioBuffer.byteLength === 0) {
      console.error('No audio content received from ElevenLabs TTS API');
      throw new Error('No audio content received from ElevenLabs TTS API');
    }

    // Convert to base64 for data URL
    const audioArray = new Uint8Array(audioBuffer);
    const base64Audio = btoa(String.fromCharCode(...audioArray));
    
    // Create a data URL for the audio (ElevenLabs returns MP3)
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

    console.log('Successfully generated audio with ElevenLabs TTS');

    return new Response(JSON.stringify({ 
      audioUrl,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ElevenLabs tts-synthesize function:', error);
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
