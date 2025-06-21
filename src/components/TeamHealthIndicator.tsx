
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface TeamHealthIndicatorProps {
  frictionLevel: number;
  engagementScore: number;
  teamName: string;
}

const TeamHealthIndicator: React.FC<TeamHealthIndicatorProps> = ({ 
  frictionLevel, 
  engagementScore, 
  teamName 
}) => {
  const getHealthStatus = () => {
    // Healthy: Low friction (< 2.0) AND high engagement (> 7.5)
    if (frictionLevel < 2.0 && engagementScore > 7.5) {
      return {
        status: 'healthy',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        title: '✅ Healthy',
        description: 'Team is performing well with strong collaboration'
      };
    }
    
    // At Risk: Medium friction (2.0-3.0) OR moderate engagement (6.0-7.5)
    if ((frictionLevel >= 2.0 && frictionLevel <= 3.0) || (engagementScore >= 6.0 && engagementScore <= 7.5)) {
      return {
        status: 'at-risk',
        icon: AlertTriangle,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        title: '⚠ At Risk',
        description: 'Some concerns detected, monitoring recommended'
      };
    }
    
    // Needs Attention: High friction (> 3.0) OR low engagement (< 6.0)
    return {
      status: 'critical',
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      title: '❌ Needs Attention',
      description: 'Immediate action required to address issues'
    };
  };

  const health = getHealthStatus();
  const IconComponent = health.icon;

  return (
    <Card className={`${health.bgColor} ${health.borderColor} border-2`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-growpoint-dark flex items-center justify-between">
          <span>{teamName}</span>
          <IconComponent className={`w-6 h-6 ${health.color}`} />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className={`text-center p-3 rounded-lg ${health.bgColor}`}>
          <div className={`text-xl font-bold ${health.color} mb-1`}>
            {health.title}
          </div>
          <div className="text-sm text-growpoint-dark/70">
            {health.description}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-growpoint-dark">Engagement</div>
            <div className={`text-lg font-bold ${engagementScore > 7.5 ? 'text-green-600' : engagementScore > 6.0 ? 'text-yellow-600' : 'text-red-600'}`}>
              {engagementScore.toFixed(1)}/10
            </div>
          </div>
          
          <div className="text-center">
            <div className="font-semibold text-growpoint-dark">Friction</div>
            <div className={`text-lg font-bold ${frictionLevel < 2.0 ? 'text-green-600' : frictionLevel <= 3.0 ? 'text-yellow-600' : 'text-red-600'}`}>
              {frictionLevel.toFixed(1)}/5
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamHealthIndicator;
