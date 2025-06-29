
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Users } from 'lucide-react';

interface AdminParticipationChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
    percentage: number;
  }>;
  userDepartment: string;
}

const chartConfig = {
  responded: {
    label: "Responded",
    color: "#FFB4A2", // GrowPoint primary
  },
  notResponded: {
    label: "Not Responded",
    color: "#E5989B", // GrowPoint accent
  },
};

const AdminParticipationChart: React.FC<AdminParticipationChartProps> = ({
  data,
  userDepartment
}) => {
  // Update colors to use GrowPoint palette
  const updatedData = data.map((item, index) => ({
    ...item,
    color: index === 0 ? '#FFB4A2' : '#E5989B'
  }));

  return (
    <Card className="border-growpoint-accent/20 w-full max-w-full">
      <CardHeader className="p-4">
        <CardTitle className="text-growpoint-dark flex items-center gap-2 text-lg">
          <Users className="w-5 h-5 text-growpoint-primary" />
          Survey Participation
        </CardTitle>
        <CardDescription className="text-growpoint-dark/60 text-sm">Response rate for {userDepartment} department</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={updatedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percentage }) => `${name}: ${value} (${percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {updatedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-growpoint-accent/20 rounded shadow">
                        <p className="font-medium text-growpoint-dark">{data.name}</p>
                        <p className="text-sm text-growpoint-dark/60">Count: {data.value}</p>
                        <p className="text-sm text-growpoint-dark/60">Percentage: {data.percentage}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AdminParticipationChart;
