
import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Loader2, VolumeX, AlertCircle } from 'lucide-react';

interface SurveyTTSButtonProps {
  text: string;
  isLoading: boolean;
  onSpeak: (text: string) => void;
  error?: string | null;
  disabled?: boolean;
}

const SurveyTTSButton: React.FC<SurveyTTSButtonProps> = ({ 
  text, 
  isLoading, 
  onSpeak,
  error,
  disabled = false
}) => {
  const handleClick = () => {
    if (!isLoading && text && !disabled) {
      onSpeak(text);
    }
  };

  const getIcon = () => {
    if (isLoading) {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }
    if (error) {
      return <AlertCircle className="w-4 h-4" />;
    }
    if (disabled) {
      return <VolumeX className="w-4 h-4" />;
    }
    return <Volume2 className="w-4 h-4" />;
  };

  const getTitle = () => {
    if (isLoading) return "Generating speech...";
    if (error) return `Error: ${error}`;
    if (disabled) return "Audio unavailable";
    return "Listen to question";
  };

  const getVariant = () => {
    if (error) return "destructive";
    return "ghost";
  };

  return (
    <Button
      onClick={handleClick}
      disabled={!text || isLoading || disabled}
      size="sm"
      variant={getVariant()}
      className={`ml-3 transition-all duration-200 ${
        error 
          ? 'text-red-500 hover:text-red-600 hover:bg-red-50' 
          : 'text-growpoint-primary hover:text-growpoint-accent hover:bg-growpoint-soft/50'
      }`}
      title={getTitle()}
      aria-label={getTitle()}
    >
      {getIcon()}
    </Button>
  );
};

export default SurveyTTSButton;
