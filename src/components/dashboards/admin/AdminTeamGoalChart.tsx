
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Building2 } from 'lucide-react';

interface AdminTeamGoalChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  userDepartment: string;
}

const chartConfig = {
  maintain: {
    label: "Maintain",
    color: "#10B981",
  },
  improve: {
    label: "Improve", 
    color: "#F59E0B",
  },
  resolve: {
    label: "Resolve",
    color: "#EF4444",
  },
};

const AdminTeamGoalChart: React.FC<AdminTeamGoalChartProps> = ({
  data,
  userDepartment
}) => {
  return (
    <Card className="border-growpoint-accent/20">
      <CardHeader>
        <CardTitle className="text-growpoint-dark flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Team Goal Distribution
        </CardTitle>
        <CardDescription>Current focus areas for {userDepartment} team</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AdminTeamGoalChart;
