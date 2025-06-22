
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { Users, TrendingUp, AlertTriangle, Target, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DepartmentFilter from '../DepartmentFilter';
import TeamHealthIndicator from '../TeamHealthIndicator';
import FrictionAlertModal from '../FrictionAlertModal';
import { useFeedbackData } from '@/hooks/useFeedbackData';

interface ManagerDashboardProps {
  userData: {
    name?: string;
    department?: string;
    employeeId?: string;
  };
  onRestart?: () => void;
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ userData, onRestart }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [showFrictionAlert, setShowFrictionAlert] = useState(false);
  const [alertTeam, setAlertTeam] = useState<{ name: string; friction: number } | null>(null);
  const { feedbackData, loading, error } = useFeedbackData();

  // Process the feedback data for manager dashboard
  const processedData = React.useMemo(() => {
    if (!feedbackData.length) return { teamMetrics: [], engagementData: [], focusData: [] };

    // Group by department to create team metrics
    const departmentStats = feedbackData.reduce((acc, response) => {
      const dept = response.department;
      if (!acc[dept]) {
        acc[dept] = {
          name: dept,
          engagement: [],
          friction: []
        };
      }
      
      acc[dept].engagement.push(response.engagement_score);
      acc[dept].friction.push(response.friction_level);
      
      return acc;
    }, {} as any);

    const teamMetrics = Object.values(departmentStats).map((team: any) => ({
      name: team.name,
      engagement: Number((team.engagement.reduce((sum: number, val: number) => sum + val, 0) / team.engagement.length).toFixed(1)),
      friction: Number((team.friction.reduce((sum: number, val: number) => sum + val, 0) / team.friction.length).toFixed(1))
    }));

    const engagementData = teamMetrics.slice(0, 4).map(team => ({
      team: team.name,
      engagement: team.engagement
    }));

    // Calculate focus distribution
    const focusDistribution = feedbackData.reduce((acc, response) => {
      acc[response.team_goal] = (acc[response.team_goal] || 0) + 1;
      return acc;
    }, {} as any);

    const total = feedbackData.length;
    const focusData = [
      { 
        name: 'Maintain', 
        value: Math.round((focusDistribution['Maintain'] || 0) / total * 100), 
        fill: '#E5989B' 
      },
      { 
        name: 'Improve', 
        value: Math.round((focusDistribution['Improve'] || 0) / total * 100), 
        fill: '#FFB4A2' 
      },
      { 
        name: 'Resolve', 
        value: Math.round((focusDistribution['Resolve'] || 0) / total * 100), 
        fill: '#B5828C' 
      },
    ];

    return { teamMetrics, engagementData, focusData };
  }, [feedbackData]);

  useEffect(() => {
    // Check for high friction teams on component mount
    const highFrictionTeam = processedData.teamMetrics.find(team => team.friction > 3.0);
    if (highFrictionTeam && !showFrictionAlert) {
      setAlertTeam({ name: highFrictionTeam.name, friction: highFrictionTeam.friction });
      setShowFrictionAlert(true);
    }
  }, [processedData.teamMetrics, showFrictionAlert]);

  const handleViewSuggestions = () => {
    setShowFrictionAlert(false);
    console.log('Navigating to team suggestions...');
  };

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
    <>
      <FrictionAlertModal
        open={showFrictionAlert}
        onClose={() => setShowFrictionAlert(false)}
        onViewSuggestions={handleViewSuggestions}
        teamName={alertTeam?.name || ''}
        frictionScore={alertTeam?.friction || 0}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center relative">
            {onRestart && (
              <Button
                onClick={onRestart}
                variant="outline"
                className="absolute left-0 top-0 border-growpoint-accent/20 hover:bg-growpoint-soft"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Start
              </Button>
            )}
            <h1 className="text-4xl font-bold text-growpoint-dark mb-2">
              Manager Dashboard
            </h1>
            <p className="text-xl text-growpoint-dark/70">
              Welcome back, {userData.name || 'Manager'}! Here's your team overview.
            </p>
          </div>

          {/* Filters */}
          <DepartmentFilter
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />

          {/* Team Health Overview */}
          <div className="grid md:grid-cols-3 gap-6">
            {processedData.teamMetrics.slice(0, 3).map((team, index) => (
              <TeamHealthIndicator
                key={index}
                teamName={team.name}
                engagementScore={team.engagement}
                frictionLevel={team.friction}
              />
            ))}
          </div>

          {/* KPI Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="border-growpoint-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-growpoint-dark/70 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Total Teams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-growpoint-dark">{processedData.teamMetrics.length}</div>
                <p className="text-xs text-green-600">Active departments</p>
              </CardContent>
            </Card>

            <Card className="border-growpoint-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-growpoint-dark/70 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Avg Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-growpoint-dark">
                  {processedData.teamMetrics.length > 0 
                    ? (processedData.teamMetrics.reduce((sum, team) => sum + team.engagement, 0) / processedData.teamMetrics.length).toFixed(1)
                    : '0.0'
                  }
                </div>
                <p className="text-xs text-green-600">Overall average</p>
              </CardContent>
            </Card>

            <Card className="border-growpoint-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-growpoint-dark/70 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Teams at Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {processedData.teamMetrics.filter(team => team.friction > 2.5).length}
                </div>
                <p className="text-xs text-yellow-600">High friction levels</p>
              </CardContent>
            </Card>

            <Card className="border-growpoint-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-growpoint-dark/70 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Focus Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-growpoint-dark">
                  {feedbackData.filter(r => r.team_goal === 'Resolve').length}
                </div>
                <p className="text-xs text-growpoint-dark/60">Need resolution</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Team Engagement Chart */}
            <Card className="border-growpoint-accent/20">
              <CardHeader>
                <CardTitle className="text-growpoint-dark">Team Engagement Scores</CardTitle>
                <CardDescription>Current engagement levels by team</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{
                  engagement: { label: "Engagement", color: "#E5989B" }
                }} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={processedData.engagementData}>
                      <XAxis dataKey="team" />
                      <YAxis domain={[0, 10]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="engagement" fill="var(--color-engagement)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Focus Distribution Chart */}
            <Card className="border-growpoint-accent/20">
              <CardHeader>
                <CardTitle className="text-growpoint-dark">Team Focus Distribution</CardTitle>
                <CardDescription>Where teams are focusing their efforts</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{
                  maintain: { label: "Maintain", color: "#E5989B" },
                  improve: { label: "Improve", color: "#FFB4A2" },
                  resolve: { label: "Resolve", color: "#B5828C" }
                }} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={processedData.focusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {processedData.focusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagerDashboard;
