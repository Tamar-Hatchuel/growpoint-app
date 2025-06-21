import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Target, BarChart3 } from 'lucide-react';
import IdentificationScreen from '@/components/IdentificationScreen';
import DepartmentSelectionScreen from '@/components/DepartmentSelectionScreen';
import HRChoiceScreen from '@/components/HRChoiceScreen';
import AdminChoiceScreen from '@/components/AdminChoiceScreen';
import SociometricTestScreen from '@/components/SociometricTestScreen';
import OutcomeFocusScreen from '@/components/OutcomeFocusScreen';
import InsightsScreen from '@/components/InsightsScreen';
import ThankYouScreen from '@/components/ThankYouScreen';
import HRDashboard from '@/components/dashboards/HRDashboard';
import ManagerDashboard from '@/components/dashboards/ManagerDashboard';

type FlowStep = 'welcome' | 'identification' | 'department' | 'hr-choice' | 'admin-choice' | 'survey' | 'focus' | 'insights' | 'hr-dashboard' | 'manager-dashboard' | 'thank-you';

interface UserData {
  name?: string;
  team?: string;
  department?: string;
  employee?: string;
  employeeId?: string;
  role?: string;
  permission?: string;
  userDepartment?: string;
  surveyResponses?: Record<number, number>;
  focusArea?: string;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('welcome');
  const [userData, setUserData] = useState<UserData>({});

  const handleWelcomeStart = () => {
    setCurrentStep('department');
  };

  const handleIdentificationContinue = (data: { name: string; team: string }) => {
    setUserData(prev => ({ ...prev, ...data }));
    setCurrentStep('department');
  };

  const handleDepartmentContinue = (data: { department: string; employee: string; employeeId: string; permission?: string; userDepartment?: string }) => {
    setUserData(prev => ({ ...prev, ...data }));
    setCurrentStep('survey');
  };

  const handleNavigateToHRChoice = (data: any) => {
    setUserData(prev => ({ ...prev, ...data }));
    setCurrentStep('hr-choice');
  };

  const handleNavigateToAdminChoice = (data: any) => {
    setUserData(prev => ({ ...prev, ...data }));
    setCurrentStep('admin-choice');
  };

  const handleNavigateToHR = () => {
    setCurrentStep('hr-dashboard');
  };

  const handleNavigateToManager = () => {
    setCurrentStep('manager-dashboard');
  };

  const handleNavigateToThankYou = () => {
    setCurrentStep('thank-you');
  };

  const handleSurveyContinue = (responses: Record<number, number>) => {
    setUserData(prev => ({ ...prev, surveyResponses: responses }));
    setCurrentStep('focus');
  };

  const handleFocusContinue = (focus: string) => {
    setUserData(prev => ({ ...prev, focusArea: focus }));
    setCurrentStep('insights');
  };

  const handleRestart = () => {
    setUserData({});
    setCurrentStep('welcome');
  };

  const goBack = (step: FlowStep) => {
    setCurrentStep(step);
  };

  // Render current step
  switch (currentStep) {
    case 'identification':
      return (
        <IdentificationScreen 
          onBack={() => goBack('welcome')} 
          onContinue={handleIdentificationContinue}
        />
      );
    
    case 'department':
      return (
        <DepartmentSelectionScreen 
          onBack={() => goBack('welcome')} 
          onContinue={handleDepartmentContinue}
          onNavigateToHR={handleNavigateToHR}
          onNavigateToManager={handleNavigateToManager}
          onNavigateToThankYou={handleNavigateToThankYou}
          onNavigateToHRChoice={handleNavigateToHRChoice}
          onNavigateToAdminChoice={handleNavigateToAdminChoice}
        />
      );

    case 'hr-choice':
      return (
        <HRChoiceScreen 
          onBack={() => goBack('department')} 
          onFillQuestionnaire={handleDepartmentContinue}
          onViewDashboard={handleNavigateToHR}
          userData={userData}
        />
      );

    case 'admin-choice':
      return (
        <AdminChoiceScreen 
          onBack={() => goBack('department')} 
          onFillQuestionnaire={handleDepartmentContinue}
          onViewDashboard={handleNavigateToManager}
          userData={userData}
        />
      );
    
    case 'survey':
      return (
        <SociometricTestScreen 
          onBack={() => goBack('department')} 
          onContinue={handleSurveyContinue}
        />
      );
    
    case 'focus':
      return (
        <OutcomeFocusScreen 
          onBack={() => goBack('survey')} 
          onContinue={handleFocusContinue}
        />
      );
    
    case 'insights':
      return (
        <InsightsScreen 
          onBack={() => goBack('focus')} 
          onRestart={handleRestart}
          focusArea={userData.focusArea || 'maintain'}
          department={userData.department || 'Team'}
        />
      );

    case 'hr-dashboard':
      return (
        <HRDashboard 
          userData={userData}
        />
      );

    case 'manager-dashboard':
      return (
        <ManagerDashboard 
          userData={userData}
        />
      );

    case 'thank-you':
      return (
        <ThankYouScreen 
          onRestart={handleRestart}
        />
      );
    
    default:
      // Welcome screen
      return (
        <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 relative overflow-hidden">
          {/* Floating Background Elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-growpoint-primary/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-growpoint-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-growpoint-dark/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>

          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
            {/* Logo/Brand Section */}
            <div className="text-center mb-12 animate-fade-in">
              <div className="flex items-center justify-center mb-6">
                <img src="/lovable-uploads/c3fcdded-87c5-4a78-b39e-2094a897384e.png" alt="GrowPoint" className="w-20 h-20" />
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-growpoint-dark mb-4 tracking-tight">
                GrowPoint
              </h1>
              
              <p className="text-xl md:text-2xl text-growpoint-accent font-semibold mb-2">
                Empowering People. Accelerating Teams.
              </p>
            </div>

            {/* Mission Statement */}
            <Card className="max-w-4xl w-full mb-12 border-growpoint-accent/20 shadow-xl bg-white/80 backdrop-blur-sm animate-scale-in">
              <CardContent className="p-8 md:p-12 text-center">
                <p className="text-lg md:text-xl text-growpoint-dark leading-relaxed">
                  "GrowPoint is your team's invisible mirror. Understand real dynamics, 
                  improve cohesion, and accelerate team growth — powered by anonymous 
                  feedback and AI-driven insights."
                </p>
              </CardContent>
            </Card>

            {/* Feature Icons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl w-full">
              <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="bg-growpoint-soft p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-growpoint-dark" />
                </div>
                <h3 className="font-semibold text-growpoint-dark mb-1">Team Dynamics</h3>
                <p className="text-sm text-growpoint-dark/70">Understand real relationships</p>
              </div>
              
              <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="bg-growpoint-soft p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Target className="w-8 h-8 text-growpoint-dark" />
                </div>
                <h3 className="font-semibold text-growpoint-dark mb-1">Anonymous Feedback</h3>
                <p className="text-sm text-growpoint-dark/70">Safe, honest communication</p>
              </div>
              
              <div className="text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="bg-growpoint-soft p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-8 h-8 text-growpoint-dark" />
                </div>
                <h3 className="font-semibold text-growpoint-dark mb-1">AI Insights</h3>
                <p className="text-sm text-growpoint-dark/70">Data-driven growth</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="animate-scale-in" style={{ animationDelay: '0.8s' }}>
              <Button
                onClick={handleWelcomeStart}
                className="bg-growpoint-primary hover:bg-growpoint-accent text-white font-bold text-lg px-12 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                Start Your Survey
              </Button>
            </div>

            {/* Subtitle */}
            <p className="text-growpoint-dark/60 text-center mt-6 max-w-md animate-fade-in" style={{ animationDelay: '1s' }}>
              Join teams worldwide in building stronger, more effective collaboration
            </p>
          </div>
        </div>
      );
  }
};

export default Index;
