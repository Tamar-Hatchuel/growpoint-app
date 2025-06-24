
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FeedbackResponse {
  id: string;
  employee_id: number | null;
  department: string;
  engagement_score: number;
  cohesion_score: number;
  friction_level: number;
  team_goal: string;
  response_date: string;
  created_at: string;
}

interface Metrics {
  avgEngagement: number;
  avgCohesion: number;
  avgFriction: number;
}

interface DepartmentMetric {
  department: string;
  avgEngagement: number;
  avgCohesion: number;
  avgFriction: number;
  count: number;
}

interface TrendData {
  month: string;
  engagement: number;
  cohesion: number;
  friction: number;
}

export const useFeedbackData = (departmentFilter?: string) => {
  const [feedbackData, setFeedbackData] = useState<FeedbackResponse[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [departmentMetrics, setDepartmentMetrics] = useState<DepartmentMetric[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbackData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('feedback_responses')
        .select('*')
        .order('response_date', { ascending: false });

      if (departmentFilter) {
        query = query.eq('department', departmentFilter);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching feedback data:', fetchError);
        setError(fetchError.message);
        return;
      }

      const responses = data || [];
      setFeedbackData(responses);

      // Calculate overall metrics
      if (responses.length > 0) {
        const avgEngagement = responses.reduce((sum, r) => sum + (r.engagement_score || 0), 0) / responses.length;
        const avgCohesion = responses.reduce((sum, r) => sum + (r.cohesion_score || 0), 0) / responses.length;
        const avgFriction = responses.reduce((sum, r) => sum + (r.friction_level || 0), 0) / responses.length;

        setMetrics({
          avgEngagement,
          avgCohesion,
          avgFriction
        });
      } else {
        setMetrics(null);
      }

      // Calculate department metrics (only if no department filter)
      if (!departmentFilter) {
        const deptGroups = responses.reduce((acc, response) => {
          const dept = response.department;
          if (!acc[dept]) {
            acc[dept] = [];
          }
          acc[dept].push(response);
          return acc;
        }, {} as Record<string, FeedbackResponse[]>);

        const deptMetrics = Object.entries(deptGroups).map(([dept, responses]) => ({
          department: dept,
          avgEngagement: responses.reduce((sum, r) => sum + (r.engagement_score || 0), 0) / responses.length,
          avgCohesion: responses.reduce((sum, r) => sum + (r.cohesion_score || 0), 0) / responses.length,
          avgFriction: responses.reduce((sum, r) => sum + (r.friction_level || 0), 0) / responses.length,
          count: responses.length
        }));

        setDepartmentMetrics(deptMetrics);
      } else {
        setDepartmentMetrics([]);
      }

      // Calculate trend data (group by month)
      const monthGroups = responses.reduce((acc, response) => {
        const date = new Date(response.response_date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!acc[monthKey]) {
          acc[monthKey] = [];
        }
        acc[monthKey].push(response);
        return acc;
      }, {} as Record<string, FeedbackResponse[]>);

      const trends = Object.entries(monthGroups)
        .map(([month, responses]) => ({
          month,
          engagement: responses.reduce((sum, r) => sum + (r.engagement_score || 0), 0) / responses.length,
          cohesion: responses.reduce((sum, r) => sum + (r.cohesion_score || 0), 0) / responses.length,
          friction: responses.reduce((sum, r) => sum + (r.friction_level || 0), 0) / responses.length
        }))
        .sort((a, b) => a.month.localeCompare(b.month));

      setTrendData(trends);

    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [departmentFilter]);

  useEffect(() => {
    fetchFeedbackData();
  }, [fetchFeedbackData]);

  const refetch = useCallback(() => {
    fetchFeedbackData();
  }, [fetchFeedbackData]);

  return { 
    feedbackData, 
    metrics,
    departmentMetrics,
    trendData,
    isLoading, 
    error,
    refetch,
    // Legacy properties for backward compatibility
    loading: isLoading
  };
};
