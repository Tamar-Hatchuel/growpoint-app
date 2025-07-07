
import React from 'react';
import SurveyTTSButton from '@/components/SurveyTTSButton';

interface VerbableFeedbackCommentItemProps {
  comment: {
    id: string;
    date: string;
    comment: string;
  };
  commentIndex: number;
  isLoading: boolean;
  onSpeak: (text: string) => void;
  error?: string | null;
}

const VerbableFeedbackCommentItem: React.FC<VerbableFeedbackCommentItemProps> = ({
  comment,
  commentIndex,
  isLoading,
  onSpeak,
  error
}) => {
  return (
    <div
      className="flex items-start gap-3 p-4 bg-white rounded-lg border border-growpoint-accent/10 hover:bg-growpoint-soft/10 transition-all duration-200 hover:shadow-sm hover:translate-y-[-1px] animate-fade-in"
      style={{ animationDelay: `${commentIndex * 50}ms` }}
    >
      <div className="flex-1">
        <p className="text-growpoint-dark text-sm leading-relaxed mb-2">
          "{comment.comment}"
        </p>
        <p className="text-growpoint-dark/50 text-xs">
          {comment.date}
        </p>
      </div>
      <SurveyTTSButton
        text={comment.comment}
        isLoading={isLoading}
        onSpeak={onSpeak}
        error={error}
      />
    </div>
  );
};

export default VerbableFeedbackCommentItem;
