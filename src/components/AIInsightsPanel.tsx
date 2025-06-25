
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, RefreshCw, Lightbulb } from 'lucide-react';

interface AIInsightsPanelProps {
  data: {
    avgEngagement: number;
    avgCohesion: number;
    avgFriction: number;
    teamGoalDistribution: { [key: string]: number };
    departmentName?: string;
  };
  isHR?: boolean;
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ data, isHR = false }) => {
  const [insights, setInsights] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateInsights = async () => {
    setIsLoading(true);
    
    try {
      // Simulate AI response for now - in real implementation, this would call AI Studio API
      const prompt = `Based on the data for ${data.departmentName || 'the organization'}: average engagement is ${data.avgEngagement.toFixed(1)}, cohesion is ${data.avgCohesion.toFixed(1)}, and friction is ${data.avgFriction.toFixed(1)}. Team goals selected are ${Object.entries(data.teamGoalDistribution).map(([goal, count]) => `${count} ${goal}`).join(', ')}. Provide 3 personalized, actionable recommendations for this team.`;
      
      // Mock AI response - replace with actual AI Studio API call
      const mockResponse = `Based on your team's metrics, here are three key recommendations:

• **Focus on Communication**: With an engagement score of ${data.avgEngagement.toFixed(1)}, consider implementing weekly team check-ins to boost connection and collaboration.

• **Address Friction Points**: Your friction level of ${data.avgFriction.toFixed(1)} suggests some workflow challenges. Identify and streamline processes that create bottlenecks.

• **Strengthen Team Cohesion**: Current cohesion at ${data.avgCohesion.toFixed(1)} indicates room for team-building activities and clearer shared goal alignment.`;

      setTimeout(() => {
        setInsights(mockResponse);
        setHasGenerated(true);
        setIsLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights('Unable to generate insights at this time. Please try again later.');
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-growpoint-accent/20" style={{ backgroundColor: '#E5989B20' }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{ color: '#333446' }}>
          <Brain className="w-5 h-5" />
          📊 AI Insights & Recommendations
        </CardTitle>
        <CardDescription>
          Get personalized recommendations based on your team's current metrics
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!hasGenerated ? (
          <div className="text-center py-6">
            <Lightbulb className="w-12 h-12 mx-auto mb-4 text-growpoint-primary" />
            <p className="text-growpoint-dark/70 mb-4">
              Generate AI-powered insights based on your current data
            </p>
            <Button
              onClick={generateInsights}
              disabled={isLoading}
              className="font-semibold px-6 py-2 rounded-lg text-white"
              style={{ backgroundColor: '#FFB4A2' }}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating Insights...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Generate Insights
                </>
              )}
            </Button>
          </div>
        ) : (
          <div>
            <div className="bg-white rounded-lg p-4 mb-4" style={{ color: '#333446' }}>
              <div className="whitespace-pre-line">{insights}</div>
            </div>
            <Button
              onClick={generateInsights}
              disabled={isLoading}
              variant="outline"
              className="border-growpoint-accent/30 text-growpoint-dark hover:bg-growpoint-soft"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  ↻ Regenerate Suggestions
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightsPanel;
