
import React from 'react';

interface SurveyConfirmationHandlerProps {
  showSurveyConfirmation: boolean;
  pendingSurveyStart: () => void;
  onStepChange: (step: any) => void;
  setShowSurveyConfirmation: (show: boolean) => void;
}

export const useSurveyConfirmationHandler = ({
  showSurveyConfirmation,
  pendingSurveyStart,
  onStepChange,
  setShowSurveyConfirmation,
}: SurveyConfirmationHandlerProps) => {
  const handleSurveyConfirm = () => {
    setShowSurveyConfirmation(false);
    pendingSurveyStart();
  };

  const handleSurveyCancel = () => {
    setShowSurveyConfirmation(false);
    // Return to department selection
    onStepChange('department');
  };

  return {
    handleSurveyConfirm,
    handleSurveyCancel,
  };
};
