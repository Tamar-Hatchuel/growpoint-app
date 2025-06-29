import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Building2, TrendingUp, AlertTriangle, Home, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFeedbackData } from '@/hooks/useFeedbackData';
import { supabase } from '@/integrations/supabase/client';
import AIInsightsPanel from '@/components/AIInsightsPanel';
import VerbalFeedbackPanel from '@/components/VerbalFeedbackPanel';

interface AdminDashboardProps {
  userData: {
    name?: string;
    department?: string;
    employeeId?: string;
    userDepartment?: string;
  };
  onRestart?: () => void;
}

const chartConfig = {
  engagement: {
    label: "Engagement Score",
    color: "#E5989B",
  },
  maintain: {
    label: "Maintain",
    color: "#10B981",
  },
  improve: {
    label: "Improve", 
    color: "#F59E0B",
  },
  resolve: {
    label: "Resolve",
    color: "#EF4444",
  },
  responded: {
    label: "Responded",
    color: "#10B981",
  },
  notResponded: {
    label: "Not Responded",
    color: "#6B7280",
  },
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ userData, onRestart }) => {
  const { feedbackData, loading, error } = useFeedbackData();
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const userDepartment = userData.userDepartment || userData.department || 'Unknown';

  // Fetch total employees count for the department
  React.useEffect(() => {
    const fetchTotalEmployees = async () => {
      try {
        const { count, error } = await supabase
          .from('employees')
          .select('*', { count: 'exact', head: true })
          .eq('Department', userDepartment);
        
        if (error) {
          console.error('Error fetching total employees:', error);
        } else {
          setTotalEmployees(count || 0);
        }
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    };

    if (userDepartment && userDepartment !== 'Unknown') {
      fetchTotalEmployees();
    }
  }, [userDepartment]);

  // Filter data for this admin's department
  const departmentData = useMemo(() => {
    return feedbackData.filter(response => response.department === userDepartment);
  }, [feedbackData, userDepartment]);

  // Calculate average engagement score for the department
  const avgEngagementScore = useMemo(() => {
    if (departmentData.length === 0) return 0;
    const total = departmentData.reduce((sum, response) => sum + (response.engagement_score || 0), 0);
    return Number((total / departmentData.length).toFixed(1));
  }, [departmentData]);

  // Calculate survey participation data
  const participationData = useMemo(() => {
    const uniqueRespondents = new Set(
      departmentData
        .filter(response => response.employee_id)
        .map(response => response.employee_id)
    ).size;
    
    const notResponded = Math.max(0, totalEmployees - uniqueRespondents);
    
    return [
      {
        name: 'Responded',
        value: uniqueRespondents,
        color: chartConfig.responded.color,
        percentage: totalEmployees > 0 ? Math.round((uniqueRespondents / totalEmployees) * 100) : 0
      },
      {
        name: 'Not Responded', 
        value: notResponded,
        color: chartConfig.notResponded.color,
        percentage: totalEmployees > 0 ? Math.round((notResponded / totalEmployees) * 100) : 0
      }
    ];
  }, [departmentData, totalEmployees]);

  // Process engagement data over time (grouped by week)
  const engagementOverTime = useMemo(() => {
    const weeklyData: { [key: string]: { total: number; count: number; week: string } } = {};
    
    departmentData.forEach(response => {
      const date = new Date(response.response_date);
      const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      const weekLabel = `Week ${Math.ceil(date.getDate() / 7)}`;
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { total: 0, count: 0, week: weekLabel };
      }
      
      weeklyData[weekKey].total += response.engagement_score || 0;
      weeklyData[weekKey].count += 1;
    });

    return Object.values(weeklyData)
      .map(data => ({
        week: data.week,
        engagement: Number((data.total / data.count).toFixed(1))
      }))
      .sort((a, b) => a.week.localeCompare(b.week));
  }, [departmentData]);

  // Process team goal distribution
  const teamGoalDistribution = useMemo(() => {
    const distribution = { Maintain: 0, Improve: 0, Resolve: 0 };
    
    departmentData.forEach(response => {
      if (response.team_goal && distribution.hasOwnProperty(response.team_goal)) {
        distribution[response.team_goal as keyof typeof distribution]++;
      }
    });

    return Object.entries(distribution).map(([goal, count]) => ({
      name: goal,
      value: count,
      color: chartConfig[goal.toLowerCase() as keyof typeof chartConfig]?.color || '#8884d8'
    }));
  }, [departmentData]);

  // Calculate friction level
  const frictionStats = useMemo(() => {
    if (departmentData.length === 0) return { average: 0, status: 'Healthy', color: 'text-green-600' };
    
    const totalFriction = departmentData.reduce((sum, response) => sum + (response.friction_level || 0), 0);
    const average = totalFriction / departmentData.length;
    
    let status = 'Healthy';
    let color = 'text-green-600';
    
    if (average >= 3.6) {
      status = 'Needs Attention';
      color = 'text-red-600';
    } else if (average >= 2.1) {
      status = 'At Risk';
      color = 'text-yellow-600';
    }
    
    return { average: Number(average.toFixed(1)), status, color };
  }, [departmentData]);

  // Process data for AI insights
  const aiInsightsData = React.useMemo(() => {
    if (departmentData.length === 0) {
      return {
        avgEngagement: 0,
        avgCohesion: 0,
        avgFriction: 0,
        teamGoalDistribution: {},
        departmentName: userDepartment,
        verbalComments: []
      };
    }

    const avgEngagement = departmentData.reduce((sum, r) => sum + (r.engagement_score || 0), 0) / departmentData.length;
    const avgCohesion = departmentData.reduce((sum, r) => sum + (r.cohesion_score || 0), 0) / departmentData.length;
    const avgFriction = departmentData.reduce((sum, r) => sum + (r.friction_level || 0), 0) / departmentData.length;
    
    const goalDistribution = departmentData.reduce((acc, r) => {
      if (r.team_goal) {
        acc[r.team_goal] = (acc[r.team_goal] || 0) + 1;
      }
      return acc;
    }, {} as { [key: string]: number });

    // Collect verbal comments for AI analysis
    const verbalComments: string[] = [];
    departmentData.forEach(response => {
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
      departmentName: userDepartment,
      verbalComments
    };
  }, [departmentData, userDepartment]);

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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3">
              <img 
                src="/lovable-uploads/d7cd3b1a-3e3c-49c7-8986-3d60c7901948.png" 
                alt="GrowPoint" 
                className="w-8 h-8 object-contain"
                style={{ background: 'transparent' }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-growpoint-dark">
                Team Summary – {userDepartment} Department
              </h1>
              <p className="text-growpoint-dark/70">{departmentData.length} responses • Department Analytics</p>
            </div>
          </div>
          
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
        </div>

        {/* KPI Summary Cards - Updated with Avg Engagement */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-growpoint-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-growpoint-dark">Total Responses</CardTitle>
              <Calendar className="h-4 w-4 text-growpoint-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-growpoint-dark">{departmentData.length}</div>
              <p className="text-xs text-growpoint-dark/60">Department feedback</p>
            </CardContent>
          </Card>

          <Card className="border-growpoint-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-growpoint-dark">Avg Engagement Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-growpoint-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-growpoint-dark">
                {avgEngagementScore > 0 ? `${avgEngagementScore}/5` : '—'}
              </div>
              <p className="text-xs text-green-600">Department average</p>
            </CardContent>
          </Card>

          <Card className="border-growpoint-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-growpoint-dark">Survey Participation</CardTitle>
              <Users className="h-4 w-4 text-growpoint-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-growpoint-dark">
                {participationData[0].percentage}%
              </div>
              <p className="text-xs text-growpoint-dark/60">Response rate</p>
            </CardContent>
          </Card>

          <Card className="border-growpoint-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-growpoint-dark">Friction Level</CardTitle>
              <AlertTriangle className="h-4 w-4 text-growpoint-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-growpoint-dark">{frictionStats.average}/5</div>
              <p className={`text-xs font-medium ${frictionStats.color}`}>{frictionStats.status}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid - Updated with Survey Participation Chart */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Engagement Over Time */}
          <Card className="border-growpoint-accent/20">
            <CardHeader>
              <CardTitle className="text-growpoint-dark flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Engagement Over Time
              </CardTitle>
              <CardDescription>Weekly average engagement scores for {userDepartment}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={engagementOverTime}>
                    <XAxis dataKey="week" />
                    <YAxis domain={[0, 5]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="engagement" fill="var(--color-engagement)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Survey Participation Pie Chart */}
          <Card className="border-growpoint-accent/20">
            <CardHeader>
              <CardTitle className="text-growpoint-dark flex items-center gap-2">
                <Users className="w-5 h-5" />
                Survey Participation
              </CardTitle>
              <CardDescription>Response rate for {userDepartment} department</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={participationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percentage }) => `${name}: ${value} (${percentage}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {participationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 border rounded shadow">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-sm">Count: {data.value}</p>
                              <p className="text-sm">Percentage: {data.percentage}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Team Goal Distribution */}
        <Card className="border-growpoint-accent/20">
          <CardHeader>
            <CardTitle className="text-growpoint-dark flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Team Goal Distribution
            </CardTitle>
            <CardDescription>Current focus areas for {userDepartment} team</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={teamGoalDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {teamGoalDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Friction Analysis Card */}
        <Card className="border-growpoint-accent/20">
          <CardHeader>
            <CardTitle className="text-growpoint-dark flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Friction Analysis - {userDepartment}
            </CardTitle>
            <CardDescription>Team health assessment based on friction levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-6 bg-growpoint-soft/30 rounded-lg">
              <div>
                <h3 className="text-lg font-semibold text-growpoint-dark mb-2">Current Status</h3>
                <p className={`text-2xl font-bold ${frictionStats.color}`}>{frictionStats.status}</p>
                <p className="text-sm text-growpoint-dark/60 mt-1">
                  Average friction level: {frictionStats.average}/5.0
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-growpoint-dark/60 space-y-1">
                  <div>0–2.0: Healthy</div>
                  <div>2.1–3.5: At Risk</div>
                  <div>3.6+: Needs Attention</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights Panel */}
        <AIInsightsPanel 
          data={aiInsightsData}
          isHR={false}
        />

        {/* Verbal Feedback Panel */}
        <VerbalFeedbackPanel 
          feedbackData={departmentData}
          departmentName={userDepartment}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
