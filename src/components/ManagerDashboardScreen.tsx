
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, TrendingUp, MessageSquare, Target } from 'lucide-react';

interface ManagerDashboardScreenProps {
  onBack: () => void;
}

const ManagerDashboardScreen: React.FC<ManagerDashboardScreenProps> = ({ onBack }) => {
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
          <h1 className="text-3xl font-bold text-growpoint-dark mb-2">Manager Dashboard</h1>
          <p className="text-growpoint-dark/70">Lead your team with data-driven insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-growpoint-accent/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-growpoint-dark">
                <Users className="w-5 h-5" />
                Team Overview
              </CardTitle>
              <CardDescription>
                Monitor your team's dynamics and collaboration patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-growpoint-primary hover:bg-growpoint-accent">
                View Team Insights
              </Button>
            </CardContent>
          </Card>

          <Card className="border-growpoint-accent/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-growpoint-dark">
                <TrendingUp className="w-5 h-5" />
                Performance Metrics
              </CardTitle>
              <CardDescription>
                Track team performance and identify growth opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-growpoint-primary hover:bg-growpoint-accent">
                View Metrics
              </Button>
            </CardContent>
          </Card>

          <Card className="border-growpoint-accent/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-growpoint-dark">
                <MessageSquare className="w-5 h-5" />
                Feedback & Communication
              </CardTitle>
              <CardDescription>
                Manage team feedback and improve communication channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-growpoint-primary hover:bg-growpoint-accent">
                Manage Feedback
              </Button>
            </CardContent>
          </Card>

          <Card className="border-growpoint-accent/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-growpoint-dark">
                <Target className="w-5 h-5" />
                Action Items
              </CardTitle>
              <CardDescription>
                Review and act on AI-generated team improvement suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-growpoint-primary hover:bg-growpoint-accent">
                View Suggestions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboardScreen;
