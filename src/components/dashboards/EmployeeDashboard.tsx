
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { User, TrendingUp, Clock, Award } from 'lucide-react';
import TeamHealthIndicator from '../TeamHealthIndicator';
import FeedbackHistory from '../FeedbackHistory';

interface EmployeeDashboardProps {
  userData: {
    name?: string;
    department?: string;
    employeeId?: string;
  };
}

const personalMetrics = [
  { month: 'Jan', engagement: 7.2, cohesion: 3.8 },
  { month: 'Feb', engagement: 7.5, cohesion: 4.0 },
  { month: 'Mar', engagement: 7.8, cohesion: 4.2 },
  { month: 'Apr', engagement: 8.1, cohesion: 4.3 },
  { month: 'May', engagement: 8.0, cohesion: 4.1 },
  { month: 'Jun', engagement: 8.3, cohesion: 4.5 },
];

const chartConfig = {
  engagement: {
    label: "Engagement Score",
    color: "#E5989B",
  },
  cohesion: {
    label: "Team Cohesion",
    color: "#FFB4A2",
  },
};

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ userData }) => {
  const currentEngagement = 8.3;
  const currentCohesion = 4.5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-growpoint-primary p-3 rounded-full">
            <img src="/lovable-uploads/c3fcdded-87c5-4a78-b39e-2094a897384e.png" alt="GrowPoint" className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-growpoint-dark">Welcome back, {userData.name || 'Employee'}!</h1>
            <p className="text-growpoint-dark/70">{userData.department || 'Your Department'} • Employee Dashboard</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-growpoint-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-growpoint-dark">Current Engagement</CardTitle>
              <TrendingUp className="h-4 w-4 text-growpoint-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-growpoint-dark">{currentEngagement}/10</div>
              <p className="text-xs text-green-600">+0.3 from last month</p>
            </CardContent>
          </Card>

          <Card className="border-growpoint-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-growpoint-dark">Team Cohesion</CardTitle>
              <User className="h-4 w-4 text-growpoint-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-growpoint-dark">{currentCohesion}/5</div>
              <p className="text-xs text-green-600">+0.4 from last month</p>
            </CardContent>
          </Card>

          <Card className="border-growpoint-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-growpoint-dark">Growth Streak</CardTitle>
              <Award className="h-4 w-4 text-growpoint-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-growpoint-dark">6 months</div>
              <p className="text-xs text-growpoint-dark/60">Continuous improvement</p>
            </CardContent>
          </Card>
        </div>

        {/* Team Health */}
        <TeamHealthIndicator 
          frictionLevel={1.5}
          engagementScore={currentEngagement}
          teamName={userData.department || 'Your Team'}
        />

        {/* Personal Growth Chart */}
        <Card className="border-growpoint-accent/20">
          <CardHeader>
            <CardTitle className="text-growpoint-dark flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Your Growth Journey
            </CardTitle>
            <CardDescription>Personal engagement and cohesion over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={personalMetrics}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="var(--color-engagement)" 
                    strokeWidth={3} 
                    dot={{ fill: "var(--color-engagement)" }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cohesion" 
                    stroke="var(--color-cohesion)" 
                    strokeWidth={3} 
                    dot={{ fill: "var(--color-cohesion)" }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Feedback History */}
        <FeedbackHistory employeeId={userData.employeeId} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
