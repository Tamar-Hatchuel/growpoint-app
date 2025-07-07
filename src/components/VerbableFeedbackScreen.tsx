
import React, { useState } from 'react';
import { FeedbackResponse } from '@/hooks/useFeedbackData';
import { useSurveyTTS } from '@/hooks/useSurveyTTS';
import FeedbackScreenNavbar from './FeedbackScreenNavbar';
import VerbableFeedbackHeader from './feedback/VerbableFeedbackHeader';
import VerbableFeedbackContent from './feedback/VerbableFeedbackContent';

interface VerbableFeedbackScreenProps {
  feedbackData: FeedbackResponse[];
  departmentName?: string;
  onBack: () => void;
  onViewDashboard: () => void;
  onGenerateInsights?: () => void;
  userRole: 'hr' | 'admin';
}

const VerbableFeedbackScreen: React.FC<VerbableFeedbackScreenProps> = ({
  feedbackData,
  departmentName,
  onBack,
  onViewDashboard,
  onGenerateInsights,
  userRole
}) => {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set(['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7']));
  const {
    speakText,
    isLoading: isTTSLoading,
    error: ttsError
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
        onGenerateInsights={onGenerateInsights}
        onViewDashboard={onViewDashboard}
        totalComments={totalComments}
        totalQuestions={Object.keys(questionLabels).length}
        departmentName={departmentName}
        userRole={userRole}
      />
      
      {/* Main Content with proper top spacing */}
      <div className="pt-20 p-6">
        <div className="max-w-7xl mx-auto">
          <VerbableFeedbackHeader
            totalComments={totalComments}
            totalQuestions={Object.keys(questionLabels).length}
          />

          <VerbableFeedbackContent
            verbalFeedback={verbalFeedback}
            questionLabels={questionLabels}
            expandedQuestions={expandedQuestions}
            onToggleQuestion={toggleQuestion}
            onSpeak={speakText}
            isLoading={isTTSLoading}
            error={ttsError}
          />
        </div>
      </div>
    </div>
  );
};

export default VerbableFeedbackScreen;
