
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, RefreshCw, Lightbulb, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AIInsightsPanelProps {
  data: {
    avgEngagement: number;
    avgCohesion: number;
    avgFriction: number;
    teamGoalDistribution: { [key: string]: number };
    departmentName?: string;
    verbalComments?: string[];
  };
  isHR?: boolean;
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ data, isHR = false }) => {
  const [insights, setInsights] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsights = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Calling AI insights with data:', data);
      
      // Call the Supabase Edge Function
      const { data: result, error: functionError } = await supabase.functions.invoke('generate-ai-insights', {
        body: {
          departmentName: data.departmentName || 'the organization',
          avgEngagement: data.avgEngagement,
          avgCohesion: data.avgCohesion,
          avgFriction: data.avgFriction,
          teamGoalDistribution: data.teamGoalDistribution,
          verbalComments: data.verbalComments || []
        }
      });

      console.log('AI insights result:', result);
      console.log('AI insights error:', functionError);

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (result?.insights) {
        setInsights(result.insights);
        setHasGenerated(true);
      } else {
        throw new Error('No insights received from AI service');
      }
      
    } catch (error) {
      console.error('Error generating insights:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate insights');
      setInsights('');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if there's enough data to generate insights
  const hasData = data.avgEngagement > 0 || data.avgCohesion > 0 || data.avgFriction > 0;

  if (!hasData) {
    return (
      <Card className="border-growpoint-accent/20" style={{ backgroundColor: '#E5989B20' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: '#333446' }}>
            <Brain className="w-5 h-5" />
            📊 AI Insights & Recommendations
          </CardTitle>
          <CardDescription>
            No feedback data available yet. Insights will appear after team members submit surveys.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-growpoint-accent/20" style={{ backgroundColor: '#E5989B20' }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{ color: '#333446' }}>
          <Brain className="w-5 h-5" />
          📊 AI Insights & Recommendations
        </CardTitle>
        <CardDescription>
          Get AI-powered recommendations based on your team's current metrics and feedback
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
                  Generate AI Insights
                </>
              )}
            </Button>
          </div>
        ) : (
          <div>
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-red-700 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">Unable to generate insights</span>
                </div>
                <p className="text-red-600 text-sm">{error}</p>
                <p className="text-red-500 text-xs mt-2">
                  Make sure your OpenAI API key is properly configured in Supabase.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4 mb-4" style={{ color: '#333446' }}>
                <div className="whitespace-pre-line">{insights}</div>
              </div>
            )}
            
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
                  ↻ Regenerate Insights
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
