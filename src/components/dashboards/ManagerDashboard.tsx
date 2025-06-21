import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { Users, TrendingUp, AlertTriangle, Target, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DepartmentFilter from '../DepartmentFilter';
import TeamHealthIndicator from '../TeamHealthIndicator';
import FrictionAlertModal from '../FrictionAlertModal';

interface ManagerDashboardProps {
  userData: {
    name?: string;
    department?: string;
    employeeId?: string;
  };
  onRestart?: () => void;
}

// Mock data for demonstration
const engagementData = [
  { team: 'Frontend', engagement: 8.2 },
  { team: 'Backend', engagement: 7.8 },
  { team: 'Design', engagement: 8.5 },
  { team: 'QA', engagement: 7.1 },
];

const focusData = [
  { name: 'Maintain', value: 40, fill: '#E5989B' },
  { name: 'Improve', value: 35, fill: '#FFB4A2' },
  { name: 'Resolve', value: 25, fill: '#B5828C' },
];

const teamMetrics = [
  { name: 'Team Alpha', engagement: 8.1, friction: 1.8 },
  { name: 'Team Beta', engagement: 6.9, friction: 3.2 },
  { name: 'Team Gamma', engagement: 7.5, friction: 2.1 },
];

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ userData, onRestart }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [showFrictionAlert, setShowFrictionAlert] = useState(false);
  const [alertTeam, setAlertTeam] = useState<{ name: string; friction: number } | null>(null);

  useEffect(() => {
    // Check for high friction teams on component mount
    const highFrictionTeam = teamMetrics.find(team => team.friction > 3.0);
    if (highFrictionTeam) {
      setAlertTeam({ name: highFrictionTeam.name, friction: highFrictionTeam.friction });
      setShowFrictionAlert(true);
    }
  }, []);

  const handleViewSuggestions = () => {
    setShowFrictionAlert(false);
    // Navigate to team suggestions (placeholder)
    console.log('Navigating to team suggestions...');
  };

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
            {teamMetrics.map((team, index) => (
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
                <div className="text-2xl font-bold text-growpoint-dark">12</div>
                <p className="text-xs text-green-600">+2 from last month</p>
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
                <div className="text-2xl font-bold text-growpoint-dark">7.8</div>
                <p className="text-xs text-green-600">+0.3 from last week</p>
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
                <div className="text-2xl font-bold text-yellow-600">3</div>
                <p className="text-xs text-yellow-600">Requires attention</p>
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
                <div className="text-2xl font-bold text-growpoint-dark">5</div>
                <p className="text-xs text-growpoint-dark/60">Active initiatives</p>
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
                    <BarChart data={engagementData}>
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
                        data={focusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {focusData.map((entry, index) => (
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
