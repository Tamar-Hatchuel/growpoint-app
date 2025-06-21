
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Clock, TrendingUp, MessageSquare } from 'lucide-react';

interface FeedbackHistoryProps {
  employeeId?: string;
}

const feedbackHistory = [
  {
    date: '2024-01-15',
    insight: 'Strong team collaboration detected',
    cohesion: 3.8,
    engagement: 7.2,
    focus: 'maintain'
  },
  {
    date: '2024-02-15',
    insight: 'Improvement in communication patterns',
    cohesion: 4.0,
    engagement: 7.5,
    focus: 'improve'
  },
  {
    date: '2024-03-15',
    insight: 'Excellent progress in team dynamics',
    cohesion: 4.2,
    engagement: 7.8,
    focus: 'maintain'
  },
  {
    date: '2024-04-15',
    insight: 'Leadership skills developing well',
    cohesion: 4.3,
    engagement: 8.1,
    focus: 'maintain'
  },
  {
    date: '2024-05-15',
    insight: 'Continued strong performance',
    cohesion: 4.1,
    engagement: 8.0,
    focus: 'maintain'
  },
  {
    date: '2024-06-15',
    insight: 'Outstanding team contribution',
    cohesion: 4.5,
    engagement: 8.3,
    focus: 'maintain'
  },
];

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
              <LineChart data={feedbackHistory}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
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
            {feedbackHistory.reverse().map((feedback, index) => (
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
                      Cohesion: <strong>{feedback.cohesion}/5</strong>
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
