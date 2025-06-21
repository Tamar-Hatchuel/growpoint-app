
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface SociometricTestScreenProps {
  onBack: () => void;
  onContinue: (responses: Record<number, number>) => void;
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

const emojiScale = [
  { emoji: '😞', label: 'Very Poor', value: 1 },
  { emoji: '😕', label: 'Poor', value: 2 },
  { emoji: '😐', label: 'Neutral', value: 3 },
  { emoji: '🙂', label: 'Good', value: 4 },
  { emoji: '😊', label: 'Excellent', value: 5 }
];

const SociometricTestScreen: React.FC<SociometricTestScreenProps> = ({ onBack, onContinue }) => {
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

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

  const handleSubmit = () => {
    if (Object.keys(responses).length === questions.length) {
      onContinue(responses);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const allQuestionsAnswered = Object.keys(responses).length === questions.length;

  return (
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
            <div className="text-center">
              <h3 className="text-lg font-semibold text-growpoint-dark mb-8">
                {questions[currentQuestion]}
              </h3>
              
              <div className="flex justify-center space-x-4 mb-8">
                {emojiScale.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleResponse(currentQuestion, option.value)}
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
                <Button
                  onClick={handleSubmit}
                  disabled={!allQuestionsAnswered}
                  className="bg-growpoint-primary hover:bg-growpoint-accent text-white"
                >
                  Complete Survey
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Sticky Submit Button for Mobile */}
        {allQuestionsAnswered && (
          <div className="fixed bottom-4 left-4 right-4 md:hidden">
            <Button
              onClick={handleSubmit}
              className="w-full bg-growpoint-primary hover:bg-growpoint-accent text-white font-semibold py-3 rounded-lg shadow-lg"
            >
              Submit Survey
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SociometricTestScreen;
