
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Brain } from 'lucide-react';
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
          variant="outline"
          size="sm"
          className="w-10 h-10 rounded-full p-0 border-growpoint-accent/30 hover:bg-growpoint-soft text-growpoint-dark"
          title="Open AI Assistant"
        >
          <Brain className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white border-growpoint-accent/20">
        <DialogHeader className="border-b border-growpoint-accent/20 pb-4">
          <DialogTitle className="text-growpoint-dark flex items-center gap-2">
            <Brain className="w-5 h-5 text-growpoint-primary" />
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
