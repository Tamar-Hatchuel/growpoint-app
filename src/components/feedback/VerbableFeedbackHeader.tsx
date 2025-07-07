
import React from 'react';

interface VerbableFeedbackHeaderProps {
  totalComments: number;
  totalQuestions: number;
}

const VerbableFeedbackHeader: React.FC<VerbableFeedbackHeaderProps> = ({
  totalComments,
  totalQuestions
}) => {
  return (
    <div className="mb-8 animate-fade-in">
      <h1 className="text-2xl font-bold text-growpoint-dark mb-1">
        Feedback from Team Members
      </h1>
      <p className="text-sm text-growpoint-dark/70">
        Review and analyze verbal feedback responses from your team
      </p>
    </div>
  );
};

export default VerbableFeedbackHeader;
