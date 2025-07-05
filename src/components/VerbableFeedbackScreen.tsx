import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown, ChevronUp, Download, ArrowLeft } from 'lucide-react';
import { FeedbackResponse } from '@/hooks/useFeedbackData';
import SurveyTTSButton from './SurveyTTSButton';
import { useSurveyTTS } from '@/hooks/useSurveyTTS';
interface VerbableFeedbackScreenProps {
  feedbackData: FeedbackResponse[];
  departmentName?: string;
  onBack: () => void;
  userRole: 'hr' | 'admin';
}
const VerbableFeedbackScreen: React.FC<VerbableFeedbackScreenProps> = ({
  feedbackData,
  departmentName,
  onBack,
  userRole
}) => {
  const [showAll, setShowAll] = useState(false);
  const {
    speakText,
    isLoading: isTTSLoading
  } = useSurveyTTS();

  // Filter feedback that has verbal responses
  const verbalFeedback = feedbackData.filter(response => response.verbal_q1_comment || response.verbal_q2_comment || response.verbal_q3_comment || response.verbal_q4_comment || response.verbal_q5_comment || response.verbal_q6_comment || response.verbal_q7_comment);
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
    const comments: {
      question: string;
      comment: string;
    }[] = [];
    Object.entries(questionLabels).forEach(([key, label]) => {
      const comment = response[key as keyof FeedbackResponse] as string;
      if (comment) {
        comments.push({
          question: label,
          comment
        });
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
  const downloadCSV = () => {
    const csvData = [['Date', 'Question', 'Verbal Comment'], ...tableRows.map(row => [row.date, row.question, `"${row.comment.replace(/"/g, '""')}"`])];
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `verbal-feedback-${departmentName || 'all-departments'}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" size="sm" className="border-growpoint-accent/30 text-growpoint-dark hover:bg-growpoint-soft">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl text-growpoint-dark font-bold">Feedback from Team Members</h1>
              <p className="text-growpoint-dark/70 text-sm">
                Anonymous written responses{departmentName && ` from ${departmentName}`}
              </p>
            </div>
          </div>
          
          {tableRows.length > 0 && <Button onClick={downloadCSV} className="text-white px-4 py-2 rounded-md text-sm font-normal" style={{
          backgroundColor: '#FFB4A2'
        }}>
              <Download className="w-4 h-4 mr-2" />
              Download CSV
            </Button>}
        </div>

        {/* Feedback Table */}
        <Card className="border-growpoint-accent/20">
          <CardContent className="p-6">
            {verbalFeedback.length === 0 ? <div className="text-center py-8">
                <p className="text-growpoint-dark/60">
                  No verbal feedback available yet. Encourage team members to add comments when filling out surveys.
                </p>
              </div> : <div className="space-y-4">
                <div className="border border-growpoint-accent/20 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-growpoint-soft/30">
                        <TableHead className="text-growpoint-dark font-medium text-sm h-10 py-3">Date</TableHead>
                        <TableHead className="text-growpoint-dark font-medium text-sm h-10 py-3">Question</TableHead>
                        <TableHead className="text-growpoint-dark font-medium text-sm h-10 py-3">Verbal Comment</TableHead>
                        <TableHead className="w-12 h-10 py-3"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedRows.map((row, index) => <TableRow key={row.id} className={`
                            hover:bg-growpoint-soft/20 transition-colors h-12
                            ${index % 2 === 0 ? 'bg-white' : 'bg-growpoint-soft/10'}
                            ${row.isFirstRow && index > 0 ? 'border-t-2 border-growpoint-accent/30' : ''}
                          `}>
                          <TableCell className="text-sm text-growpoint-dark/70 py-3">
                            {row.isFirstRow ? row.date : ''}
                          </TableCell>
                          <TableCell className="text-sm font-medium text-growpoint-dark/80 py-3">
                            {row.question}
                          </TableCell>
                          <TableCell className="text-growpoint-dark text-sm py-3">
                            "{row.comment}"
                          </TableCell>
                          <TableCell className="py-3">
                            <SurveyTTSButton text={row.comment} isLoading={isTTSLoading} onSpeak={speakText} />
                          </TableCell>
                        </TableRow>)}
                    </TableBody>
                  </Table>
                </div>
                
                {tableRows.length > 10 && <div className="text-center pt-3">
                    <Button onClick={() => setShowAll(!showAll)} variant="outline" size="sm" className="border-growpoint-accent/30 text-growpoint-dark hover:bg-growpoint-soft text-sm">
                      {showAll ? <>
                          <ChevronUp className="w-4 h-4 mr-2" />
                          Show Less
                        </> : <>
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Show More ({tableRows.length - 10} more)
                        </>}
                    </Button>
                  </div>}
              </div>}
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default VerbableFeedbackScreen;