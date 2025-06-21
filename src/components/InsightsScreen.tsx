import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle, TrendingUp, Users } from 'lucide-react';
import RestartConfirmationModal from './RestartConfirmationModal';
import EngagementToolsToast from './EngagementToolsToast';

interface InsightsScreenProps {
  onBack: () => void;
  onRestart: () => void;
  focusArea: string;
  department: string;
}

const cohesionData = [
  { month: 'Jan', cohesion: 3.2 },
  { month: 'Feb', cohesion: 3.5 },
  { month: 'Mar', cohesion: 3.8 },
  { month: 'Apr', cohesion: 4.1 },
  { month: 'May', cohesion: 4.0 },
  { month: 'Jun', cohesion: 4.3 },
];

const engagementData = [
  { week: 'W1', engagement: 7.2, friction: 2.1 },
  { week: 'W2', engagement: 7.8, friction: 1.9 },
  { week: 'W3', engagement: 7.5, friction: 2.3 },
  { week: 'W4', engagement: 8.1, friction: 1.7 },
  { week: 'W5', engagement: 7.9, friction: 2.0 },
  { week: 'W6', engagement: 8.3, friction: 1.5 },
];

const chartConfig = {
  cohesion: {
    label: "Team Cohesion",
    color: "#FFB4A2",
  },
  engagement: {
    label: "Engagement",
    color: "#E5989B",
  },
  friction: {
    label: "Friction",
    color: "#B5828C",
  },
};

const InsightsScreen: React.FC<InsightsScreenProps> = ({ onBack, onRestart, focusArea, department }) => {
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [showEngagementToast, setShowEngagementToast] = useState(true);

  const handleRestartClick = () => {
    setShowRestartModal(true);
  };

  const handleRestartConfirm = () => {
    setShowRestartModal(false);
    onRestart();
  };

  const handleRestartCancel = () => {
    setShowRestartModal(false);
  };

  const handleTryEngagementTools = () => {
    setShowEngagementToast(false);
    // Navigate to engagement tools section (placeholder)
    console.log('Navigating to engagement tools...');
  };

  const getInsightByFocus = () => {
    switch (focusArea) {
      case 'maintain':
        return {
          title: 'Strong Team Chemistry Detected',
          description: `Your ${department} team shows excellent collaboration with rising engagement trends. Team members feel supported and communication flows well.`,
          status: 'good',
          icon: CheckCircle,
          recommendations: [
            'Continue regular team check-ins',
            'Celebrate recent wins together',
            'Share successful practices with other teams'
          ]
        };
      case 'improve':
        return {
          title: 'Cohesion Building Opportunities',
          description: `Your ${department} team has solid foundations but shows potential for stronger connections. Some communication gaps detected.`,
          status: 'warning',
          icon: AlertTriangle,
          recommendations: [
            'Schedule weekly team bonding activities',
            'Implement peer feedback sessions',
            'Create cross-functional collaboration opportunities'
          ]
        };
      case 'resolve':
        return {
          title: 'Friction Points Identified',
          description: `Your ${department} team shows signs of conflict around decision-making and workload distribution. Immediate attention recommended.`,
          status: 'critical',
          icon: XCircle,
          recommendations: [
            'Facilitate conflict resolution sessions',
            'Clarify roles and responsibilities',
            'Implement structured communication protocols'
          ]
        };
      default:
        return {
          title: 'Team Analysis Complete',
          description: 'Your team dynamics have been analyzed.',
          status: 'good',
          icon: CheckCircle,
          recommendations: []
        };
    }
  };

  const insight = getInsightByFocus();
  const statusColors = {
    good: 'text-green-600',
    warning: 'text-yellow-600',
    critical: 'text-red-600'
  };
  const statusIcons = {
    good: '✅',
    warning: '⚠️',
    critical: '❌'
  };

  return (
    <>
      <RestartConfirmationModal
        open={showRestartModal}
        onConfirm={handleRestartConfirm}
        onCancel={handleRestartCancel}
      />
      
      <EngagementToolsToast
        show={showEngagementToast}
        onClose={() => setShowEngagementToast(false)}
        onTryTools={handleTryEngagementTools}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 p-4">
        <div className="max-w-6xl mx-auto animate-fade-in">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 text-growpoint-dark hover:text-growpoint-accent hover:bg-growpoint-soft/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Focus Selection
          </Button>
          
          {/* Main Insight Card */}
          <Card className="border-growpoint-accent/20 shadow-lg mb-8">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-growpoint-soft p-3 rounded-full">
                  <insight.icon className={`w-8 h-8 ${statusColors[insight.status]}`} />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-growpoint-dark flex items-center justify-center gap-2">
                {statusIcons[insight.status]} {insight.title}
              </CardTitle>
              <CardDescription className="text-lg text-growpoint-dark/80 max-w-2xl mx-auto">
                {insight.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="bg-growpoint-soft/30 p-6 rounded-lg">
                <h4 className="font-semibold text-growpoint-dark mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recommended Actions
                </h4>
                <ul className="space-y-2">
                  {insight.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-growpoint-dark/80">
                      <span className="text-growpoint-primary font-bold">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
          
          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Team Cohesion Over Time */}
            <Card className="border-growpoint-accent/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-growpoint-dark flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Cohesion Over Time
                </CardTitle>
                <CardDescription>Monthly cohesion scores (1-5 scale)</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cohesionData}>
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 5]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="cohesion" fill="var(--color-cohesion)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            
            {/* Engagement vs Friction */}
            <Card className="border-growpoint-accent/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-growpoint-dark flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Engagement vs. Friction
                </CardTitle>
                <CardDescription>Weekly trends (1-10 scale)</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={engagementData}>
                      <XAxis dataKey="week" />
                      <YAxis domain={[0, 10]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="engagement" stroke="var(--color-engagement)" strokeWidth={3} dot={{ fill: "var(--color-engagement)" }} />
                      <Line type="monotone" dataKey="friction" stroke="var(--color-friction)" strokeWidth={3} dot={{ fill: "var(--color-friction)" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleRestartClick}
              variant="outline"
              className="border-growpoint-accent/30 text-growpoint-dark hover:bg-growpoint-soft"
            >
              Take Survey Again
            </Button>
            <Button
              onClick={() => window.print()}
              className="bg-growpoint-primary hover:bg-growpoint-accent text-white"
            >
              Save Results
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InsightsScreen;
