
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Building2, Users, TrendingUp, AlertTriangle, Target, Award, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TeamHealthIndicator from '../TeamHealthIndicator';
import DepartmentFilter from '../DepartmentFilter';
import { useFeedbackData } from '@/hooks/useFeedbackData';

interface HRDashboardProps {
  userData: {
    name?: string;
    department?: string;
    employeeId?: string;
  };
  onRestart?: () => void;
}

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

const HRDashboard: React.FC<HRDashboardProps> = ({ userData, onRestart }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [dateRange, setDateRange] = useState('last-30-days');
  const { feedbackData, loading, error } = useFeedbackData();

  // Process the feedback data for dashboard metrics
  const processedData = React.useMemo(() => {
    if (!feedbackData.length) return { departments: [], totalEmployees: 0, avgEngagement: 0, highRiskTeams: 0 };

    let filteredData = feedbackData;
    
    // Apply department filter
    if (selectedDepartment !== 'all') {
      filteredData = feedbackData.filter(response => response.department === selectedDepartment);
    }

    const departmentStats = filteredData.reduce((acc, response) => {
      const dept = response.department;
      if (!acc[dept]) {
        acc[dept] = {
          department: dept,
          engagement: [],
          friction: [],
          employees: new Set(),
          count: 0
        };
      }
      
      acc[dept].engagement.push(response.engagement_score);
      acc[dept].friction.push(response.friction_level);
      if (response.employee_id) {
        acc[dept].employees.add(response.employee_id);
      }
      acc[dept].count++;
      
      return acc;
    }, {} as any);

    const departments = Object.values(departmentStats).map((dept: any) => ({
      department: dept.department,
      engagement: Number((dept.engagement.reduce((sum: number, val: number) => sum + val, 0) / dept.engagement.length).toFixed(1)),
      employees: dept.employees.size || dept.count,
      friction: Number((dept.friction.reduce((sum: number, val: number) => sum + val, 0) / dept.friction.length).toFixed(1))
    }));

    const totalEmployees = departments.reduce((sum, dept) => sum + dept.employees, 0);
    const avgEngagement = Number((departments.reduce((sum, dept) => sum + dept.engagement, 0) / departments.length).toFixed(1));
    const highRiskTeams = departments.filter(dept => dept.friction > 2.5).length;

    return { departments, totalEmployees, avgEngagement, highRiskTeams };
  }, [feedbackData, selectedDepartment]);

  // Create trend data (mock for now since we need historical data)
  const companyTrendData = [
    { month: 'Jan', engagement: processedData.avgEngagement - 0.8, retention: 94, satisfaction: 3.8 },
    { month: 'Feb', engagement: processedData.avgEngagement - 0.6, retention: 95, satisfaction: 3.9 },
    { month: 'Mar', engagement: processedData.avgEngagement - 0.4, retention: 93, satisfaction: 4.0 },
    { month: 'Apr', engagement: processedData.avgEngagement - 0.2, retention: 96, satisfaction: 4.1 },
    { month: 'May', engagement: processedData.avgEngagement - 0.1, retention: 94, satisfaction: 4.0 },
    { month: 'Jun', engagement: processedData.avgEngagement, retention: 97, satisfaction: 4.2 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-growpoint-primary mx-auto mb-4"></div>
          <p className="text-growpoint-dark">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Error loading dashboard data: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Back to Home button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-growpoint-primary/10 p-3 rounded-full">
              <img 
                src="/lovable-uploads/d7cd3b1a-3e3c-49c7-8986-3d60c7901948.png" 
                alt="GrowPoint" 
                className="w-8 h-8 object-contain" 
                style={{ background: 'transparent' }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-growpoint-dark">HR Dashboard</h1>
              <p className="text-growpoint-dark/70">Company-wide Analytics & Insights</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {onRestart && (
              <Button
                onClick={onRestart}
                className="text-white font-semibold px-6 py-2 rounded-lg"
                style={{ backgroundColor: '#FFB4A2' }}
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            )}
            <DepartmentFilter 
              selectedDepartment={selectedDepartment}
              onDepartmentChange={setSelectedDepartment}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </div>
        </div>

        {/* Helper text */}
        {onRestart && (
          <p className="text-sm text-growpoint-dark/60 text-center -mt-4 mb-4">
            Return to the start to explore again or give more feedback.
          </p>
        )}

        {/* Company Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="border-growpoint-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-growpoint-dark">Total Responses</CardTitle>
              <Users className="h-4 w-4 text-growpoint-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-growpoint-dark">{feedbackData.length}</div>
              <p className="text-xs text-green-600">Survey responses</p>
            </CardContent>
          </Card>

          <Card className="border-growpoint-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-growpoint-dark">Departments</CardTitle>
              <Building2 className="h-4 w-4 text-growpoint-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-growpoint-dark">{processedData.departments.length}</div>
              <p className="text-xs text-growpoint-dark/60">Active departments</p>
            </CardContent>
          </Card>

          <Card className="border-growpoint-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-growpoint-dark">Avg Engagement</CardTitle>
              <TrendingUp className="h-4 w-4 text-growpoint-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-growpoint-dark">{processedData.avgEngagement || 0}/10</div>
              <p className="text-xs text-green-600">Company average</p>
            </CardContent>
          </Card>

          <Card className="border-growpoint-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-growpoint-dark">At-Risk Teams</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-growpoint-dark">{processedData.highRiskTeams}</div>
              <p className="text-xs text-yellow-600">High friction levels</p>
            </CardContent>
          </Card>

          <Card className="border-growpoint-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-growpoint-dark">Focus Areas</CardTitle>
              <Target className="h-4 w-4 text-growpoint-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-growpoint-dark">
                {feedbackData.filter(r => r.team_goal === 'Resolve').length}
              </div>
              <p className="text-xs text-red-600">Need resolution</p>
            </CardContent>
          </Card>
        </div>

        {/* Department Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {processedData.departments.slice(0, 3).map((dept, index) => (
            <TeamHealthIndicator 
              key={index}
              frictionLevel={dept.friction}
              engagementScore={dept.engagement}
              teamName={dept.department}
            />
          ))}
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
                  <BarChart data={processedData.departments}>
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
                Response Distribution
              </CardTitle>
              <CardDescription>Survey responses across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processedData.departments}>
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
