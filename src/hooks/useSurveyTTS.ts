
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSurveyTTS = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const speakText = async (text: string) => {
    if (!text || isLoading) return;

    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    setIsLoading(true);
    
    try {
      console.log('Calling TTS with text:', text);
      
      const { data, error } = await supabase.functions.invoke('tts-synthesize', {
        body: { text }
      });

      if (error) {
        console.error('TTS Error:', error);
        throw error;
      }

      if (data?.audioUrl) {
        console.log('Playing TTS audio');
        
        // Create and play audio
        const audio = new Audio(data.audioUrl);
        setCurrentAudio(audio);
        
        audio.onloadeddata = () => {
          audio.play().catch(err => console.error('Audio play error:', err));
        };
        
        audio.onended = () => {
          setCurrentAudio(null);
        };
        
        audio.onerror = (err) => {
          console.error('Audio error:', err);
          setCurrentAudio(null);
        };
      } else {
        console.error('No audio URL received:', data);
      }

    } catch (error) {
      console.error('Failed to synthesize speech:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    speakText,
    isLoading
  };
};
