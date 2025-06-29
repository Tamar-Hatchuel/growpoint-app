
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Users } from 'lucide-react';

interface Department {
  department: string;
  engagement: number;
  cohesion: number;
  friction: number;
  employees: number;
  responseCount: number;
  engagementScores: number[];
}

interface HRDistributionChartProps {
  departments: Department[];
  chartConfig: any;
}

const HRDistributionChart: React.FC<HRDistributionChartProps> = ({ departments, chartConfig }) => {
  return (
    <Card className="border-growpoint-accent/20">
      <CardHeader>
        <CardTitle className="text-growpoint-dark flex items-center gap-2">
          <Users className="w-5 h-5" />
          Response Distribution
        </CardTitle>
        <CardDescription>Survey responses across departments</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departments}>
              <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="employees" fill="var(--color-employees)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default HRDistributionChart;
