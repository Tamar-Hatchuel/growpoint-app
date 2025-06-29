
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface TrendData {
  month: string;
  engagement: number;
  retention: number;
  satisfaction: number;
}

interface HRPerformanceTrendsProps {
  companyTrendData: TrendData[];
  chartConfig: any;
}

const HRPerformanceTrends: React.FC<HRPerformanceTrendsProps> = ({
  companyTrendData,
  chartConfig,
}) => {
  return (
    <Card className="border-growpoint-accent/20">
      <CardHeader>
        <CardTitle className="text-growpoint-dark flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Company Performance Trends
        </CardTitle>
        <CardDescription>6-month overview of key HR metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={companyTrendData}>
              <XAxis dataKey="month" />
              <YAxis yAxisId="engagement" orientation="left" domain={[0, 5]} />
              <YAxis yAxisId="other" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                yAxisId="engagement"
                type="monotone" 
                dataKey="engagement" 
                stroke="var(--color-engagement)" 
                strokeWidth={3} 
                dot={{ fill: "var(--color-engagement)" }} 
              />
              <Line 
                yAxisId="other"
                type="monotone" 
                dataKey="retention" 
                stroke="var(--color-retention)" 
                strokeWidth={3} 
                dot={{ fill: "var(--color-retention)" }} 
              />
              <Line 
                yAxisId="other"
                type="monotone" 
                dataKey="satisfaction" 
                stroke="var(--color-satisfaction)" 
                strokeWidth={3} 
                dot={{ fill: "var(--color-satisfaction)" }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default HRPerformanceTrends;
