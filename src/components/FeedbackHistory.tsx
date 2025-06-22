
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Clock, TrendingUp, MessageSquare, AlertTriangle } from 'lucide-react';
import { useFeedbackData } from '@/hooks/useFeedbackData';

interface FeedbackHistoryProps {
  employeeId?: string;
}

const chartConfig = {
  cohesion: {
    label: "Team Cohesion",
    color: "#FFB4A2",
  },
  engagement: {
    label: "Engagement Score",
    color: "#E5989B",
  },
};

const FeedbackHistory: React.FC<FeedbackHistoryProps> = ({ employeeId }) => {
  const { feedbackData, loading, error } = useFeedbackData();

  // Process data for the specific employee or show aggregate data
  const processedHistory = React.useMemo(() => {
    if (!feedbackData.length) return [];

    // Filter by employee ID if provided, otherwise use all data
    const relevantData = employeeId 
      ? feedbackData.filter(response => response.employee_id?.toString() === employeeId)
      : feedbackData;

    return relevantData
      .sort((a, b) => new Date(a.response_date).getTime() - new Date(b.response_date).getTime())
      .map(response => ({
        date: response.response_date,
        insight: `Team focus: ${response.team_goal} - Department: ${response.department}`,
        cohesion: response.cohesion_score,
        engagement: response.engagement_score,
        focus: response.team_goal.toLowerCase()
      }));
  }, [feedbackData, employeeId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="border-growpoint-accent/20">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-growpoint-primary mx-auto mb-4"></div>
            <p className="text-growpoint-dark">Loading feedback history...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-growpoint-accent/20">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">Error loading feedback history: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!processedHistory.length) {
    return (
      <div className="space-y-6">
        <Card className="border-growpoint-accent/20">
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-8 w-8 text-growpoint-primary mx-auto mb-4" />
            <p className="text-growpoint-dark">No feedback history available yet.</p>
            <p className="text-growpoint-dark/60 text-sm">Complete surveys to see your growth over time.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Growth Chart */}
      <Card className="border-growpoint-accent/20">
        <CardHeader>
          <CardTitle className="text-growpoint-dark flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Your Growth Over Time
          </CardTitle>
          <CardDescription>Personal development journey and improvements</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processedHistory}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis domain={[0, 10]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="cohesion" 
                  stroke="var(--color-cohesion)" 
                  strokeWidth={3} 
                  dot={{ fill: "var(--color-cohesion)" }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="var(--color-engagement)" 
                  strokeWidth={3} 
                  dot={{ fill: "var(--color-engagement)" }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Feedback Timeline */}
      <Card className="border-growpoint-accent/20">
        <CardHeader>
          <CardTitle className="text-growpoint-dark flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Feedback History
          </CardTitle>
          <CardDescription>Your past insights and growth feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {processedHistory.reverse().map((feedback, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-growpoint-soft/30 rounded-lg">
                <div className="bg-growpoint-primary p-2 rounded-full flex-shrink-0">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-growpoint-dark">
                      {new Date(feedback.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      feedback.focus === 'maintain' ? 'bg-green-100 text-green-700' :
                      feedback.focus === 'improve' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {feedback.focus.charAt(0).toUpperCase() + feedback.focus.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-growpoint-dark/80">{feedback.insight}</p>
                  
                  <div className="flex gap-4 text-sm">
                    <span className="text-growpoint-dark/60">
                      Cohesion: <strong>{feedback.cohesion}/10</strong>
                    </span>
                    <span className="text-growpoint-dark/60">
                      Engagement: <strong>{feedback.engagement}/10</strong>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackHistory;
