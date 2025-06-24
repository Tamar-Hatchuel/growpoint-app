
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, TrendingUp, AlertTriangle, BarChart3, Home } from 'lucide-react';
import { useFeedbackData } from '@/hooks/useFeedbackData';
import DepartmentFilter from '../DepartmentFilter';
import TeamHealthIndicator from '../TeamHealthIndicator';

interface HRDashboardProps {
  userData?: {
    name?: string;
    department?: string;
    userDepartment?: string;
  };
  onRestart?: () => void;
}

const chartConfig = {
  engagement: {
    label: "Engagement Score",
    color: "#E5989B",
  },
  cohesion: {
    label: "Team Cohesion",
    color: "#FFB4A2",
  },
  friction: {
    label: "Friction Level",
    color: "#FFCDB2",
  }
};

const HRDashboard: React.FC<HRDashboardProps> = ({ userData, onRestart }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const { 
    metrics, 
    departmentMetrics, 
    trendData, 
    isLoading, 
    error,
    refetch 
  } = useFeedbackData(selectedDepartment === 'all' ? undefined : selectedDepartment);

  // Refetch data when department filter changes
  useEffect(() => {
    refetch();
  }, [selectedDepartment, refetch]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 flex items-center justify-center p-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Dashboard</h3>
            <p className="text-red-600 mb-4">Unable to fetch dashboard data. Please try again.</p>
            <Button onClick={() => refetch()} variant="outline" className="border-red-300 text-red-700">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-growpoint-primary p-3 rounded-full">
              <img 
                src="/lovable-uploads/d7cd3b1a-3e3c-49c7-8986-3d60c7901948.png" 
                alt="GrowPoint" 
                className="w-8 h-8 object-contain" 
                style={{ background: 'transparent' }}
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-growpoint-dark">
                HR Analytics Dashboard
              </h1>
              <p className="text-growpoint-dark/70">
                Organization-wide insights • {userData?.userDepartment || 'All Departments'}
              </p>
            </div>
          </div>
          
          {onRestart && (
            <Button
              onClick={onRestart}
              variant="outline"
              className="border-growpoint-accent/30 text-growpoint-dark hover:bg-growpoint-soft min-h-[44px]"
            >
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          )}
        </div>

        {/* Department Filter */}
        <DepartmentFilter
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-growpoint-primary mx-auto mb-4"></div>
              <p className="text-growpoint-dark/70">Loading dashboard data...</p>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        {!isLoading && metrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            <Card className="border-growpoint-accent/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-growpoint-dark">Average Engagement</CardTitle>
                <TrendingUp className="h-4 w-4 text-growpoint-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-growpoint-dark">
                  {metrics.avgEngagement?.toFixed(1) || 'N/A'}/10
                </div>
                <p className="text-xs text-growpoint-dark/60">
                  Across {selectedDepartment === 'all' ? 'all departments' : selectedDepartment}
                </p>
              </CardContent>
            </Card>

            <Card className="border-growpoint-accent/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-growpoint-dark">Team Cohesion</CardTitle>
                <Users className="h-4 w-4 text-growpoint-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-growpoint-dark">
                  {metrics.avgCohesion?.toFixed(1) || 'N/A'}/5
                </div>
                <p className="text-xs text-growpoint-dark/60">
                  Team collaboration score
                </p>
              </CardContent>
            </Card>

            <Card className="border-growpoint-accent/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-growpoint-dark">Friction Level</CardTitle>
                <AlertTriangle className="h-4 w-4 text-growpoint-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-growpoint-dark">
                  {metrics.avgFriction?.toFixed(1) || 'N/A'}/5
                </div>
                <p className="text-xs text-growpoint-dark/60">
                  Lower is better
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Team Health Indicator */}
        {!isLoading && metrics && (
          <TeamHealthIndicator 
            frictionLevel={metrics.avgFriction || 0}
            engagementScore={metrics.avgEngagement || 0}
            teamName={selectedDepartment === 'all' ? 'Organization' : selectedDepartment}
          />
        )}

        {/* Charts */}
        {!isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Breakdown */}
            {departmentMetrics && departmentMetrics.length > 0 && (
              <Card className="border-growpoint-accent/20">
                <CardHeader>
                  <CardTitle className="text-growpoint-dark flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Department Breakdown
                  </CardTitle>
                  <CardDescription>Engagement scores by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={departmentMetrics} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <XAxis 
                          dataKey="department" 
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar 
                          dataKey="avgEngagement" 
                          fill="var(--color-engagement)" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            )}

            {/* Trend Analysis */}
            {trendData && trendData.length > 0 && (
              <Card className="border-growpoint-accent/20">
                <CardHeader>
                  <CardTitle className="text-growpoint-dark flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Engagement Trends
                  </CardTitle>
                  <CardDescription>Monthly engagement trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <XAxis 
                          dataKey="month" 
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="engagement" 
                          stroke="var(--color-engagement)" 
                          strokeWidth={3} 
                          dot={{ fill: "var(--color-engagement)", strokeWidth: 2, r: 4 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* No Data State */}
        {!isLoading && (!metrics || (!departmentMetrics?.length && !trendData?.length)) && (
          <Card className="border-growpoint-accent/20">
            <CardContent className="p-12 text-center">
              <BarChart3 className="w-16 h-16 text-growpoint-accent/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-growpoint-dark mb-2">No Data Available</h3>
              <p className="text-growpoint-dark/70 mb-4">
                {selectedDepartment === 'all' 
                  ? 'No survey responses have been submitted yet.' 
                  : `No survey responses found for ${selectedDepartment}.`
                }
              </p>
              <Button 
                onClick={() => refetch()} 
                variant="outline" 
                className="border-growpoint-accent/30 text-growpoint-dark hover:bg-growpoint-soft"
              >
                Refresh Data
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HRDashboard;
