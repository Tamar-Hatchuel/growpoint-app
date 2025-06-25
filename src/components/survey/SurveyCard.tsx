
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SurveyProgressBar from './SurveyProgressBar';
import SurveyQuestionList from '@/components/SurveyQuestionList';
import SurveyNavigation from './SurveyNavigation';

interface SurveyCardProps {
  questions: string[];
  currentQuestion: number;
  responses: Record<number, number>;
  verbalResponses: Record<number, string>;
  onResponse: (questionIndex: number, value: number) => void;
  onVerbalResponse: (questionIndex: number, value: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isSuccess: boolean;
  hasError: boolean;
}

const SurveyCard: React.FC<SurveyCardProps> = ({
  questions,
  currentQuestion,
  responses,
  verbalResponses,
  onResponse,
  onVerbalResponse,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting,
  isSuccess,
  hasError
}) => {
  return (
    <>
      <SurveyProgressBar 
        currentQuestion={currentQuestion} 
        totalQuestions={questions.length} 
      />
      
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
            verbalResponses={verbalResponses}
            onResponse={onResponse}
            onVerbalResponse={onVerbalResponse}
          />
          
          <SurveyNavigation
            currentQuestion={currentQuestion}
            totalQuestions={questions.length}
            responses={responses}
            onPrevious={onPrevious}
            onNext={onNext}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            isSuccess={isSuccess}
            hasError={hasError}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default SurveyCard;
