
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import OnboardingModal from './OnboardingModal';
import SurveyCard from './survey/SurveyCard';
import StickySubmitButton from './survey/StickySubmitButton';
import { useSurveyState } from './survey/useSurveyState';
import { trackSurveyStep, trackSurveyAbandon, trackButtonClick } from '@/utils/analytics';

interface SociometricTestScreenProps {
  onBack: () => void;
  onContinue: (responses: Record<number, number>) => void;
  userData?: {
    department?: string;
    userDepartment?: string;
    employeeId?: string;
  };
}

const questions = [
  "How supported do you feel by your team members?",
  "How comfortable are you sharing ideas in team meetings?",
  "How well does your team handle conflict and disagreements?",
  "How aligned is your team on shared goals and priorities?",
  "How much do you trust your team members to deliver on commitments?",
  "How inclusive and welcoming is your team environment?",
  "How effectively does your team communicate with each other?"
];

const SociometricTestScreen: React.FC<SociometricTestScreenProps> = ({ 
  onBack, 
  onContinue,
  userData = {}
}) => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const {
    responses,
    verbalResponses,
    currentQuestion,
    allQuestionsAnswered,
    isSubmitting,
    isSuccess,
    error,
    handleResponse,
    handleVerbalResponse,
    handleNext,
    handlePrevious,
    handleSubmit
  } = useSurveyState(questions, userData, onContinue);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('growpoint-onboarding-seen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingStart = () => {
    localStorage.setItem('growpoint-onboarding-seen', 'true');
    trackSurveyStep('onboarding_complete', userData.department);
  };

  const handleBack = () => {
    trackButtonClick('Back', 'survey_screen');
    trackSurveyAbandon(`question_${currentQuestion + 1}`, userData.department);
    onBack();
  };

  return (
    <>
      <OnboardingModal
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onStart={handleOnboardingStart}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl animate-fade-in">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-6 text-growpoint-dark hover:text-growpoint-accent hover:bg-growpoint-soft/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <SurveyCard
            questions={questions}
            currentQuestion={currentQuestion}
            responses={responses}
            verbalResponses={verbalResponses}
            onResponse={handleResponse}
            onVerbalResponse={handleVerbalResponse}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isSuccess={isSuccess}
            hasError={!!error}
          />
          
          <StickySubmitButton
            allQuestionsAnswered={allQuestionsAnswered}
            currentQuestion={currentQuestion}
            totalQuestions={questions.length}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isSuccess={isSuccess}
            hasError={!!error}
          />
        </div>
      </div>
    </>
  );
};

export default SociometricTestScreen;
