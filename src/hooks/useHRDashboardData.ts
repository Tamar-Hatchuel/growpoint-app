
import React from 'react';
import { FeedbackResponse } from '@/hooks/useFeedbackData';

interface ProcessedData {
  departments: Department[];
  totalEmployees: number;
  avgEngagement: number;
  highRiskTeams: number;
  engagementTrend: EngagementTrendData[];
  bubbleData: BubbleData[];
  cohesionFrictionData: CohesionFrictionData[];
  engagementVariabilityData: EngagementVariabilityData[];
}

interface Department {
  department: string;
  engagement: number;
  cohesion: number;
  friction: number;
  employees: number;
  responseCount: number;
  engagementScores: number[];
}

interface EngagementTrendData {
  week: string;
  engagement: number;
}

interface BubbleData {
  department: string;
  friction: number;
  engagement: number;
  responseCount: number;
  fill: string;
}

interface CohesionFrictionData {
  department: string;
  cohesion: number;
  friction: number;
}

interface EngagementVariabilityData {
  department: string;
  stdDev: number;
}

export const useHRDashboardData = (feedbackData: FeedbackResponse[]) => {
  // Calculate standard deviation
  const calculateStandardDeviation = (values: number[]) => {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.sqrt(avgSquaredDiff);
  };

  // Helper function to cap engagement scores at maximum value (5)
  const capEngagementScore = (score: number): number => {
    if (score > 5) {
      console.warn(`Engagement score ${score} exceeds maximum of 5, capping at 5`);
      return 5;
    }
    return Math.max(0, Math.min(5, Number(score.toFixed(1))));
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
      
      // Cap engagement scores at 5 to prevent display issues
      const cappedEngagement = Math.min(5, response.engagement_score || 0);
      acc[dept].engagement.push(cappedEngagement);
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
      engagement: capEngagementScore(dept.engagement.reduce((sum: number, val: number) => sum + val, 0) / dept.engagement.length),
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
      
      // Cap engagement scores in trend calculation
      const cappedEngagement = Math.min(5, response.engagement_score || 0);
      weeklyEngagement[weekKey].total += cappedEngagement;
      weeklyEngagement[weekKey].count += 1;
    });

    const engagementTrend = Object.values(weeklyEngagement)
      .map(data => ({
        week: data.week,
        engagement: capEngagementScore(data.total / data.count)
      }))
      .sort((a, b) => a.week.localeCompare(b.week));

    // Prepare bubble chart data (Friction vs Engagement by Department)
    const bubbleData = departments.map(dept => ({
      department: dept.department,
      friction: dept.friction,
      engagement: dept.engagement,
      responseCount: dept.responseCount,
      // Updated color coding: Low friction (<=2.5) AND high engagement (>=3.5) = Green
      // High friction (>=3.6) OR low engagement (<=2.5) = Red, otherwise Yellow
      fill: dept.friction <= 2.5 && dept.engagement >= 3.5 ? '#10B981' : 
             dept.friction >= 3.6 || dept.engagement <= 2.5 ? '#EF4444' : 
             '#F59E0B'
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
    const avgEngagement = departments.length > 0 ? 
      capEngagementScore(departments.reduce((sum, dept) => sum + dept.engagement, 0) / departments.length) : 0;
    
    // Fixed high-risk teams logic: Use friction >= 3.6 as threshold for "Needs Attention"
    const highRiskTeams = departments.filter(dept => dept.friction >= 3.6).length;

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

  return processedData;
};
