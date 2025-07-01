
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
  // GrowPoint brand color mapping function
  const getGrowPointColor = (friction: number, cohesion: number) => {
    // Calculate collaboration score: high cohesion + low friction = better collaboration
    const collaborationScore = (cohesion - friction + 5) / 2; // Normalize to 0-5 scale
    
    // Map to GrowPoint brand colors based on collaboration quality
    if (collaborationScore >= 4.0) return '#FFCDB2'; // Low values (best collaboration)
    if (collaborationScore >= 3.0) return '#FFB4A2'; // Medium-low values
    if (collaborationScore >= 2.0) return '#E5989B'; // Medium-high values
    return '#B5828C'; // High values (needs attention)
  };

  // Transform data for bubble chart with GrowPoint color scheme
  const bubbleData = cohesionFrictionData.map(dept => ({
    ...dept,
    responseCount: Math.floor(Math.random() * 20) + 5, // Simulated response count
    fill: getGrowPointColor(dept.friction, dept.cohesion)
  }));

  // Legend data for visual reference
  const legendData = [
    { label: 'High Collaboration', color: '#FFCDB2', description: 'Low friction, high cohesion' },
    { label: 'Good Collaboration', color: '#FFB4A2', description: 'Moderate levels' },
    { label: 'Needs Review', color: '#E5989B', description: 'Some concerns' },
    { label: 'Needs Attention', color: '#B5828C', description: 'High friction or low cohesion' }
  ];

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
        <ChartContainer config={chartConfig} className="h-[350px] w-full mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis 
                type="number" 
                dataKey="friction" 
                name="Friction Level" 
                domain={[0, 5]}
                tick={{ fill: '#B5828C', fontSize: 12 }}
                axisLine={{ stroke: '#B5828C' }}
                label={{ value: 'Friction Level', position: 'insideBottom', offset: -5, fill: '#B5828C' }}
              />
              <YAxis 
                type="number" 
                dataKey="cohesion" 
                name="Cohesion Score" 
                domain={[0, 5]}
                tick={{ fill: '#B5828C', fontSize: 12 }}
                axisLine={{ stroke: '#B5828C' }}
                label={{ value: 'Cohesion Score', angle: -90, position: 'insideLeft', fill: '#B5828C' }}
              />
              <ZAxis type="number" dataKey="responseCount" range={[50, 300]} />
              <ChartTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-growpoint-accent/20 rounded shadow-lg">
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
        
        {/* GrowPoint Brand Color Legend */}
        <div className="bg-growpoint-soft/30 rounded-lg p-4 border border-growpoint-accent/20">
          <h4 className="text-sm font-semibold text-growpoint-dark mb-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gradient-to-r from-growpoint-soft via-growpoint-primary to-growpoint-accent"></div>
            Collaboration Quality Legend
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {legendData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full border border-growpoint-accent/30"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-growpoint-dark">{item.label}</div>
                  <div className="text-xs text-growpoint-dark/60">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-growpoint-accent/20">
            <p className="text-xs text-growpoint-dark/70">
              💡 <strong>Tip:</strong> Departments in lighter colors show better collaboration patterns
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HRCollaborationBubbleChart;
