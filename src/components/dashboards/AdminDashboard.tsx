
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useFeedbackData } from '@/hooks/useFeedbackData';
import { useAdminDashboardData } from '@/hooks/useAdminDashboardData';
import AIInsightsPanel from '@/components/AIInsightsPanel';
import VerbalFeedbackPanel from '@/components/VerbalFeedbackPanel';
import AdminDashboardHeader from './admin/AdminDashboardHeader';
import AdminKPICards from './admin/AdminKPICards';
import AdminEngagementChart from './admin/AdminEngagementChart';
import AdminParticipationChart from './admin/AdminParticipationChart';
import AdminTeamGoalChart from './admin/AdminTeamGoalChart';
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
  
  const {
    departmentData,
    avgEngagementScore,
    participationData,
    engagementOverTime,
    teamGoalDistribution,
    frictionStats,
    aiInsightsData
  } = useAdminDashboardData(feedbackData, userDepartment);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-growpoint-primary mx-auto mb-4"></div>
          <p className="text-growpoint-dark">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Error loading dashboard data: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <AdminDashboardHeader
          userDepartment={userDepartment}
          responseCount={departmentData.length}
          onRestart={onRestart}
        />

        <AdminKPICards
          responseCount={departmentData.length}
          avgEngagementScore={avgEngagementScore}
          participationPercentage={participationData[0].percentage}
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

        <div className="w-full mb-6">
          <AdminTeamGoalChart
            data={teamGoalDistribution}
            userDepartment={userDepartment}
          />
        </div>

        <AdminFrictionAnalysis
          frictionStats={frictionStats}
          userDepartment={userDepartment}
        />

        <AIInsightsPanel 
          data={aiInsightsData}
          isHR={false}
        />

        <VerbalFeedbackPanel 
          feedbackData={departmentData}
          departmentName={userDepartment}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
