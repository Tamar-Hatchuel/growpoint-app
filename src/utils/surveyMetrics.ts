
interface SurveyMetrics {
  engagementScore: number;
  cohesionScore: number;
  frictionLevel: number;
}

export const calculateSurveyMetrics = (responses: Record<number, number>): SurveyMetrics => {
  const responseValues = Object.values(responses);
  
  if (responseValues.length === 0) {
    return {
      engagementScore: 0,
      cohesionScore: 0,
      frictionLevel: 0
    };
  }

  const engagementScore = responseValues.reduce((acc, val) => acc + val, 0) / responseValues.length;
  const cohesionScore = engagementScore; // For now, using same calculation
  const frictionLevel = 5 - engagementScore; // Inverse relationship

  return {
    engagementScore,
    cohesionScore,
    frictionLevel
  };
};
