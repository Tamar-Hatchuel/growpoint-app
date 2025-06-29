
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface AdminFrictionAnalysisProps {
  frictionStats: {
    average: number;
    status: string;
    color: string;
  };
  userDepartment: string;
}

const AdminFrictionAnalysis: React.FC<AdminFrictionAnalysisProps> = ({
  frictionStats,
  userDepartment
}) => {
  return (
    <Card className="border-growpoint-accent/20">
      <CardHeader>
        <CardTitle className="text-growpoint-dark flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Friction Analysis - {userDepartment}
        </CardTitle>
        <CardDescription>Team health assessment based on friction levels</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-6 bg-growpoint-soft/30 rounded-lg">
          <div>
            <h3 className="text-lg font-semibold text-growpoint-dark mb-2">Current Status</h3>
            <p className={`text-2xl font-bold ${frictionStats.color}`}>{frictionStats.status}</p>
            <p className="text-sm text-growpoint-dark/60 mt-1">
              Average friction level: {frictionStats.average}/5.0
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-growpoint-dark/60 space-y-1">
              <div>0–2.0: Healthy</div>
              <div>2.1–3.5: At Risk</div>
              <div>3.6+: Needs Attention</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminFrictionAnalysis;
