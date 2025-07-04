
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import DepartmentFilter from '@/components/DepartmentFilter';

interface HRDashboardHeaderProps {
  onRestart?: () => void;
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  aiAssistantPanel: React.ReactNode;
}

const HRDashboardHeader: React.FC<HRDashboardHeaderProps> = ({
  onRestart,
  selectedDepartment,
  onDepartmentChange,
  dateRange,
  onDateRangeChange,
  aiAssistantPanel
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <img 
            src="/lovable-uploads/d7cd3b1a-3e3c-49c7-8986-3d60c7901948.png" 
            alt="GrowPoint" 
            style={{ background: 'transparent' }} 
            className="w-10 h-10 object-contain" 
          />
          <div>
            <h1 className="text-3xl font-bold text-growpoint-dark">HR Dashboard</h1>
            <p className="text-growpoint-dark/70">Company-wide Analytics & Insights</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-2 min-w-[180px]">
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
            {aiAssistantPanel}
          </div>
          <DepartmentFilter 
            selectedDepartment={selectedDepartment} 
            onDepartmentChange={onDepartmentChange} 
            dateRange={dateRange} 
            onDateRangeChange={onDateRangeChange} 
          />
        </div>
      </div>

      {onRestart && (
        <p className="text-sm text-growpoint-dark/60 text-center -mt-4 mb-4">
          Return to the start to explore again or give more feedback.
        </p>
      )}
    </>
  );
};

export default HRDashboardHeader;
