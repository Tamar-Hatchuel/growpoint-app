
import React from 'react';
import SubmitSurveyButton from '@/components/SubmitSurveyButton';

interface StickySubmitButtonProps {
  allQuestionsAnswered: boolean;
  currentQuestion: number;
  totalQuestions: number;
  onSubmit: () => void;
  isSubmitting: boolean;
  isSuccess: boolean;
  hasError: boolean;
}

const StickySubmitButton: React.FC<StickySubmitButtonProps> = ({
  allQuestionsAnswered,
  currentQuestion,
  totalQuestions,
  onSubmit,
  isSubmitting,
  isSuccess,
  hasError
}) => {
  if (!allQuestionsAnswered || currentQuestion !== totalQuestions - 1) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:hidden">
      <SubmitSurveyButton
        onSubmit={onSubmit}
        isDisabled={!allQuestionsAnswered}
        isSubmitting={isSubmitting}
        isSuccess={isSuccess}
        hasError={hasError}
      />
    </div>
  );
};

export default StickySubmitButton;
