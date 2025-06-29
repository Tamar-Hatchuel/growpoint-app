
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, TrendingUp, Users, AlertTriangle } from 'lucide-react';

interface AdminKPICardsProps {
  responseCount: number;
  avgEngagementScore: number;
  participationPercentage: number;
  frictionStats: {
    average: number;
    status: string;
    color: string;
  };
}

const AdminKPICards: React.FC<AdminKPICardsProps> = ({
  responseCount,
  avgEngagementScore,
  participationPercentage,
  frictionStats
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="border-growpoint-accent/20 bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-growpoint-dark">Total Responses</CardTitle>
          <Calendar className="h-4 w-4 text-growpoint-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-growpoint-dark">{responseCount}</div>
          <p className="text-xs text-growpoint-dark/60">Department feedback</p>
        </CardContent>
      </Card>

      <Card className="border-growpoint-accent/20 bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-growpoint-dark">Avg Engagement Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-growpoint-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-growpoint-dark">
            {avgEngagementScore > 0 ? `${avgEngagementScore}/5` : '—'}
          </div>
          <p className="text-xs text-green-600">Department average</p>
        </CardContent>
      </Card>

      <Card className="border-growpoint-accent/20 bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-growpoint-dark">Survey Participation</CardTitle>
          <Users className="h-4 w-4 text-growpoint-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-growpoint-dark">
            {participationPercentage}%
          </div>
          <p className="text-xs text-growpoint-dark/60">Response rate</p>
        </CardContent>
      </Card>

      <Card className="border-growpoint-accent/20 bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-growpoint-dark">Friction Level</CardTitle>
          <AlertTriangle className="h-4 w-4 text-growpoint-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-growpoint-dark">{frictionStats.average}/5</div>
          <p className={`text-xs font-medium ${frictionStats.color}`}>{frictionStats.status}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminKPICards;
