
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FeedbackResponse } from '@/hooks/useFeedbackData';
import SurveyTTSButton from './SurveyTTSButton';
import { useSurveyTTS } from '@/hooks/useSurveyTTS';

interface VerbalFeedbackTableProps {
  feedbackData: FeedbackResponse[];
  departmentName?: string;
}

const VerbalFeedbackTable: React.FC<VerbalFeedbackTableProps> = ({ 
  feedbackData, 
  departmentName 
}) => {
  const [showAll, setShowAll] = useState(false);
  const { speakText, isLoading: isTTSLoading } = useSurveyTTS();

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

  // Create table rows from feedback data
  const tableRows = verbalFeedback.flatMap((response, responseIndex) => {
    const comments = getVerbalComments(response);
    return comments.map((comment, commentIndex) => ({
      id: `${response.id || responseIndex}-${commentIndex}`,
      date: new Date(response.response_date).toLocaleDateString(),
      question: comment.question,
      comment: comment.comment,
      isFirstRow: commentIndex === 0,
      responseIndex
    }));
  });

  const displayedRows = showAll ? tableRows : tableRows.slice(0, 10);

  return (
    <Card className="border-growpoint-accent/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-growpoint-dark">
          Verbal Feedback from Team Members
        </CardTitle>
        <CardDescription className="text-sm">
          Anonymous written responses from your team members
          {departmentName && ` in ${departmentName}`}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        {verbalFeedback.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-growpoint-dark/60 text-sm">
              No verbal feedback available yet. Encourage team members to add comments when filling out surveys.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="border border-growpoint-accent/20 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-growpoint-soft/30">
                    <TableHead className="text-growpoint-dark font-medium text-xs h-8 py-2">Date</TableHead>
                    <TableHead className="text-growpoint-dark font-medium text-xs h-8 py-2">Question</TableHead>
                    <TableHead className="text-growpoint-dark font-medium text-xs h-8 py-2">Verbal Comment</TableHead>
                    <TableHead className="w-12 h-8 py-2"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedRows.map((row, index) => (
                    <TableRow 
                      key={row.id}
                      className={`
                        hover:bg-growpoint-soft/20 transition-colors h-10
                        ${index % 2 === 0 ? 'bg-white' : 'bg-growpoint-soft/10'}
                        ${row.isFirstRow && index > 0 ? 'border-t-2 border-growpoint-accent/30' : ''}
                      `}
                    >
                      <TableCell className="text-xs text-growpoint-dark/70 py-2">
                        {row.isFirstRow ? row.date : ''}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-growpoint-dark/80 py-2">
                        {row.question}
                      </TableCell>
                      <TableCell className="text-growpoint-dark text-xs py-2">
                        "{row.comment}"
                      </TableCell>
                      <TableCell className="py-2">
                        <SurveyTTSButton
                          text={row.comment}
                          isLoading={isTTSLoading}
                          onSpeak={speakText}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {tableRows.length > 10 && (
              <div className="text-center pt-2">
                <Button
                  onClick={() => setShowAll(!showAll)}
                  variant="outline"
                  size="sm"
                  className="border-growpoint-accent/30 text-growpoint-dark hover:bg-growpoint-soft text-xs"
                >
                  {showAll ? (
                    <>
                      <ChevronUp className="w-3 h-3 mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3 mr-1" />
                      Show More ({tableRows.length - 10} more)
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

export default VerbalFeedbackTable;
