
import { useMemo } from 'react';
import { calculateSurveyMetrics } from '@/utils/surveyMetrics';

interface SurveyMetrics {
  engagementScore: number;
  cohesionScore: number;
  frictionLevel: number;
}

export const useSurveyMetrics = (responses: Record<number, number>): SurveyMetrics => {
  return useMemo(() => {
    return calculateSurveyMetrics(responses);
  }, [responses]);
};
