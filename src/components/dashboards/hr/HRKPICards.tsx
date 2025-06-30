
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, TrendingUp, AlertTriangle } from 'lucide-react';

interface HRKPICardsProps {
  totalResponses: number;
  totalDepartments: number;
  engagementStats: {
    average: number;
    status: string;
    color: string;
  };
  highRiskTeams: number;
}

const HRKPICards: React.FC<HRKPICardsProps> = ({
  totalResponses,
  totalDepartments,
  engagementStats,
  highRiskTeams,
}) => {
  // Determine subtitle for at-risk teams with clearer messaging
  const getAtRiskSubtitle = (count: number) => {
    if (count === 0) return "No teams need attention";
    if (count === 1) return "1 team needs attention";
    return `${count} teams need attention`;
  };

  // Determine color for at-risk teams indicator
  const getAtRiskColor = (count: number) => {
    if (count === 0) return 'text-green-600';
    if (count <= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="border-growpoint-accent/20 bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-growpoint-dark">Total Responses</CardTitle>
          <Users className="h-4 w-4 text-growpoint-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-growpoint-dark">{totalResponses}</div>
          <p className="text-xs text-green-600">Survey responses</p>
        </CardContent>
      </Card>

      <Card className="border-growpoint-accent/20 bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-growpoint-dark">Departments</CardTitle>
          <Building2 className="h-4 w-4 text-growpoint-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-growpoint-dark">{totalDepartments}</div>
          <p className="text-xs text-growpoint-dark/60">Active departments</p>
        </CardContent>
      </Card>

      <Card className="border-growpoint-accent/20 bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-growpoint-dark">Engagement Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-growpoint-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-growpoint-dark">
            {engagementStats.average > 0 ? `${engagementStats.average}/5` : '—'}
          </div>
          <p className={`text-xs font-medium ${engagementStats.color}`}>{engagementStats.status}</p>
        </CardContent>
      </Card>

      <Card className="border-growpoint-accent/20 bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-growpoint-dark">Teams Needing Attention</CardTitle>
          <AlertTriangle className={`h-4 w-4 ${highRiskTeams > 0 ? 'text-yellow-500' : 'text-green-500'}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-growpoint-dark">{highRiskTeams}</div>
          <p className={`text-xs font-medium ${getAtRiskColor(highRiskTeams)}`}>
            {getAtRiskSubtitle(highRiskTeams)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HRKPICards;
