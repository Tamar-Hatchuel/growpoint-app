
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, X } from 'lucide-react';

interface EngagementToolsToastProps {
  show: boolean;
  onClose: () => void;
  onTryTools: () => void;
}

const EngagementToolsToast: React.FC<EngagementToolsToastProps> = ({
  show,
  onClose,
  onTryTools,
}) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up max-w-sm">
      <Card className="border-[#FFCDB2] bg-[#FFCDB2]/10 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-growpoint-dark">💡 Tip</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-orange-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-sm text-growpoint-dark/80 mb-4">
            Boost team morale this week with a 'Shoutout Challenge'!
          </p>
          
          <Button
            onClick={onTryTools}
            size="sm"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            Try Engagement Tools
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngagementToolsToast;
