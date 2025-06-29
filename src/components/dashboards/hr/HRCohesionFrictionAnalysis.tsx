
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';

interface CohesionFrictionData {
  department: string;
  cohesion: number;
  friction: number;
}

interface EngagementVariabilityData {
  department: string;
  stdDev: number;
}

interface HRCohesionFrictionAnalysisProps {
  cohesionFrictionData: CohesionFrictionData[];
  engagementVariabilityData: EngagementVariabilityData[];
  chartConfig: any;
}

const HRCohesionFrictionAnalysis: React.FC<HRCohesionFrictionAnalysisProps> = ({
  cohesionFrictionData,
  engagementVariabilityData,
  chartConfig,
}) => {
  return (
    <div className="grid lg:grid-cols-2 gap-8 mb-8">
      <Card className="border-growpoint-accent/20">
        <CardHeader>
          <CardTitle className="text-growpoint-dark flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Cohesion vs Friction per Department
          </CardTitle>
          <CardDescription>Collaboration quality vs. internal tension comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cohesionFrictionData}>
                <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 5]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="cohesion" fill="var(--color-cohesion)" name="Cohesion" />
                <Bar dataKey="friction" fill="var(--color-friction)" name="Friction" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="border-growpoint-accent/20">
        <CardHeader>
          <CardTitle className="text-growpoint-dark flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Engagement Score Variability
          </CardTitle>
          <CardDescription>Standard deviation of engagement scores across departments</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementVariabilityData}>
                <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="stdDev" fill="var(--color-stdDev)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default HRCohesionFrictionAnalysis;
