
import React from 'react';
import { Loader2, Check, AlertTriangle } from 'lucide-react';
import { GrowpointCTAButton } from '@/components/ui/growpoint-cta-button';

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

  const getVariant = () => {
    if (isSuccess) return "secondary";
    if (hasError) return "outline";
    return "default";
  };

  return (
    <GrowpointCTAButton
      onClick={onSubmit}
      disabled={isDisabled || isSubmitting || isSuccess}
      variant={getVariant()}
      size="lg"
      className="w-full py-3"
    >
      {getButtonContent()}
    </GrowpointCTAButton>
  );
};

export default SubmitSurveyButton;
