
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import OnboardingModal from './OnboardingModal';
import SubmitSurveyButton from './SubmitSurveyButton';
import SurveyQuestionList from './SurveyQuestionList';
import { useSurveySubmission } from '@/hooks/useSurveySubmission';

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
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { submitSurvey, isSubmitting, isSuccess, error, resetSubmission } = useSurveySubmission();

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('growpoint-onboarding-seen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingStart = () => {
    localStorage.setItem('growpoint-onboarding-seen', 'true');
  };

  const handleResponse = (questionIndex: number, value: number) => {
    setResponses(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(responses).length === questions.length) {
      const success = await submitSurvey({
        responses,
        department: userData.department || 'Unknown',
        userDepartment: userData.userDepartment,
        employeeId: userData.employeeId,
      });
      
      if (success) {
        setTimeout(() => {
          onContinue(responses);
        }, 2000);
      }
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        resetSubmission();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, resetSubmission]);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const allQuestionsAnswered = Object.keys(responses).length === questions.length;

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
            onClick={onBack}
            className="mb-6 text-growpoint-dark hover:text-growpoint-accent hover:bg-growpoint-soft/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-growpoint-dark/70 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-growpoint-soft/50 rounded-full h-2">
              <div 
                className="bg-growpoint-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <Card className="border-growpoint-accent/20 shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-growpoint-dark">
                Team Dynamics Survey
              </CardTitle>
              <CardDescription className="text-growpoint-dark/70">
                Your responses are completely anonymous and help us understand team dynamics
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              <SurveyQuestionList
                questions={questions}
                currentQuestion={currentQuestion}
                responses={responses}
                onResponse={handleResponse}
              />
              
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
                
                {currentQuestion < questions.length - 1 ? (
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
                    onSubmit={handleSubmit}
                    isDisabled={!allQuestionsAnswered}
                    isSubmitting={isSubmitting}
                    isSuccess={isSuccess}
                    hasError={!!error}
                  />
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Sticky Submit Button for Mobile */}
          {allQuestionsAnswered && currentQuestion === questions.length - 1 && (
            <div className="fixed bottom-4 left-4 right-4 md:hidden">
              <SubmitSurveyButton
                onSubmit={handleSubmit}
                isDisabled={!allQuestionsAnswered}
                isSubmitting={isSubmitting}
                isSuccess={isSuccess}
                hasError={!!error}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SociometricTestScreen;
