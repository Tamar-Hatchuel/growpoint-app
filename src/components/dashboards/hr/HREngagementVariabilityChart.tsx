
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface EngagementVariabilityData {
  department: string;
  stdDev: number;
}

interface HREngagementVariabilityChartProps {
  engagementVariabilityData: EngagementVariabilityData[];
  chartConfig: any;
}

const HREngagementVariabilityChart: React.FC<HREngagementVariabilityChartProps> = ({
  engagementVariabilityData,
  chartConfig,
}) => {
  return (
    <Card className="border-growpoint-accent/20 w-full max-w-full overflow-hidden">
      <CardHeader className="p-4">
        <CardTitle className="text-growpoint-dark flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-growpoint-primary" />
          Engagement Score Variability
        </CardTitle>
        <CardDescription className="text-growpoint-dark/60 text-sm">
          Standard deviation of engagement scores across departments
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={engagementVariabilityData} margin={{ top: 10, right: 10, left: 10, bottom: 60 }}>
              <XAxis 
                dataKey="department" 
                angle={-45} 
                textAnchor="end" 
                height={80} 
                fontSize={12}
                tick={{ fill: '#B5828C' }}
                axisLine={{ stroke: '#B5828C' }}
              />
              <YAxis 
                fontSize={12}
                tick={{ fill: '#B5828C' }}
                axisLine={{ stroke: '#B5828C' }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="stdDev" 
                fill="#E5989B" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default HREngagementVariabilityChart;
