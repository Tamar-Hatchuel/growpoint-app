
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, MessageSquare } from 'lucide-react';

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
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Title */}
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/d7cd3b1a-3e3c-49c7-8986-3d60c7901948.png" 
              alt="GrowPoint" 
              className="w-8 h-8 object-contain"
            />
            <div>
              <h1 className="text-xl font-semibold text-growpoint-dark">
                GrowPoint – Admin Dashboard
              </h1>
              <p className="text-sm text-growpoint-dark/70">
                {userDepartment} Department • {responseCount} responses
              </p>
            </div>
          </div>
          
          {/* Right side - CTAs */}
          <div className="flex items-center gap-3">
            {onRestart && (
              <Button
                onClick={onRestart}
                size="sm"
                className="text-white px-3 py-2 rounded-md text-sm font-normal"
                style={{ backgroundColor: '#FFB4A2' }}
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            )}
            {aiAssistantPanel}
            <Button
              onClick={onViewFeedbackTable}
              size="sm"
              className="text-white px-3 py-2 rounded-md text-sm font-normal"
              style={{ backgroundColor: '#FFB4A2' }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              View Feedback Table
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminDashboardHeader;
