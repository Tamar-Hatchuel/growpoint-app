
import { useState, useEffect } from 'react';
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
  verbal_q1_comment?: string | null;
  verbal_q2_comment?: string | null;
  verbal_q3_comment?: string | null;
  verbal_q4_comment?: string | null;
  verbal_q5_comment?: string | null;
  verbal_q6_comment?: string | null;
  verbal_q7_comment?: string | null;
}

interface UseFeedbackDataProps {
  selectedDepartment?: string;
  dateRange?: string;
}

export const useFeedbackData = (filters: UseFeedbackDataProps = {}) => {
  const [feedbackData, setFeedbackData] = useState<FeedbackResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('feedback_responses')
          .select('*')
          .order('response_date', { ascending: false });

        // Apply department filter
        if (filters.selectedDepartment && filters.selectedDepartment !== 'all') {
          query = query.eq('department', filters.selectedDepartment);
        }

        // Apply date range filter
        if (filters.dateRange && filters.dateRange !== 'all-time') {
          const now = new Date();
          let startDate: Date;
          
          switch (filters.dateRange) {
            case 'last-7-days':
              startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              break;
            case 'last-30-days':
              startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
              break;
            case 'last-90-days':
              startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
              break;
            default:
              startDate = new Date(0); // All time
          }
          
          query = query.gte('response_date', startDate.toISOString());
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching feedback data:', error);
          setError(error.message);
        } else {
          setFeedbackData(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackData();
  }, [filters.selectedDepartment, filters.dateRange]);

  return { feedbackData, loading, error };
};
