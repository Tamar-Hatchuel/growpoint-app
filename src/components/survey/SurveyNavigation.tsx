
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SubmitSurveyButton from '@/components/SubmitSurveyButton';
import { trackButtonClick } from '@/utils/analytics';

interface SurveyNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  responses: Record<number, number>;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isSuccess: boolean;
  hasError: boolean;
}

const SurveyNavigation: React.FC<SurveyNavigationProps> = ({
  currentQuestion,
  totalQuestions,
  responses,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting,
  isSuccess,
  hasError
}) => {
  const allQuestionsAnswered = Object.keys(responses).length === totalQuestions;

  const handlePrevious = () => {
    trackButtonClick('Previous Question', `question_${currentQuestion + 1}`);
    onPrevious();
  };

  const handleNext = () => {
    trackButtonClick('Next Question', `question_${currentQuestion + 1}`);
    onNext();
  };

  return (
    <div className="flex justify-between">
      <Button
        variant="outline"
        onClick={handlePrevious}
        disabled={currentQuestion === 0}
        className="border-growpoint-accent/30 text-growpoint-dark hover:bg-growpoint-soft"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Previous
      </Button>
      
      {currentQuestion < totalQuestions - 1 ? (
        <Button
          onClick={handleNext}
          disabled={!responses[currentQuestion]}
          className="bg-growpoint-primary hover:bg-growpoint-accent text-white"
        >
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      ) : (
        <SubmitSurveyButton
          onSubmit={onSubmit}
          isDisabled={!allQuestionsAnswered}
          isSubmitting={isSubmitting}
          isSuccess={isSuccess}
          hasError={hasError}
        />
      )}
    </div>
  );
};

export default SurveyNavigation;
