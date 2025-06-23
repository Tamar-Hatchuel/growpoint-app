
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Check, AlertTriangle } from 'lucide-react';

interface SubmitSurveyButtonProps {
  onSubmit: () => void;
  isDisabled: boolean;
  isSubmitting: boolean;
  isSuccess: boolean;
  hasError: boolean;
}

const SubmitSurveyButton: React.FC<SubmitSurveyButtonProps> = ({
  onSubmit,
  isDisabled,
  isSubmitting,
  isSuccess,
  hasError,
}) => {
  const getButtonContent = () => {
    if (isSubmitting) {
      return (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Sending...
        </>
      );
    }
    
    if (isSuccess) {
      return (
        <>
          <Check className="w-4 h-4 mr-2" />
          Sent!
        </>
      );
    }
    
    if (hasError) {
      return (
        <>
          <AlertTriangle className="w-4 h-4 mr-2" />
          Failed to Send
        </>
      );
    }
    
    return "Submit Survey";
  };

  const getButtonStyle = () => {
    if (isDisabled) {
      return "bg-gray-400 text-gray-600 cursor-not-allowed hover:bg-gray-400";
    }
    
    if (isSubmitting) {
      return "bg-[#FFB4A2] opacity-75 text-white";
    }
    
    if (isSuccess) {
      return "bg-[#B8CFCE] text-white";
    }
    
    if (hasError) {
      return "bg-[#F8D7DA] text-red-800";
    }
    
    return "bg-[#FFB4A2] hover:bg-[#E5989B] active:bg-[#B5828C] text-white font-semibold transition-all duration-200 transform hover:scale-[1.03] active:scale-[0.95]";
  };

  return (
    <Button
      onClick={onSubmit}
      disabled={isDisabled || isSubmitting || isSuccess}
      className={`w-full py-3 rounded-lg ${getButtonStyle()}`}
    >
      {getButtonContent()}
    </Button>
  );
};

export default SubmitSurveyButton;
