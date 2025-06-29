
import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Loader2 } from 'lucide-react';

interface SurveyTTSButtonProps {
  text: string;
  isLoading: boolean;
  onSpeak: (text: string) => void;
}

const SurveyTTSButton: React.FC<SurveyTTSButtonProps> = ({ 
  text, 
  isLoading, 
  onSpeak 
}) => {
  const handleClick = () => {
    if (!isLoading && text) {
      onSpeak(text);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={!text || isLoading}
      size="sm"
      variant="ghost"
      className="text-growpoint-primary hover:text-growpoint-accent hover:bg-growpoint-soft/50 ml-3"
      title="Listen to question"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
    </Button>
  );
};

export default SurveyTTSButton;
