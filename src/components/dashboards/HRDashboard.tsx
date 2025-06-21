
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Building2, Users, TrendingUp, AlertTriangle, Target, Award } from 'lucide-react';
import TeamHealthIndicator from '../TeamHealthIndicator';
import DepartmentFilter from '../DepartmentFilter';

interface HRDashboardProps {
  userData: {
    name?: string;
    department?: string;
    employeeId?: string;
  };
}

const companyMetrics = [
  { department: 'Engineering', engagement: 8.1, employees: 45, friction: 1.4 },
  { department: 'Sales', engagement: 7.8, employees: 32, friction: 1.8 },
  { department: 'Marketing', engagement: 7.5, employees: 28, friction: 2.0 },
  { department: 'Support', engagement: 8.3, employees: 22, friction: 1.2 },
  { department: 'Operations', engagement: 7.9, employees: 18, friction: 1.6 },
];

const companyTrendData = [
  { month: 'Jan', engagement: 7.2, retention: 94, satisfaction: 3.8 },
  { month: 'Feb', engagement: 7.4, retention: 95, satisfaction: 3.9 },
  { month: 'Mar', engagement: 7.6, retention: 93, satisfaction: 4.0 },
  { month: 'Apr', engagement: 7.8, retention: 96, satisfaction: 4.1 },
  { month: 'May', engagement: 7.9, retention: 94, satisfaction: 4.0 },
  { month: 'Jun', engagement: 8.0, retention: 97, satisfaction: 4.2 },
];

const chartConfig = {
  engagement: {
    label: "Engagement Score",
    color: "#E5989B",
  },
  retention: {
    label: "Retention Rate",
    color: "#FFB4A2",
  },
  satisfaction: {
    label: "Job Satisfaction",
    color: "#B5828C",
  },
  employees: {
    label: "Employee Count",
    color: "#FFCDB2",
  },
};

const HRDashboard: React.FC<HRDashboardProps> = ({ userData }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [dateRange, setDateRange] = useState('last-30-days');

  const totalEmployees = companyMetrics.reduce((sum, dept) => sum + dept.employees, 0);
  const avgEngagement = companyMetrics.reduce((sum, dept) => sum + dept.engagement, 0) / companyMetrics.length;
  const highRiskTeams = companyMetrics.filter(dept => dept.friction > 1.8).length;

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
              <h1 className="text-3xl font-bold text-growpoint-dark">HR Dashboard</h1>
              <p className="text-growpoint-dark/70">Company-wide Analytics & Insights</p>
            </div>
          </div>
          
          <DepartmentFilter 
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>

        {/* Company Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="border-growpoint-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-growpoint-dark">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-growpoint-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-growpoint-dark">{totalEmployees}</div>
              <p className="text-xs text-green-600">+12 this quarter</p>
            </CardContent>
          </Card>

          <Card className="border-growpoint-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-growpoint-dark">Departments</CardTitle>
              <Building2 className="h-4 w-4 text-growpoint-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-growpoint-dark">{companyMetrics.length}</div>
              <p className="text-xs text-growpoint-dark/60">Active departments</p>
            </CardContent>
          </Card>

          <Card className="border-growpoint-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-growpoint-dark">Avg Engagement</CardTitle>
              <TrendingUp className="h-4 w-4 text-growpoint-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-growpoint-dark">{avgEngagement.toFixed(1)}/10</div>
              <p className="text-xs text-green-600">+0.3 this month</p>
            </CardContent>
          </Card>

          <Card className="border-growpoint-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-growpoint-dark">At-Risk Teams</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-growpoint-dark">{highRiskTeams}</div>
              <p className="text-xs text-yellow-600">Need attention</p>
            </CardContent>
          </Card>

          <Card className="border-growpoint-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-growpoint-dark">Retention Rate</CardTitle>
              <Award className="h-4 w-4 text-growpoint-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-growpoint-dark">97%</div>
              <p className="text-xs text-green-600">+3% this quarter</p>
            </CardContent>
          </Card>
        </div>

        {/* Department Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <TeamHealthIndicator 
            frictionLevel={1.2}
            engagementScore={8.3}
            teamName="Support"
          />
          <TeamHealthIndicator 
            frictionLevel={1.4}
            engagementScore={8.1}
            teamName="Engineering"
          />
          <TeamHealthIndicator 
            frictionLevel={2.0}
            engagementScore={7.5}
            teamName="Marketing"
          />
        </div>

        {/* Analytics Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Department Engagement Overview */}
          <Card className="border-growpoint-accent/20">
            <CardHeader>
              <CardTitle className="text-growpoint-dark flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Engagement by Department
              </CardTitle>
              <CardDescription>Current engagement levels across all departments</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={companyMetrics}>
                    <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
                    <YAxis domain={[0, 10]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="engagement" fill="var(--color-engagement)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Employee Distribution */}
          <Card className="border-growpoint-accent/20">
            <CardHeader>
              <CardTitle className="text-growpoint-dark flex items-center gap-2">
                <Users className="w-5 h-5" />
                Employee Distribution
              </CardTitle>
              <CardDescription>Headcount across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={companyMetrics}>
                    <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="employees" fill="var(--color-employees)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Company Trends */}
        <Card className="border-growpoint-accent/20">
          <CardHeader>
            <CardTitle className="text-growpoint-dark flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Company Performance Trends
            </CardTitle>
            <CardDescription>6-month overview of key HR metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={companyTrendData}>
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
                    dataKey="retention" 
                    stroke="var(--color-retention)" 
                    strokeWidth={3} 
                    dot={{ fill: "var(--color-retention)" }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="satisfaction" 
                    stroke="var(--color-satisfaction)" 
                    strokeWidth={3} 
                    dot={{ fill: "var(--color-satisfaction)" }} 
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

export default HRDashboard;
