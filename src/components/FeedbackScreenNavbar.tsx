
import React from 'react';
import { Home, Lightbulb, Download } from 'lucide-react';
import { GrowpointCTAButton } from '@/components/ui/growpoint-cta-button';

interface FeedbackScreenNavbarProps {
  onBack: () => void;
  onDownloadCSV: () => void;
  onGenerateInsights?: () => void;
  totalComments: number;
  totalQuestions: number;
  departmentName?: string;
}

const FeedbackScreenNavbar: React.FC<FeedbackScreenNavbarProps> = ({
  onBack,
  onDownloadCSV,
  onGenerateInsights,
  totalComments,
  totalQuestions,
  departmentName
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
                GrowPoint – HR Feedback
              </h1>
              <p className="text-xs text-growpoint-dark/70">
                {totalComments} comments across {totalQuestions} questions
                {departmentName && ` • ${departmentName} Department`}
              </p>
            </div>
          </div>
          
          {/* Right side - CTA Buttons */}
          <div className="flex items-center gap-3">
            <GrowpointCTAButton onClick={onBack} variant="outline">
              <Home className="w-3 h-3 mr-1.5" />
              Back to Home
            </GrowpointCTAButton>
            
            {onGenerateInsights && (
              <GrowpointCTAButton onClick={onGenerateInsights}>
                <Lightbulb className="w-3 h-3 mr-1.5" />
                Generate AI Insights
              </GrowpointCTAButton>
            )}
            
            {totalComments > 0 && (
              <GrowpointCTAButton onClick={onDownloadCSV}>
                <Download className="w-3 h-3 mr-1.5" />
                Download CSV
              </GrowpointCTAButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FeedbackScreenNavbar;
