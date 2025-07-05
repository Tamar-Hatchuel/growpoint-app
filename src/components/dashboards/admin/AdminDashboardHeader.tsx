
import React from 'react';
import { Home, MessageSquare } from 'lucide-react';
import { GrowpointCTAButton } from '@/components/ui/growpoint-cta-button';

interface AdminDashboardHeaderProps {
  userDepartment: string;
  responseCount: number;
  onRestart?: () => void;
  aiAssistantPanel: React.ReactNode;
  onViewFeedbackTable: () => void;
}

const AdminDashboardHeader: React.FC<AdminDashboardHeaderProps> = ({
  userDepartment,
  responseCount,
  onRestart,
  aiAssistantPanel,
  onViewFeedbackTable
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Left side - Logo and Title */}
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/d7cd3b1a-3e3c-49c7-8986-3d60c7901948.png" 
              alt="GrowPoint" 
              className="w-6 h-6 object-contain"
            />
            <div>
              <h1 className="text-lg font-medium text-growpoint-dark">
                GrowPoint – Admin Dashboard
              </h1>
              <p className="text-xs text-growpoint-dark/70">
                {userDepartment} Department • {responseCount} responses
              </p>
            </div>
          </div>
          
          {/* Right side - CTAs */}
          <div className="flex items-center gap-3">
            {onRestart && (
              <GrowpointCTAButton onClick={onRestart} variant="outline">
                <Home className="w-3 h-3 mr-1.5" />
                Back to Home
              </GrowpointCTAButton>
            )}
            {aiAssistantPanel}
            <GrowpointCTAButton onClick={onViewFeedbackTable}>
              <MessageSquare className="w-3 h-3 mr-1.5" />
              View Feedback Table
            </GrowpointCTAButton>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminDashboardHeader;
