
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface AdminEngagementChartProps {
  data: Array<{
    week: string;
    engagement: number;
  }>;
  userDepartment: string;
}

const chartConfig = {
  engagement: {
    label: "Engagement Score",
    color: "#FFB4A2", // GrowPoint primary
  },
};

const AdminEngagementChart: React.FC<AdminEngagementChartProps> = ({
  data,
  userDepartment
}) => {
  return (
    <Card className="border-growpoint-accent/20 w-full max-w-full">
      <CardHeader className="p-4">
        <CardTitle className="text-growpoint-dark flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-growpoint-primary" />
          Engagement Over Time
        </CardTitle>
        <CardDescription className="text-growpoint-dark/60 text-sm">Weekly average engagement scores for {userDepartment}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <XAxis 
                dataKey="week" 
                fontSize={12} 
                tick={{ fill: '#B5828C' }}
                axisLine={{ stroke: '#B5828C' }}
              />
              <YAxis 
                domain={[0, 5]} 
                fontSize={12}
                tick={{ fill: '#B5828C' }}
                axisLine={{ stroke: '#B5828C' }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="engagement" 
                fill="#FFB4A2" 
                radius={[4, 4, 0, 0]}
                onMouseEnter={(data, index, e) => {
                  const target = e.target as HTMLElement;
                  if (target && target.style) {
                    target.style.fill = '#E08A8A';
                  }
                }}
                onMouseLeave={(data, index, e) => {
                  const target = e.target as HTMLElement;
                  if (target && target.style) {
                    target.style.fill = '#FFB4A2';
                  }
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AdminEngagementChart;
