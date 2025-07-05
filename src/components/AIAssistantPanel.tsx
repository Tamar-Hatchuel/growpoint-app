
import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import ChatModal from './ChatModal';
import { GrowpointCTAButton } from '@/components/ui/growpoint-cta-button';

interface AIAssistantPanelProps {
  data: {
    avgEngagement: number;
    avgCohesion: number;
    avgFriction: number;
    teamGoalDistribution: {
      [key: string]: number;
    };
    departmentName: string;
    verbalComments: string[];
  };
  isHR: boolean;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  data,
  isHR
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <GrowpointCTAButton onClick={() => setIsModalOpen(true)}>
        <Lightbulb className="w-3 h-3 mr-1.5" />
        Generate AI Insights  
      </GrowpointCTAButton>

      <ChatModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default AIAssistantPanel;
