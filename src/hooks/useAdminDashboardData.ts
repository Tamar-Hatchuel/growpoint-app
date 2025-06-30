import { useState, useMemo, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FeedbackResponse {
  id: string;
  created_at: string;
  department: string;
  engagement_score: number;
  friction_level: number;
  team_goal: string;
  response_date: string;
  employee_id: number | null;
  cohesion_score: number;
  verbal_q1_comment?: string;
  verbal_q2_comment?: string;
  verbal_q3_comment?: string;
  verbal_q4_comment?: string;
  verbal_q5_comment?: string;
  verbal_q6_comment?: string;
  verbal_q7_comment?: string;
}

export const useAdminDashboardData = (feedbackData: FeedbackResponse[], userDepartment: string) => {
  const [totalEmployees, setTotalEmployees] = useState<number>(0);

  // Helper function to cap engagement scores at maximum value (5)
  const capEngagementScore = (score: number): number => {
    if (score > 5) {
      console.warn(`Engagement score ${score} exceeds maximum of 5, capping at 5`);
      return 5;
    }
    return Math.max(0, Math.min(5, Number(score.toFixed(1))));
  };

  // Fetch total employees count for the department
  useEffect(() => {
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

  // Calculate average engagement score for the department with capping
  const avgEngagementScore = useMemo(() => {
    if (departmentData.length === 0) return 0;
    const cappedScores = departmentData.map(response => Math.min(5, response.engagement_score || 0));
    const total = cappedScores.reduce((sum, score) => sum + score, 0);
    return capEngagementScore(total / cappedScores.length);
  }, [departmentData]);

  // Calculate survey participation data
  const participationData = useMemo(() => {
    const uniqueRespondents = new Set(
      departmentData
        .filter(response => response.employee_id)
        .map(response => response.employee_id!.toString())
    ).size;
    
    const notResponded = Math.max(0, totalEmployees - uniqueRespondents);
    
    return [
      {
        name: 'Responded',
        value: uniqueRespondents,
        color: '#10B981',
        percentage: totalEmployees > 0 ? Math.round((uniqueRespondents / totalEmployees) * 100) : 0
      },
      {
        name: 'Not Responded', 
        value: notResponded,
        color: '#6B7280',
        percentage: totalEmployees > 0 ? Math.round((notResponded / totalEmployees) * 100) : 0
      }
    ];
  }, [departmentData, totalEmployees]);

  // Process engagement data over time (grouped by week) with capping
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
      
      // Cap engagement scores in weekly calculation
      const cappedScore = Math.min(5, response.engagement_score || 0);
      weeklyData[weekKey].total += cappedScore;
      weeklyData[weekKey].count += 1;
    });

    return Object.values(weeklyData)
      .map(data => ({
        week: data.week,
        engagement: capEngagementScore(data.total / data.count)
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
      color: goal === 'Maintain' ? '#10B981' : goal === 'Improve' ? '#F59E0B' : '#EF4444'
    }));
  }, [departmentData]);

  // Calculate friction level with improved thresholds
  const frictionStats = useMemo(() => {
    if (departmentData.length === 0) return { average: 0, status: 'Healthy', color: 'text-green-600' };
    
    const totalFriction = departmentData.reduce((sum, response) => sum + (response.friction_level || 0), 0);
    const average = totalFriction / departmentData.length;
    
    let status = 'Healthy';
    let color = 'text-green-600';
    
    // Updated thresholds: >= 3.6 for "Needs Attention", 2.0-3.5 for "At Risk"
    if (average >= 3.6) {
      status = 'Needs Attention';
      color = 'text-red-600';
    } else if (average >= 2.0) {
      status = 'At Risk';
      color = 'text-yellow-600';
    }
    
    return { average: Number(average.toFixed(1)), status, color };
  }, [departmentData]);

  // Process data for AI insights with engagement capping
  const aiInsightsData = useMemo(() => {
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

    // Cap engagement scores for AI insights
    const cappedScores = departmentData.map(r => Math.min(5, r.engagement_score || 0));
    const avgEngagement = cappedScores.reduce((sum, score) => sum + score, 0) / cappedScores.length;
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
      avgEngagement: capEngagementScore(avgEngagement),
      avgCohesion,
      avgFriction,
      teamGoalDistribution: goalDistribution,
      departmentName: userDepartment,
      verbalComments
    };
  }, [departmentData, userDepartment]);

  return {
    departmentData,
    avgEngagementScore,
    participationData,
    engagementOverTime,
    teamGoalDistribution,
    frictionStats,
    aiInsightsData
  };
};
