
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SurveySubmissionData {
  responses: Record<number, number>;
  department: string;
  userDepartment?: string;
  employeeId?: string;
}

export const useSurveySubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const submitSurvey = async (data: SurveySubmissionData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Calculate scores from responses
      const responseValues = Object.values(data.responses);
      const engagementScore = responseValues.reduce((acc, val) => acc + val, 0) / responseValues.length;
      const cohesionScore = engagementScore; // For now, using same calculation
      const frictionLevel = 5 - engagementScore; // Inverse relationship

      const submissionData = {
        department: data.department,
        user_department: data.userDepartment || data.department,
        employee_id: data.employeeId ? parseInt(data.employeeId) : null,
        responses: data.responses,
        engagement_score: engagementScore,
        cohesion_score: cohesionScore,
        friction_level: frictionLevel,
        response_date: new Date().toISOString(),
        session_id: crypto.randomUUID(),
      };

      const { error: insertError } = await supabase
        .from('feedback_responses')
        .insert([submissionData]);

      if (insertError) throw insertError;

      setIsSuccess(true);
      toast({
        title: "✅ Survey submitted successfully!",
        description: "Your anonymous responses help build stronger teams.",
        duration: 3000,
        className: "bg-[#B8CFCE] border-green-200 text-growpoint-dark",
      });

      return true;
    } catch (submitError) {
      console.error('Error submitting survey:', submitError);
      const errorMessage = 'Failed to submit survey. Please try again.';
      setError(errorMessage);
      toast({
        title: "❌ Something Went Wrong",
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSubmission = () => {
    setIsSuccess(false);
    setError(null);
    setIsSubmitting(false);
  };

  return {
    submitSurvey,
    isSubmitting,
    isSuccess,
    error,
    resetSubmission,
  };
};
