
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
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ userData, onRestart }) => {
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
        onBack={() => setShowFeedbackScreen(false)}
        userRole="admin"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20">
      <AdminDashboardHeader
        userDepartment={userDepartment}
        responseCount={departmentData.length}
        onRestart={onRestart}
        aiAssistantPanel={<AIAssistantPanel data={aiInsightsData} isHR={false} />}
        onViewFeedbackTable={() => setShowFeedbackScreen(true)}
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
