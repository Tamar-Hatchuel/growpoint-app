
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, BarChart3, Settings, FileText } from 'lucide-react';

interface HRDashboardScreenProps {
  onBack: () => void;
}

const HRDashboardScreen: React.FC<HRDashboardScreenProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 p-4">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-growpoint-dark hover:text-growpoint-accent hover:bg-growpoint-soft/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-growpoint-dark mb-2">HR Dashboard</h1>
          <p className="text-growpoint-dark/70">Manage organizational insights and team analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-growpoint-accent/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-growpoint-dark">
                <Users className="w-5 h-5" />
                Team Analytics
              </CardTitle>
              <CardDescription>
                View comprehensive team dynamics and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-growpoint-primary hover:bg-growpoint-accent">
                View Analytics
              </Button>
            </CardContent>
          </Card>

          <Card className="border-growpoint-accent/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-growpoint-dark">
                <BarChart3 className="w-5 h-5" />
                Organization Reports
              </CardTitle>
              <CardDescription>
                Generate and export detailed organizational reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-growpoint-primary hover:bg-growpoint-accent">
                Generate Reports
              </Button>
            </CardContent>
          </Card>

          <Card className="border-growpoint-accent/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-growpoint-dark">
                <Settings className="w-5 h-5" />
                System Settings
              </CardTitle>
              <CardDescription>
                Configure system-wide settings and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-growpoint-primary hover:bg-growpoint-accent">
                Manage Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HRDashboardScreen;
