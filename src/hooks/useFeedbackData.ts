
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
}

export const useFeedbackData = () => {
  const [feedbackData, setFeedbackData] = useState<FeedbackResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('feedback_responses')
          .select('*')
          .order('response_date', { ascending: false });

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
  }, []);

  return { feedbackData, loading, error };
};
