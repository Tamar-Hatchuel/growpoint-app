
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import SurveyTTSButton from './SurveyTTSButton';
import { useSurveyTTS } from '@/hooks/useSurveyTTS';

interface SurveyQuestionListProps {
  questions: string[];
  currentQuestion: number;
  responses: Record<number, number>;
  verbalResponses: Record<number, string>;
  onResponse: (questionIndex: number, value: number) => void;
  onVerbalResponse: (questionIndex: number, value: string) => void;
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
  verbalResponses,
  onResponse,
  onVerbalResponse
}) => {
  const { speakText, isLoading } = useSurveyTTS();

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 500) {
      onVerbalResponse(currentQuestion, value);
    }
  };

  return (
    <div className="text-center">
      <div className="flex items-center justify-center mb-8">
        <h3 className="text-lg font-semibold text-growpoint-dark">
          {questions[currentQuestion]}
        </h3>
        <SurveyTTSButton
          text={questions[currentQuestion]}
          isLoading={isLoading}
          onSpeak={speakText}
        />
      </div>
      
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

      {/* Verbal Response Section */}
      <div className="mt-8 text-left max-w-2xl mx-auto">
        <Label htmlFor={`verbal-${currentQuestion}`} className="text-growpoint-dark font-medium mb-2 block">
          Would you like to add a comment or explanation? (Optional)
        </Label>
        <p className="text-xs text-growpoint-dark/60 mb-3">
          💡 Adding a short explanation helps your team understand the feedback better.
        </p>
        <Textarea
          id={`verbal-${currentQuestion}`}
          placeholder="Share your thoughts, suggestions, or context behind your rating..."
          value={verbalResponses[currentQuestion] || ''}
          onChange={handleTextareaChange}
          className="min-h-[100px] border-growpoint-accent/30 focus:border-growpoint-primary focus:ring-growpoint-primary/20 resize-none"
          maxLength={500}
        />
        <div className="text-xs text-growpoint-dark/50 mt-1 text-right">
          {(verbalResponses[currentQuestion] || '').length}/500 characters
        </div>
      </div>
    </div>
  );
};

export default SurveyQuestionList;
