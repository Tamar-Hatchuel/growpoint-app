
import React from 'react';

interface SurveyQuestionListProps {
  questions: string[];
  currentQuestion: number;
  responses: Record<number, number>;
  onResponse: (questionIndex: number, value: number) => void;
}

const emojiScale = [
  { emoji: '😞', label: 'Very Poor', value: 1 },
  { emoji: '😕', label: 'Poor', value: 2 },
  { emoji: '😐', label: 'Neutral', value: 3 },
  { emoji: '🙂', label: 'Good', value: 4 },
  { emoji: '😊', label: 'Excellent', value: 5 }
];

const SurveyQuestionList: React.FC<SurveyQuestionListProps> = ({
  questions,
  currentQuestion,
  responses,
  onResponse
}) => {
  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-growpoint-dark mb-8">
        {questions[currentQuestion]}
      </h3>
      
      <div className="flex justify-center space-x-4 mb-8">
        {emojiScale.map((option) => (
          <button
            key={option.value}
            onClick={() => onResponse(currentQuestion, option.value)}
            className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
              responses[currentQuestion] === option.value
                ? 'border-growpoint-primary bg-growpoint-soft shadow-lg'
                : 'border-growpoint-accent/30 hover:border-growpoint-accent bg-white'
            }`}
          >
            <span className="text-3xl mb-2">{option.emoji}</span>
            <span className="text-xs text-growpoint-dark font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SurveyQuestionList;
