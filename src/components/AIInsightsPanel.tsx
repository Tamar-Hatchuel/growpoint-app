import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, MessageCircle, Lightbulb } from 'lucide-react';
import { trackButtonClick } from '@/utils/analytics';
import ChatModal from './ChatModal';
interface AIInsightsPanelProps {
  data: {
    avgEngagement: number;
    avgCohesion: number;
    avgFriction: number;
    teamGoalDistribution: {
      [key: string]: number;
    };
    departmentName?: string;
    verbalComments?: string[];
  };
  isHR?: boolean;
}
const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  data,
  isHR = false
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const handleOpenChat = () => {
    trackButtonClick('Open AI Chat', data.departmentName || 'unknown');
    setIsChatOpen(true);
  };

  // Check if there's enough data to generate insights
  const hasData = data.avgEngagement > 0 || data.avgCohesion > 0 || data.avgFriction > 0;
  if (!hasData) {
    return <Card className="border-growpoint-accent/20" style={{
      backgroundColor: '#E5989B20'
    }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{
          color: '#333446'
        }}>
            <Brain className="w-5 h-5" />
            📊 AI Insights & Recommendations
          </CardTitle>
          <CardDescription>
            No feedback data available yet. Insights will appear after team members submit surveys.
          </CardDescription>
        </CardHeader>
      </Card>;
  }
  return <>
      <Card className="border-growpoint-accent/20" style={{
      backgroundColor: '#E5989B20'
    }}>
        <CardHeader>
          <CardTitle style={{
          color: '#333446'
        }} className="flex items-center gap-2 text-[#b5828c]">
            <Brain className="w-5 h-5" />
            📊 AI Insights & Recommendations
          </CardTitle>
          <CardDescription>
            Get AI-powered recommendations based on your team's current metrics and feedback
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="text-center py-6">
            <Lightbulb className="w-12 h-12 mx-auto mb-4 text-growpoint-primary" />
            <p className="text-growpoint-dark/70 mb-4">Chat with our AI assistant to get personalized insights</p>
            <Button onClick={handleOpenChat} className="font-semibold px-6 py-2 rounded-lg text-white" style={{
            backgroundColor: '#FFB4A2'
          }}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Generate AI Insights
            </Button>
          </div>
        </CardContent>
      </Card>

      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>;
};
export default AIInsightsPanel;