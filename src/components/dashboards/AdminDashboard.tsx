import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useFeedbackData } from '@/hooks/useFeedbackData';
import { useAdminDashboardData } from '@/hooks/useAdminDashboardData';
import AIAssistantPanel from '@/components/AIAssistantPanel';
import VerbableFeedbackScreen from '@/components/VerbableFeedbackScreen';
import AdminDashboardHeader from './admin/AdminDashboardHeader';
import AdminKPICards from './admin/AdminKPICards';
import AdminEngagementChart from './admin/AdminEngagementChart';
import AdminParticipationChart from './admin/AdminParticipationChart';
import AdminFrictionAnalysis from './admin/AdminFrictionAnalysis';

interface AdminDashboardProps {
  userData: {
    name?: string;
    department?: string;
    employeeId?: string;
    userDepartment?: string;
  };
  onRestart?: () => void;
  onBackToRoleSelection?: () => void;
  onAnswerQuestionnaire?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  userData, 
  onRestart, 
  onBackToRoleSelection,
  onAnswerQuestionnaire
}) => {
  const { feedbackData, loading, error } = useFeedbackData();
  const userDepartment = userData.userDepartment || userData.department || 'Unknown';
  const [showFeedbackScreen, setShowFeedbackScreen] = useState(false);
  
  const {
    departmentData,
    avgEngagementScore,
    participationData,
    engagementOverTime,
    frictionStats,
    aiInsightsData
  } = useAdminDashboardData(feedbackData, userDepartment);

  const downloadCSV = () => {
    const csvData = [['ID', 'Department', 'Engagement Score', 'Cohesion Score', 'Friction Level', 'Response Date', 'Created At', 'Verbal Q1', 'Verbal Q2', 'Verbal Q3', 'Verbal Q4', 'Verbal Q5', 'Verbal Q6', 'Verbal Q7']];
    
    departmentData.forEach(response => {
      csvData.push([
        response.id,
        response.department,
        response.engagement_score?.toString() || '',
        response.cohesion_score?.toString() || '',
        response.friction_level?.toString() || '',
        response.response_date,
        response.created_at,
        response.verbal_q1_comment || '',
        response.verbal_q2_comment || '',
        response.verbal_q3_comment || '',
        response.verbal_q4_comment || '',
        response.verbal_q5_comment || '',
        response.verbal_q6_comment || '',
        response.verbal_q7_comment || ''
      ]);
    });

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `admin_feedback_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 pt-20 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-growpoint-primary mx-auto mb-4"></div>
          <p className="text-growpoint-dark">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 pt-20 p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Error loading dashboard data: {error}</p>
        </div>
      </div>
    );
  }

  if (showFeedbackScreen) {
    return (
      <VerbableFeedbackScreen
        feedbackData={departmentData}
        departmentName={userDepartment}
        onBack={onBackToRoleSelection || (() => setShowFeedbackScreen(false))}
        onViewDashboard={() => setShowFeedbackScreen(false)}
        userRole="admin"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20">
      <AdminDashboardHeader
        userDepartment={userDepartment}
        responseCount={departmentData.length}
        onRestart={onBackToRoleSelection || onRestart}
        onDownloadCSV={downloadCSV}
        aiAssistantPanel={<AIAssistantPanel data={aiInsightsData} isHR={false} />}
        onViewFeedbackTable={() => setShowFeedbackScreen(true)}
        onAnswerQuestionnaire={onAnswerQuestionnaire}
      />

      <div className="pt-20 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <AdminKPICards
            responseCount={departmentData.length}
            avgEngagementScore={avgEngagementScore}
            participationPercentage={participationData[0]?.percentage || 0}
            frictionStats={frictionStats}
          />

          {/* Fixed Layout for Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="w-full">
              <AdminEngagementChart
                data={engagementOverTime}
                userDepartment={userDepartment}
              />
            </div>
            <div className="w-full">
              <AdminParticipationChart
                data={participationData}
                userDepartment={userDepartment}
              />
            </div>
          </div>

          <AdminFrictionAnalysis
            frictionStats={frictionStats}
            userDepartment={userDepartment}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
