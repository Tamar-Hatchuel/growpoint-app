
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { FeedbackResponse } from '@/hooks/useFeedbackData';
import SurveyTTSButton from './SurveyTTSButton';
import { useSurveyTTS } from '@/hooks/useSurveyTTS';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import FeedbackScreenNavbar from './FeedbackScreenNavbar';

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
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set(['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7']));
  const {
    speakText,
    isLoading: isTTSLoading
  } = useSurveyTTS();

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
    'Q1': { key: 'verbal_q1_comment', label: 'Team Support' },
    'Q2': { key: 'verbal_q2_comment', label: 'Sharing Ideas' },
    'Q3': { key: 'verbal_q3_comment', label: 'Handling Conflict' },
    'Q4': { key: 'verbal_q4_comment', label: 'Goal Alignment' },
    'Q5': { key: 'verbal_q5_comment', label: 'Trust & Commitments' },
    'Q6': { key: 'verbal_q6_comment', label: 'Inclusive Environment' },
    'Q7': { key: 'verbal_q7_comment', label: 'Team Communication' }
  };

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

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const downloadCSV = () => {
    const csvData = [['Question', 'Date', 'Verbal Comment']];
    
    Object.entries(questionLabels).forEach(([questionId, { label }]) => {
      const comments = getCommentsForQuestion(questionId);
      comments.forEach(comment => {
        csvData.push([`${questionId}: ${label}`, comment.date, `"${comment.comment.replace(/"/g, '""')}"`]);
      });
    });

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
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

  const totalComments = Object.keys(questionLabels).reduce((total, questionId) => {
    return total + getCommentsForQuestion(questionId).length;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20">
      {/* Fixed Navbar */}
      <FeedbackScreenNavbar
        onBack={onBack}
        onDownloadCSV={downloadCSV}
        totalComments={totalComments}
        totalQuestions={Object.keys(questionLabels).length}
        departmentName={departmentName}
      />
      
      {/* Main Content with proper top spacing */}
      <div className="pt-20 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-growpoint-dark mb-1">
              Feedback from Team Members
            </h1>
            <p className="text-sm text-growpoint-dark/70">
              Review and analyze verbal feedback responses from your team
            </p>
          </div>

          {/* Feedback Content */}
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
                  {Object.entries(questionLabels).map(([questionId, { label }], index) => {
                    const comments = getCommentsForQuestion(questionId);
                    if (comments.length === 0) return null;

                    return (
                      <Collapsible
                        key={questionId}
                        open={expandedQuestions.has(questionId)}
                        onOpenChange={() => toggleQuestion(questionId)}
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
                            {expandedQuestions.has(questionId) ? (
                              <ChevronUp className="w-5 h-5 text-growpoint-dark/60 transition-transform duration-200" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-growpoint-dark/60 transition-transform duration-200" />
                            )}
                          </div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="mt-4 animate-accordion-down">
                          <div className="space-y-3 pl-4">
                            {comments.map((comment, commentIndex) => (
                              <div
                                key={`${comment.id}-${commentIndex}`}
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
                                  isLoading={isTTSLoading}
                                  onSpeak={speakText}
                                />
                              </div>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VerbableFeedbackScreen;
