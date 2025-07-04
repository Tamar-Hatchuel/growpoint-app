
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, MessageSquare, Lightbulb } from 'lucide-react';
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
            <h1 className="text-lg font-medium text-growpoint-dark">
              GrowPoint – HR Dashboard
            </h1>
          </div>
          
          {/* Right side - CTAs and Filters in single row */}
          <div className="flex items-center gap-3">
            {/* CTA Buttons */}
            {onRestart && (
              <Button 
                onClick={onRestart} 
                size="sm"
                className="bg-growpoint-primary hover:bg-growpoint-accent text-white px-3 py-1.5 rounded text-xs font-medium h-8"
              >
                <Home className="w-3 h-3 mr-1.5" />
                Back to Home
              </Button>
            )}
            {aiAssistantPanel}
            <Button
              onClick={onViewFeedbackTable}
              size="sm"
              className="bg-growpoint-primary hover:bg-growpoint-accent text-white px-3 py-1.5 rounded text-xs font-medium h-8"
            >
              <MessageSquare className="w-3 h-3 mr-1.5" />
              View Feedback Table
            </Button>
            
            {/* Vertical separator */}
            <div className="h-6 w-px bg-gray-300 mx-2" />
            
            {/* Filters */}
            <DepartmentFilter 
              selectedDepartment={selectedDepartment} 
              onDepartmentChange={onDepartmentChange} 
              dateRange={dateRange} 
              onDateRangeChange={onDateRangeChange} 
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HRDashboardHeader;
