
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';
import { Building2, Users, TrendingUp, AlertTriangle, Home, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TeamHealthIndicator from '../TeamHealthIndicator';
import DepartmentFilter from '../DepartmentFilter';
import { useFeedbackData } from '@/hooks/useFeedbackData';
import AIInsightsPanel from '@/components/AIInsightsPanel';
import VerbalFeedbackPanel from '@/components/VerbalFeedbackPanel';

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
  cohesion: {
    label: "Cohesion Score", 
    color: "#FFB4A2",
  },
  friction: {
    label: "Friction Level",
    color: "#B5828C",
  },
  employees: {
    label: "Employee Count",
    color: "#FFCDB2",
  },
  stdDev: {
    label: "Standard Deviation",
    color: "#E5989B",
  },
};

const HRDashboard: React.FC<HRDashboardProps> = ({ userData, onRestart }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [dateRange, setDateRange] = useState('last-30-days');
  const { feedbackData, loading, error } = useFeedbackData({ 
    selectedDepartment, 
    dateRange 
  });

  // Calculate standard deviation
  const calculateStandardDeviation = (values: number[]) => {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.sqrt(avgSquaredDiff);
  };

  // Process the feedback data for dashboard metrics
  const processedData = React.useMemo(() => {
    if (!feedbackData.length) return { 
      departments: [], 
      totalEmployees: 0, 
      avgEngagement: 0, 
      highRiskTeams: 0,
      engagementTrend: [],
      bubbleData: [],
      cohesionFrictionData: [],
      engagementVariabilityData: []
    };

    const departmentStats = feedbackData.reduce((acc, response) => {
      const dept = response.department;
      if (!acc[dept]) {
        acc[dept] = {
          department: dept,
          engagement: [],
          cohesion: [],
          friction: [],
          employees: new Set(),
          count: 0,
          responses: []
        };
      }
      
      acc[dept].engagement.push(response.engagement_score);
      acc[dept].cohesion.push(response.cohesion_score);
      acc[dept].friction.push(response.friction_level);
      acc[dept].responses.push(response);
      if (response.employee_id) {
        acc[dept].employees.add(response.employee_id);
      }
      acc[dept].count++;
      
      return acc;
    }, {} as any);

    const departments = Object.values(departmentStats).map((dept: any) => ({
      department: dept.department,
      engagement: Number((dept.engagement.reduce((sum: number, val: number) => sum + val, 0) / dept.engagement.length).toFixed(1)),
      cohesion: Number((dept.cohesion.reduce((sum: number, val: number) => sum + val, 0) / dept.cohesion.length).toFixed(1)),
      employees: dept.employees.size || dept.count,
      friction: Number((dept.friction.reduce((sum: number, val: number) => sum + val, 0) / dept.friction.length).toFixed(1)),
      responseCount: dept.count,
      engagementScores: dept.engagement
    }));

    // Calculate engagement trend over time (weekly)
    const weeklyEngagement: { [key: string]: { total: number; count: number; week: string } } = {};
    
    feedbackData.forEach(response => {
      const date = new Date(response.response_date);
      const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      const weekLabel = `Week ${Math.ceil(date.getDate() / 7)}`;
      
      if (!weeklyEngagement[weekKey]) {
        weeklyEngagement[weekKey] = { total: 0, count: 0, week: weekLabel };
      }
      
      weeklyEngagement[weekKey].total += response.engagement_score || 0;
      weeklyEngagement[weekKey].count += 1;
    });

    const engagementTrend = Object.values(weeklyEngagement)
      .map(data => ({
        week: data.week,
        engagement: Number((data.total / data.count).toFixed(1))
      }))
      .sort((a, b) => a.week.localeCompare(b.week));

    // Prepare bubble chart data (Friction vs Engagement by Department)
    const bubbleData = departments.map(dept => ({
      department: dept.department,
      friction: dept.friction,
      engagement: dept.engagement,
      responseCount: dept.responseCount,
      // Color coding based on quadrants
      color: dept.friction <= 2.5 && dept.engagement >= 3.5 ? '#10B981' : // Green: Low friction, high engagement
             dept.friction >= 3.5 || dept.engagement <= 2.5 ? '#EF4444' : // Red: High friction or low engagement  
             '#F59E0B' // Yellow: Medium
    }));

    // Prepare cohesion vs friction data
    const cohesionFrictionData = departments.map(dept => ({
      department: dept.department,
      cohesion: dept.cohesion,
      friction: dept.friction
    }));

    // Calculate engagement score variability (standard deviation by department)
    const engagementVariabilityData = departments.map(dept => ({
      department: dept.department,
      stdDev: Number(calculateStandardDeviation(dept.engagementScores).toFixed(2))
    }));

    const totalEmployees = departments.reduce((sum, dept) => sum + dept.employees, 0);
    const avgEngagement = Number((departments.reduce((sum, dept) => sum + dept.engagement, 0) / departments.length).toFixed(1));
    const highRiskTeams = departments.filter(dept => dept.friction > 2.5).length;

    return { 
      departments, 
      totalEmployees, 
      avgEngagement, 
      highRiskTeams,
      engagementTrend,
      bubbleData,
      cohesionFrictionData,
      engagementVariabilityData
    };
  }, [feedbackData]);

  // Calculate department-specific engagement score with proper status logic (1-5 scale)
  const departmentEngagementStats = React.useMemo(() => {
    const filteredData = selectedDepartment === 'all' ? feedbackData : 
      feedbackData.filter(response => response.department === selectedDepartment);
    
    if (filteredData.length === 0) return { average: 0, status: 'No Data', color: 'text-gray-500' };
    
    const totalEngagement = filteredData.reduce((sum, response) => sum + (response.engagement_score || 0), 0);
    const average = totalEngagement / filteredData.length;
    
    let status = 'Excellent';
    let color = 'text-green-600';
    
    if (average >= 4.0) {
      status = 'Excellent';
      color = 'text-green-600';
    } else if (average >= 2.5) {
      status = 'At Risk';
      color = 'text-yellow-600';
    } else {
      status = 'Needs Attention';
      color = 'text-red-600';
    }
    
    return { average: Number(average.toFixed(1)), status, color };
  }, [feedbackData, selectedDepartment]);

  // Create trend data (mock for now since we need historical data)
  const companyTrendData = [
    { month: 'Jan', engagement: Math.max(1, processedData.avgEngagement - 0.8), retention: 94, satisfaction: 3.8 },
    { month: 'Feb', engagement: Math.max(1, processedData.avgEngagement - 0.6), retention: 95, satisfaction: 3.9 },
    { month: 'Mar', engagement: Math.max(1, processedData.avgEngagement - 0.4), retention: 93, satisfaction: 4.0 },
    { month: 'Apr', engagement: Math.max(1, processedData.avgEngagement - 0.2), retention: 96, satisfaction: 4.1 },
    { month: 'May', engagement: Math.max(1, processedData.avgEngagement - 0.1), retention: 94, satisfaction: 4.0 },
    { month: 'Jun', engagement: Math.min(5, processedData.avgEngagement), retention: 97, satisfaction: 4.2 },
  ];

  // Process data for AI insights with verbal comments
  const aiInsightsData = React.useMemo(() => {
    const filteredData = selectedDepartment === 'all' ? feedbackData : 
      feedbackData.filter(response => response.department === selectedDepartment);
    
    if (filteredData.length === 0) {
      return {
        avgEngagement: 0,
        avgCohesion: 0,
        avgFriction: 0,
        teamGoalDistribution: {},
        departmentName: selectedDepartment === 'all' ? 'the organization' : selectedDepartment,
        verbalComments: []
      };
    }

    const avgEngagement = filteredData.reduce((sum, r) => sum + (r.engagement_score || 0), 0) / filteredData.length;
    const avgCohesion = filteredData.reduce((sum, r) => sum + (r.cohesion_score || 0), 0) / filteredData.length;
    const avgFriction = filteredData.reduce((sum, r) => sum + (r.friction_level || 0), 0) / filteredData.length;
    
    const goalDistribution = filteredData.reduce((acc, r) => {
      if (r.team_goal) {
        acc[r.team_goal] = (acc[r.team_goal] || 0) + 1;
      }
      return acc;
    }, {} as { [key: string]: number });

    const verbalComments: string[] = [];
    filteredData.forEach(response => {
      [
        response.verbal_q1_comment,
        response.verbal_q2_comment,
        response.verbal_q3_comment,
        response.verbal_q4_comment,
        response.verbal_q5_comment,
        response.verbal_q6_comment,
        response.verbal_q7_comment
      ].forEach(comment => {
        if (comment && comment.trim()) {
          verbalComments.push(comment.trim());
        }
      });
    });

    return {
      avgEngagement,
      avgCohesion,
      avgFriction,
      teamGoalDistribution: goalDistribution,
      departmentName: selectedDepartment === 'all' ? 'the organization' : selectedDepartment,
      verbalComments
    };
  }, [feedbackData, selectedDepartment]);

  // Filter feedback data for verbal feedback panel
  const verbalFeedbackData = React.useMemo(() => {
    return selectedDepartment === 'all' ? feedbackData : 
      feedbackData.filter(response => response.department === selectedDepartment);
  }, [feedbackData, selectedDepartment]);

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
            <img 
              src="/lovable-uploads/d7cd3b1a-3e3c-49c7-8986-3d60c7901948.png" 
              alt="GrowPoint" 
              className="w-10 h-10 object-contain"
              style={{ background: 'transparent' }}
            />
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

        {/* Company Overview Metrics - Fixed Engagement Score */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <CardTitle className="text-sm font-medium text-growpoint-dark">Engagement Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-growpoint-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-growpoint-dark">{departmentEngagementStats.average}/5</div>
              <p className={`text-xs font-medium ${departmentEngagementStats.color}`}>{departmentEngagementStats.status}</p>
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
              <CardDescription>Current engagement levels across all departments (1-5 scale)</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processedData.departments}>
                    <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
                    <YAxis domain={[0, 5]} />
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

        {/* New Charts Section 1: Engagement Trend and Bubble Chart */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Average Engagement Over Time */}
          <Card className="border-growpoint-accent/20">
            <CardHeader>
              <CardTitle className="text-growpoint-dark flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Avg. Engagement Over Time
              </CardTitle>
              <CardDescription>Weekly average engagement scores for the company</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={processedData.engagementTrend}>
                    <XAxis dataKey="week" />
                    <YAxis domain={[1, 5]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="engagement" 
                      stroke="var(--color-engagement)" 
                      strokeWidth={3} 
                      dot={{ fill: "var(--color-engagement)", r: 4 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Friction vs Engagement - Department Snapshot (Bubble Chart) */}
          <Card className="border-growpoint-accent/20">
            <CardHeader>
              <CardTitle className="text-growpoint-dark flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Friction vs Engagement – Department Snapshot
              </CardTitle>
              <CardDescription>Department health quadrants (bubble size = response count)</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={processedData.bubbleData}>
                    <XAxis 
                      type="number" 
                      dataKey="friction" 
                      name="Friction Level" 
                      domain={[0, 5]}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="engagement" 
                      name="Engagement Score" 
                      domain={[1, 5]}
                      axisLine={false}
                      tickLine={false}
                    />
                    <ZAxis type="number" dataKey="responseCount" range={[50, 400]} />
                    <ChartTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 border rounded shadow">
                              <p className="font-medium">{data.department}</p>
                              <p className="text-sm">Engagement: {data.engagement}/5</p>
                              <p className="text-sm">Friction: {data.friction}/5</p>
                              <p className="text-sm">Responses: {data.responseCount}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter 
                      dataKey="responseCount"
                      fill={(entry: any) => entry.color}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* New Charts Section 2: Cohesion vs Friction and Engagement Variability */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Cohesion vs Friction per Department */}
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
                  <BarChart data={processedData.cohesionFrictionData}>
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

          {/* Engagement Score Variability */}
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
                  <BarChart data={processedData.engagementVariabilityData}>
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

        {/* Company Trends - Fixed Y axis for engagement to 0-5 */}
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
                  <YAxis yAxisId="engagement" orientation="left" domain={[0, 5]} />
                  <YAxis yAxisId="other" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    yAxisId="engagement"
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="var(--color-engagement)" 
                    strokeWidth={3} 
                    dot={{ fill: "var(--color-engagement)" }} 
                  />
                  <Line 
                    yAxisId="other"
                    type="monotone" 
                    dataKey="retention" 
                    stroke="var(--color-retention)" 
                    strokeWidth={3} 
                    dot={{ fill: "var(--color-retention)" }} 
                  />
                  <Line 
                    yAxisId="other"
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

        {/* AI Insights Panel */}
        <AIInsightsPanel 
          data={aiInsightsData}
          isHR={true}
        />

        <VerbalFeedbackPanel 
          feedbackData={verbalFeedbackData}
          departmentName={selectedDepartment === 'all' ? undefined : selectedDepartment}
        />
      </div>
    </div>
  );
};

export default HRDashboard;
