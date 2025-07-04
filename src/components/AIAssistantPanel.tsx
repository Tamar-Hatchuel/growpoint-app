
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import ChatModal from './ChatModal';

interface AIAssistantPanelProps {
  data: {
    avgEngagement: number;
    avgCohesion: number;
    avgFriction: number;
    teamGoalDistribution: { [key: string]: number };
    departmentName: string;
    verbalComments: string[];
  };
  isHR: boolean;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ data, isHR }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        size="sm"
        className="text-white px-3 py-1.5 rounded text-xs font-medium h-8"
        style={{ backgroundColor: '#FFB4A2' }}
      >
        <Lightbulb className="w-3 h-3 mr-1.5" />
        Generate AI Insights  
      </Button>

      <ChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dashboardData={data}
        userRole={isHR ? 'hr' : 'admin'}
      />
    </>
  );
};

export default AIAssistantPanel;
