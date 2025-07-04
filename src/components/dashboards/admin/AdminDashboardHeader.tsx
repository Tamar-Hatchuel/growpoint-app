
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

interface AdminDashboardHeaderProps {
  userDepartment: string;
  responseCount: number;
  onRestart?: () => void;
  aiAssistantPanel: React.ReactNode;
}

const AdminDashboardHeader: React.FC<AdminDashboardHeaderProps> = ({
  userDepartment,
  responseCount,
  onRestart,
  aiAssistantPanel
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div className="p-3">
          <img 
            src="/lovable-uploads/d7cd3b1a-3e3c-49c7-8986-3d60c7901948.png" 
            alt="GrowPoint" 
            className="w-8 h-8 object-contain"
            style={{ background: 'transparent' }}
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-growpoint-dark">
            Team Summary – {userDepartment} Department
          </h1>
          <p className="text-growpoint-dark/70">{responseCount} responses • Department Analytics</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {aiAssistantPanel}
        {onRestart && (
          <Button
            onClick={onRestart}
            size="sm"
            className="text-white px-4 py-2 rounded-md text-sm font-normal"
            style={{ backgroundColor: '#FFB4A2' }}
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardHeader;
