
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import VerbableFeedbackCommentItem from './VerbableFeedbackCommentItem';

interface VerbableFeedbackQuestionCardProps {
  questionId: string;
  label: string;
  comments: Array<{
    id: string;
    date: string;
    comment: string;
  }>;
  isExpanded: boolean;
  onToggle: (questionId: string) => void;
  index: number;
  isLoading: boolean;
  onSpeak: (text: string) => void;
  error?: string | null;
}

const VerbableFeedbackQuestionCard: React.FC<VerbableFeedbackQuestionCardProps> = ({
  questionId,
  label,
  comments,
  isExpanded,
  onToggle,
  index,
  isLoading,
  onSpeak,
  error
}) => {
  if (comments.length === 0) return null;

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={() => onToggle(questionId)}
      className="animate-fade-in"
      style={{ animationDelay: `${300 + index * 50}ms` }}
    >
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-growpoint-soft/30 to-growpoint-primary/10 rounded-lg border border-growpoint-accent/20 cursor-pointer hover:bg-growpoint-soft/40 transition-all duration-200 hover:shadow-sm hover:translate-y-[-1px]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-growpoint-primary text-white rounded-full flex items-center justify-center text-xs font-semibold">
              {questionId}
            </div>
            <div>
              <h3 className="text-growpoint-dark font-semibold text-lg">
                {label}
              </h3>
              <p className="text-growpoint-dark/60 text-sm">
                {comments.length} comment{comments.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-growpoint-dark/60 transition-transform duration-200" />
          ) : (
            <ChevronDown className="w-5 h-5 text-growpoint-dark/60 transition-transform duration-200" />
          )}
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4 animate-accordion-down">
        <div className="space-y-3 pl-4">
          {comments.map((comment, commentIndex) => (
            <VerbableFeedbackCommentItem
              key={`${comment.id}-${commentIndex}`}
              comment={comment}
              commentIndex={commentIndex}
              isLoading={isLoading}
              onSpeak={onSpeak}
              error={error}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default VerbableFeedbackQuestionCard;
