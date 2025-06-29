
import React from 'react';
import HRCollaborationBubbleChart from './HRCollaborationBubbleChart';
import HREngagementVariabilityChart from './HREngagementVariabilityChart';

interface CohesionFrictionData {
  department: string;
  cohesion: number;
  friction: number;
}

interface EngagementVariabilityData {
  department: string;
  stdDev: number;
}

interface HRCohesionFrictionAnalysisProps {
  cohesionFrictionData: CohesionFrictionData[];
  engagementVariabilityData: EngagementVariabilityData[];
  chartConfig: any;
}

const HRCohesionFrictionAnalysis: React.FC<HRCohesionFrictionAnalysisProps> = ({
  cohesionFrictionData,
  engagementVariabilityData,
  chartConfig,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="w-full">
        <HRCollaborationBubbleChart
          cohesionFrictionData={cohesionFrictionData}
          chartConfig={chartConfig}
        />
      </div>
      <div className="w-full">
        <HREngagementVariabilityChart
          engagementVariabilityData={engagementVariabilityData}
          chartConfig={chartConfig}
        />
      </div>
    </div>
  );
};

export default HRCohesionFrictionAnalysis;
