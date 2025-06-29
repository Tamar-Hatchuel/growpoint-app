
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TTSButtonProps {
  textToSpeak: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

const TTSButton: React.FC<TTSButtonProps> = ({ 
  textToSpeak, 
  size = 'sm', 
  variant = 'ghost',
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleTTSClick = async () => {
    if (!textToSpeak || isLoading) return;

    setIsLoading(true);
    
    try {
      console.log('Calling TTS with text:', textToSpeak);
      
      const { data, error } = await supabase.functions.invoke('tts-synthesize', {
        body: { text: textToSpeak }
      });

      if (error) {
        console.error('TTS Error:', error);
        throw error;
      }

      if (data?.audioUrl) {
        console.log('Playing TTS audio');
        
        // Create and play audio
        const audio = new Audio(data.audioUrl);
        audio.onloadeddata = () => {
          audio.play().catch(err => console.error('Audio play error:', err));
        };
        audio.onerror = (err) => {
          console.error('Audio error:', err);
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

  return (
    <Button
      onClick={handleTTSClick}
      disabled={!textToSpeak || isLoading}
      size={size}
      variant={variant}
      className={`text-growpoint-primary hover:text-growpoint-accent ${className}`}
      title="Play text-to-speech"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
    </Button>
  );
};

export default TTSButton;
