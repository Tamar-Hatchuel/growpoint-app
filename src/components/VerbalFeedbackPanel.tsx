
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { FeedbackResponse } from '@/hooks/useFeedbackData';

interface VerbalFeedbackPanelProps {
  feedbackData: FeedbackResponse[];
  departmentName?: string;
}

const VerbalFeedbackPanel: React.FC<VerbalFeedbackPanelProps> = ({ 
  feedbackData, 
  departmentName 
}) => {
  const [showAll, setShowAll] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string>('all');

  // Filter feedback that has verbal responses
  const verbalFeedback = feedbackData.filter(response => 
    response.verbal_q1_comment || 
    response.verbal_q2_comment || 
    response.verbal_q3_comment || 
    response.verbal_q4_comment || 
    response.verbal_q5_comment || 
    response.verbal_q6_comment || 
    response.verbal_q7_comment
  );

  const questionLabels = {
    'verbal_q1_comment': 'Q1: Team Support',
    'verbal_q2_comment': 'Q2: Sharing Ideas',
    'verbal_q3_comment': 'Q3: Handling Conflict',
    'verbal_q4_comment': 'Q4: Goal Alignment',
    'verbal_q5_comment': 'Q5: Trust & Commitments',
    'verbal_q6_comment': 'Q6: Inclusive Environment',
    'verbal_q7_comment': 'Q7: Team Communication'
  };

  const getVerbalComments = (response: FeedbackResponse) => {
    const comments: { question: string, comment: string }[] = [];
    
    Object.entries(questionLabels).forEach(([key, label]) => {
      const comment = response[key as keyof FeedbackResponse] as string;
      if (comment) {
        comments.push({ question: label, comment });
      }
    });
    
    return comments;
  };

  const displayedFeedback = showAll ? verbalFeedback : verbalFeedback.slice(0, 5);

  return (
    <Card className="border-growpoint-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-growpoint-dark">
          <MessageSquare className="w-5 h-5" />
          📝 Verbal Feedback from Team Members
        </CardTitle>
        <CardDescription>
          Anonymous written responses from your team members
          {departmentName && ` in ${departmentName}`}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {verbalFeedback.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-growpoint-primary/50" />
            <p className="text-growpoint-dark/60">
              No verbal feedback available yet. Encourage team members to add comments when filling out surveys.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedFeedback.map((response, index) => {
              const comments = getVerbalComments(response);
              
              return (
                <div key={response.id || index} className="bg-growpoint-soft/30 rounded-lg p-4">
                  <div className="text-xs text-growpoint-dark/50 mb-2">
                    {new Date(response.response_date).toLocaleDateString()} • Anonymous Response
                  </div>
                  
                  <div className="space-y-3">
                    {comments.map((comment, commentIndex) => (
                      <div key={commentIndex}>
                        <div className="text-sm font-medium text-growpoint-dark/80 mb-1">
                          {comment.question}
                        </div>
                        <div className="text-growpoint-dark bg-white rounded p-3 border-l-4 border-growpoint-primary/30">
                          "{comment.comment}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {verbalFeedback.length > 5 && (
              <div className="text-center pt-4">
                <Button
                  onClick={() => setShowAll(!showAll)}
                  variant="outline"
                  className="border-growpoint-accent/30 text-growpoint-dark hover:bg-growpoint-soft"
                >
                  {showAll ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Show More ({verbalFeedback.length - 5} more)
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerbalFeedbackPanel;
