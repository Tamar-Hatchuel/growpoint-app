
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';
import { TrendingUp, AlertTriangle } from 'lucide-react';

interface EngagementTrendData {
  week: string;
  engagement: number;
}

interface BubbleData {
  department: string;
  friction: number;
  engagement: number;
  responseCount: number;
  fill: string;
}

interface HRTrendAnalysisProps {
  engagementTrend: EngagementTrendData[];
  bubbleData: BubbleData[];
  chartConfig: any;
}

const HRTrendAnalysis: React.FC<HRTrendAnalysisProps> = ({ 
  engagementTrend, 
  bubbleData, 
  chartConfig 
}) => {
  return (
    <div className="grid lg:grid-cols-2 gap-8 mb-8">
      <Card className="border-growpoint-accent/20">
        <CardHeader>
          <CardTitle className="text-growpoint-dark flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Avg. Engagement Over Time
          </CardTitle>
          <CardDescription>Weekly average engagement scores for the company</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementTrend}>
                <XAxis dataKey="week" />
                <YAxis domain={[1, 5]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="var(--color-engagement)" 
                  strokeWidth={3} 
                  dot={{ fill: "var(--color-engagement)", r: 4 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="border-growpoint-accent/20">
        <CardHeader>
          <CardTitle className="text-growpoint-dark flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Friction vs Engagement – Department Snapshot
          </CardTitle>
          <CardDescription>Department health quadrants (bubble size = response count)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={bubbleData}>
                <XAxis 
                  type="number" 
                  dataKey="friction" 
                  name="Friction Level" 
                  domain={[0, 5]}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  type="number" 
                  dataKey="engagement" 
                  name="Engagement Score" 
                  domain={[1, 5]}
                  axisLine={false}
                  tickLine={false}
                />
                <ZAxis type="number" dataKey="responseCount" range={[50, 400]} />
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded shadow">
                          <p className="font-medium">{data.department}</p>
                          <p className="text-sm">Engagement: {data.engagement}/5</p>
                          <p className="text-sm">Friction: {data.friction}/5</p>
                          <p className="text-sm">Responses: {data.responseCount}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {bubbleData.map((entry, index) => (
                  <Scatter
                    key={index}
                    dataKey="responseCount"
                    fill={entry.fill}
                    data={[entry]}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default HRTrendAnalysis;
