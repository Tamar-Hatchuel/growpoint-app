
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { FeedbackResponse } from '@/hooks/useFeedbackData';
import VerbableFeedbackQuestionCard from './VerbableFeedbackQuestionCard';

interface VerbableFeedbackContentProps {
  verbalFeedback: FeedbackResponse[];
  questionLabels: Record<string, { key: string; label: string }>;
  expandedQuestions: Set<string>;
  onToggleQuestion: (questionId: string) => void;
  onSpeak: (text: string) => void;
  isLoading: boolean;
  error?: string | null;
}

const VerbableFeedbackContent: React.FC<VerbableFeedbackContentProps> = ({
  verbalFeedback,
  questionLabels,
  expandedQuestions,
  onToggleQuestion,
  onSpeak,
  isLoading,
  error
}) => {
  const getCommentsForQuestion = (questionId: string) => {
    const { key } = questionLabels[questionId as keyof typeof questionLabels];
    return verbalFeedback
      .map(response => ({
        id: response.id,
        date: new Date(response.response_date).toLocaleDateString(),
        comment: response[key as keyof FeedbackResponse] as string
      }))
      .filter(item => item.comment);
  };

  return (
    <Card className="border-growpoint-accent/20 animate-scale-in" style={{ animationDelay: '200ms' }}>
      <CardContent className="p-6">
        {verbalFeedback.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <MessageSquare className="w-12 h-12 text-growpoint-dark/30 mx-auto mb-4" />
            <p className="text-growpoint-dark/60 text-lg">
              No verbal feedback available yet.
            </p>
            <p className="text-growpoint-dark/50 text-sm mt-2">
              Encourage team members to add comments when filling out surveys.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(questionLabels).map(([questionId, { label }], index) => (
              <VerbableFeedbackQuestionCard
                key={questionId}
                questionId={questionId}
                label={label}
                comments={getCommentsForQuestion(questionId)}
                isExpanded={expandedQuestions.has(questionId)}
                onToggle={onToggleQuestion}
                index={index}
                isLoading={isLoading}
                onSpeak={onSpeak}
                error={error}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerbableFeedbackContent;
