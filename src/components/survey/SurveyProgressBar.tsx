
import React from 'react';

interface SurveyProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
}

const SurveyProgressBar: React.FC<SurveyProgressBarProps> = ({
  currentQuestion,
  totalQuestions
}) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between text-sm text-growpoint-dark/70 mb-2">
        <span>Question {currentQuestion + 1} of {totalQuestions}</span>
        <span>{Math.round(progress)}% Complete</span>
      </div>
      <div className="w-full bg-growpoint-soft/50 rounded-full h-2">
        <div 
          className="bg-growpoint-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default SurveyProgressBar;
