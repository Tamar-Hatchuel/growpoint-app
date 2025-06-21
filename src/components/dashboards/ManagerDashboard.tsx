
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { Users, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import TeamHealthIndicator from '../TeamHealthIndicator';
import DepartmentFilter from '../DepartmentFilter';

interface ManagerDashboardProps {
  userData: {
    name?: string;
    department?: string;
    employeeId?: string;
  };
}

const teamEngagementData = [
  { team: 'Development', engagement: 8.2, friction: 1.3 },
  { team: 'Design', engagement: 7.8, friction: 1.8 },
  { team: 'Marketing', engagement: 7.5, friction: 2.1 },
  { team: 'Sales', engagement: 8.0, friction: 1.6 },
];

const focusOutcomeData = [
  { name: 'Maintain', value: 45, color: '#4ade80' },
  { name: 'Improve', value: 35, color: '#fbbf24' },
  { name: 'Resolve', value: 20, color: '#f87171' },
];

const frictionTrendData = [
  { week: 'W1', alerts: 3 },
  { week: 'W2', alerts: 5 },
  { week: 'W3', alerts: 2 },
  { week: 'W4', alerts: 4 },
  { week: 'W5', alerts: 1 },
  { week: 'W6', alerts: 3 },
];

const chartConfig = {
  engagement: {
    label: "Engagement Score",
    color: "#E5989B",
  },
  friction: {
    label: "Friction Level",
    color: "#B5828C",
  },
  alerts: {
    label: "Friction Alerts",
    color: "#FFB4A2",
  },
};

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ userData }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [dateRange, setDateRange] = useState('last-30-days');

  return (
    <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-growpoint-primary p-3 rounded-full">
              <img src="/lovable-uploads/c3fcdded-87c5-4a78-b39e-2094a897384e.png" alt="GrowPoint" className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-growpoint-dark">Manager Dashboard</h1>
              <p className="text-growpoint-dark/70">{userData.department || 'Department'} • Team Insights</p>
            </div>
          </div>
          
          <DepartmentFilter 
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-growpoint-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-growpoint-dark">Team Members</CardTitle>
              <Users className="h-4 w-4 text-growpoint-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-growpoint-dark">24</div>
              <p className="text-xs text-growpoint-dark/60">Across 4 teams</p>
            </CardContent>
          </Card>

          <Card className="border-growpoint-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-growpoint-dark">Avg Engagement</CardTitle>
              <TrendingUp className="h-4 w-4 text-growpoint-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-growpoint-dark">7.9/10</div>
              <p className="text-xs text-green-600">+0.2 this month</p>
            </CardContent>
          </Card>

          <Card className="border-growpoint-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-growpoint-dark">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-growpoint-dark">3</div>
              <p className="text-xs text-yellow-600">2 teams need attention</p>
            </CardContent>
          </Card>

          <Card className="border-growpoint-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-growpoint-dark">Focus Actions</CardTitle>
              <Target className="h-4 w-4 text-growpoint-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-growpoint-dark">12</div>
              <p className="text-xs text-growpoint-dark/60">In progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Team Health Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <TeamHealthIndicator 
            frictionLevel={1.3}
            engagementScore={8.2}
            teamName="Development Team"
          />
          <TeamHealthIndicator 
            frictionLevel={2.1}
            engagementScore={7.5}
            teamName="Marketing Team"
          />
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Team Engagement Bar Chart */}
          <Card className="border-growpoint-accent/20">
            <CardHeader>
              <CardTitle className="text-growpoint-dark flex items-center gap-2">
                <Users className="w-5 h-5" />
                Engagement Score by Team
              </CardTitle>
              <CardDescription>Current team engagement levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamEngagementData}>
                    <XAxis dataKey="team" />
                    <YAxis domain={[0, 10]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="engagement" fill="var(--color-engagement)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Focus Outcome Pie Chart */}
          <Card className="border-growpoint-accent/20">
            <CardHeader>
              <CardTitle className="text-growpoint-dark flex items-center gap-2">
                <Target className="w-5 h-5" />
                Team Focus Outcomes
              </CardTitle>
              <CardDescription>Distribution of focus area selections</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={focusOutcomeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {focusOutcomeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Friction Alerts Trend */}
        <Card className="border-growpoint-accent/20">
          <CardHeader>
            <CardTitle className="text-growpoint-dark flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Friction Alerts Over Time
            </CardTitle>
            <CardDescription>Weekly friction alert trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={frictionTrendData}>
                  <XAxis dataKey="week" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="alerts" 
                    stroke="var(--color-alerts)" 
                    strokeWidth={3} 
                    dot={{ fill: "var(--color-alerts)" }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;
