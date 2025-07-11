
import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSurveyTTS = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const userInteractedRef = useRef(false);
  const { toast } = useToast();

  // Track user interaction to enable audio playback
  const trackUserInteraction = () => {
    if (!userInteractedRef.current) {
      userInteractedRef.current = true;
      console.log('User interaction detected - audio enabled');
    }
  };

  const speakText = async (text: string, retryCount = 0) => {
    if (!text || isLoading) return;

    // Track user interaction
    trackUserInteraction();

    // Stop any currently playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Calling ElevenLabs TTS with text:', text.substring(0, 50) + '...');
      console.log('Retry count:', retryCount);
      
      const { data, error } = await supabase.functions.invoke('tts-synthesize', {
        body: { text }
      });

      console.log('ElevenLabs TTS function response:', { data, error });

      if (error) {
        console.error('ElevenLabs TTS Supabase Error:', error);
        throw new Error(error.message || 'Failed to generate speech');
      }

      if (data?.success && data?.audioUrl) {
        console.log('Playing ElevenLabs TTS audio');
        
        // Create and configure audio element
        const audio = new Audio(data.audioUrl);
        currentAudioRef.current = audio;
        
        // Handle audio loading and playback
        audio.onloadeddata = async () => {
          try {
            await audio.play();
            console.log('Audio playback started successfully');
          } catch (playError) {
            console.error('Audio play error:', playError);
            
            // Handle autoplay restrictions
            if (playError.name === 'NotAllowedError') {
              setError('Audio playback blocked. Please interact with the page first.');
              toast({
                title: "Audio Blocked",
                description: "Click anywhere on the page first, then try again.",
                variant: "destructive"
              });
            } else {
              throw playError;
            }
          }
        };
        
        audio.onended = () => {
          console.log('Audio playback completed');
          currentAudioRef.current = null;
        };
        
        audio.onerror = (err) => {
          console.error('Audio error:', err);
          setError('Failed to play audio');
          currentAudioRef.current = null;
        };

        // Load the audio
        audio.load();
        
      } else {
        console.error('Invalid ElevenLabs TTS response:', data);
        if (data?.error) {
          throw new Error(data.error);
        }
        throw new Error('Invalid response from ElevenLabs TTS service');
      }

    } catch (error) {
      console.error('Failed to synthesize speech with ElevenLabs:', error);
      const errorMessage = error.message || 'Failed to generate speech';
      setError(errorMessage);

      // Retry logic for transient errors
      if (retryCount < 2 && (
        errorMessage.includes('Rate limit') || 
        errorMessage.includes('network') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('server error')
      )) {
        console.log(`Retrying ElevenLabs TTS (attempt ${retryCount + 1})`);
        setTimeout(() => {
          speakText(text, retryCount + 1);
        }, 1000 * (retryCount + 1));
        return;
      }

      // Show user-friendly error message with more details
      toast({
        title: "Speech Generation Failed",
        description: errorMessage.includes('ElevenLabs API authentication failed') 
          ? "Please check your ElevenLabs API key configuration."
          : errorMessage.includes('Rate limit exceeded')
          ? "Too many requests. Please wait a moment and try again."
          : errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stopAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
      console.log('Audio playback stopped');
    }
  };

  return {
    speakText,
    stopAudio,
    isLoading,
    error,
    hasUserInteracted: userInteractedRef.current
  };
};
