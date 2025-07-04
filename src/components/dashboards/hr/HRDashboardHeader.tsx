
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, MessageSquare } from 'lucide-react';
import { Lightbulb } from 'lucide-react';
import DepartmentFilter from '@/components/DepartmentFilter';

interface HRDashboardHeaderProps {
  onRestart?: () => void;
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  aiAssistantPanel: React.ReactNode;
  onViewFeedbackTable: () => void;
}

const HRDashboardHeader: React.FC<HRDashboardHeaderProps> = ({
  onRestart,
  selectedDepartment,
  onDepartmentChange,
  dateRange,
  onDateRangeChange,
  aiAssistantPanel,
  onViewFeedbackTable
}) => {
  return (
    <div className="flex items-start justify-between mb-8">
      <div className="flex items-center gap-4">
        <img 
          src="/lovable-uploads/d7cd3b1a-3e3c-49c7-8986-3d60c7901948.png" 
          alt="GrowPoint" 
          style={{ background: 'transparent' }} 
          className="w-10 h-10 object-contain" 
        />
        <div>
          <h1 className="text-3xl font-bold text-growpoint-dark">HR Dashboard</h1>
        </div>
      </div>
      
      <div className="flex items-start gap-6">
        {/* CTA Buttons Group */}
        <div className="flex flex-col gap-2 min-w-[180px]">
          {onRestart && (
            <Button 
              onClick={onRestart} 
              size="sm"
              className="text-white px-4 py-2 rounded-md text-sm font-normal w-full"
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
            className="text-white px-4 py-2 rounded-md text-sm font-normal w-full"
            style={{ backgroundColor: '#FFB4A2' }}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            View Feedback Table
          </Button>
        </div>
        
        {/* Filters Group */}
        <DepartmentFilter 
          selectedDepartment={selectedDepartment} 
          onDepartmentChange={onDepartmentChange} 
          dateRange={dateRange} 
          onDateRangeChange={onDateRangeChange} 
        />
      </div>
    </div>
  );
};

export default HRDashboardHeader;
