
import React from 'react';
import IdentificationScreen from '@/components/IdentificationScreen';
import DepartmentSelectionScreen from '@/components/DepartmentSelectionScreen';
import HRChoiceScreen from '@/components/HRChoiceScreen';
import AdminChoiceScreen from '@/components/AdminChoiceScreen';
import SociometricTestScreen from '@/components/SociometricTestScreen';
import ThankYouScreen from '@/components/ThankYouScreen';
import HRDashboard from '@/components/dashboards/HRDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import { FlowStep, UserData } from '@/components/FlowManager';

interface FlowRendererProps {
  currentStep: FlowStep;
  userData: UserData;
  onRestart: () => void;
  handlers: {
    handleIdentificationContinue: (data: { name: string; team: string }) => void;
    handleDepartmentContinue: (data: { department: string; employee: string; employeeId: string; permission?: string; userDepartment?: string }) => void;
    handleNavigateToHRChoice: (data: any) => void;
    handleNavigateToAdminChoice: (data: any) => void;
    handleNavigateToHR: () => void;
    handleNavigateToManager: () => void;
    handleNavigateToThankYou: () => void;
    handleSurveyContinue: (responses: Record<number, number>) => void;
    handleQuestionnaireChoice: (data: any) => void;
  };
  navigation: {
    goBack: (step: FlowStep) => void;
  };
}

const FlowRenderer: React.FC<FlowRendererProps> = ({
  currentStep,
  userData,
  onRestart,
  handlers,
  navigation
}) => {
  const {
    handleIdentificationContinue,
    handleDepartmentContinue,
    handleNavigateToHRChoice,
    handleNavigateToAdminChoice,
    handleNavigateToHR,
    handleNavigateToManager,
    handleNavigateToThankYou,
    handleSurveyContinue,
    handleQuestionnaireChoice,
  } = handlers;

  const { goBack } = navigation;

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
          onFillQuestionnaire={handleQuestionnaireChoice}
          onViewDashboard={handleNavigateToHR}
          userData={userData}
        />
      );

    case 'admin-choice':
      return (
        <AdminChoiceScreen 
          onBack={() => goBack('department')} 
          onFillQuestionnaire={handleQuestionnaireChoice}
          onViewDashboard={handleNavigateToManager}
          userData={userData}
        />
      );
    
    case 'survey':
      return (
        <SociometricTestScreen 
          onBack={() => goBack('department')} 
          onContinue={handleSurveyContinue}
          userData={userData}
        />
      );

    case 'hr-dashboard':
      return (
        <HRDashboard 
          userData={userData}
          onRestart={onRestart}
        />
      );

    case 'manager-dashboard':
      return (
        <AdminDashboard 
          userData={userData}
          onRestart={onRestart}
        />
      );

    case 'thank-you':
      return (
        <ThankYouScreen 
          onRestart={onRestart}
        />
      );
    
    default:
      return null;
  }
};

export default FlowRenderer;
