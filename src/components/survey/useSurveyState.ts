
import { useState, useEffect } from 'react';
import { useSurveySubmission } from '@/hooks/useSurveySubmission';
import { trackSurveyStep, trackSurveyComplete, trackSurveyAbandon, trackButtonClick, trackFormSubmission } from '@/utils/analytics';

interface UserData {
  department?: string;
  userDepartment?: string;
  employeeId?: string;
}

export const useSurveyState = (
  questions: string[],
  userData: UserData,
  onContinue: (responses: Record<number, number>) => void
) => {
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [verbalResponses, setVerbalResponses] = useState<Record<number, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { submitSurvey, isSubmitting, isSuccess, error, resetSubmission } = useSurveySubmission();

  // Track page abandonment on component unmount
  useEffect(() => {
    return () => {
      if (Object.keys(responses).length < questions.length) {
        trackSurveyAbandon(`question_${currentQuestion + 1}`, userData.department);
      }
    };
  }, [currentQuestion, responses, userData.department, questions.length]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        resetSubmission();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, resetSubmission]);

  const handleResponse = (questionIndex: number, value: number) => {
    setResponses(prev => ({
      ...prev,
      [questionIndex]: value
    }));
    
    // Track question completion
    trackSurveyStep(`question_${questionIndex + 1}_answered`, userData.department);
  };

  const handleVerbalResponse = (questionIndex: number, value: string) => {
    setVerbalResponses(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      trackSurveyStep(`question_${currentQuestion + 2}_viewed`, userData.department);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    trackButtonClick('Submit Survey', 'survey_completion');
    
    if (Object.keys(responses).length === questions.length) {
      const success = await submitSurvey({
        responses,
        verbalResponses,
        department: userData.department || 'Unknown',
        userDepartment: userData.userDepartment,
        employeeId: userData.employeeId,
      });
      
      trackFormSubmission('survey_submission', success);
      
      if (success) {
        trackSurveyComplete(userData.department);
        setTimeout(() => {
          onContinue(responses);
        }, 2000);
      }
    }
  };

  const allQuestionsAnswered = Object.keys(responses).length === questions.length;

  return {
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
  };
};
