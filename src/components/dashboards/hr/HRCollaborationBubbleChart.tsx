
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface CohesionFrictionData {
  department: string;
  cohesion: number;
  friction: number;
}

interface HRCollaborationBubbleChartProps {
  cohesionFrictionData: CohesionFrictionData[];
  chartConfig: any;
}

const HRCollaborationBubbleChart: React.FC<HRCollaborationBubbleChartProps> = ({
  cohesionFrictionData,
  chartConfig,
}) => {
  // Transform data for bubble chart with response count simulation
  const bubbleData = cohesionFrictionData.map(dept => ({
    ...dept,
    responseCount: Math.floor(Math.random() * 20) + 5, // Simulated response count
    fill: dept.friction <= 2.0 && dept.cohesion >= 4.0 ? '#10B981' : // Green: Low friction, high cohesion
           dept.friction >= 3.5 || dept.cohesion <= 2.5 ? '#EF4444' : // Red: High friction or low cohesion
           '#F59E0B' // Yellow: Medium
  }));

  return (
    <Card className="border-growpoint-accent/20 w-full max-w-full overflow-hidden">
      <CardHeader className="p-4">
        <CardTitle className="text-growpoint-dark flex items-center gap-2 text-lg">
          <BarChart3 className="w-5 h-5 text-growpoint-primary" />
          Collaboration Heatmap
        </CardTitle>
        <CardDescription className="text-growpoint-dark/60 text-sm">
          Friction vs. Cohesion by department (bubble size = response count)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis 
                type="number" 
                dataKey="friction" 
                name="Friction Level" 
                domain={[0, 5]}
                tick={{ fill: '#B5828C' }}
                axisLine={{ stroke: '#B5828C' }}
                label={{ value: 'Friction Level', position: 'insideBottom', offset: -5, fill: '#B5828C' }}
              />
              <YAxis 
                type="number" 
                dataKey="cohesion" 
                name="Cohesion Score" 
                domain={[0, 5]}
                tick={{ fill: '#B5828C' }}
                axisLine={{ stroke: '#B5828C' }}
                label={{ value: 'Cohesion Score', angle: -90, position: 'insideLeft', fill: '#B5828C' }}
              />
              <ZAxis type="number" dataKey="responseCount" range={[50, 300]} />
              <ChartTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-growpoint-accent/20 rounded shadow">
                        <p className="font-medium text-growpoint-dark">{data.department}</p>
                        <p className="text-sm text-growpoint-dark/60">Friction: {data.friction}/5</p>
                        <p className="text-sm text-growpoint-dark/60">Cohesion: {data.cohesion}/5</p>
                        <p className="text-sm text-growpoint-dark/60">Responses: {data.responseCount}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {bubbleData.map((entry, index) => (
                <Scatter
                  key={index}
                  data={[entry]}
                  fill={entry.fill}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default HRCollaborationBubbleChart;
