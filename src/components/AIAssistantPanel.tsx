
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Lightbulb } from 'lucide-react';
import AIInsightsPanel from './AIInsightsPanel';

interface AIAssistantPanelProps {
  data: any;
  isHR: boolean;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ data, isHR }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="text-white px-4 py-2 rounded-md text-sm font-normal w-full"
          style={{ backgroundColor: '#FFB4A2' }}
          title="Open AI Assistant"
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          Generate AI Insights
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white border-growpoint-accent/20">
        <DialogHeader className="border-b border-growpoint-accent/20 pb-4">
          <DialogTitle className="text-growpoint-dark flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-growpoint-primary" />
            GrowPoint AI Assistant
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <AIInsightsPanel data={data} isHR={isHR} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIAssistantPanel;
