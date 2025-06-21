
import React from 'react';
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

export type FlowStep = 'welcome' | 'identification' | 'department' | 'hr-choice' | 'admin-choice' | 'survey' | 'focus' | 'insights' | 'hr-dashboard' | 'manager-dashboard' | 'thank-you';

export interface UserData {
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

interface FlowManagerProps {
  currentStep: FlowStep;
  userData: UserData;
  onStepChange: (step: FlowStep) => void;
  onUserDataUpdate: (data: Partial<UserData>) => void;
  onRestart: () => void;
}

const FlowManager: React.FC<FlowManagerProps> = ({
  currentStep,
  userData,
  onStepChange,
  onUserDataUpdate,
  onRestart
}) => {
  const handleIdentificationContinue = (data: { name: string; team: string }) => {
    onUserDataUpdate(data);
    onStepChange('department');
  };

  const handleDepartmentContinue = (data: { department: string; employee: string; employeeId: string; permission?: string; userDepartment?: string }) => {
    onUserDataUpdate(data);
    onStepChange('survey');
  };

  const handleNavigateToHRChoice = (data: any) => {
    onUserDataUpdate(data);
    onStepChange('hr-choice');
  };

  const handleNavigateToAdminChoice = (data: any) => {
    onUserDataUpdate(data);
    onStepChange('admin-choice');
  };

  const handleNavigateToHR = () => {
    onStepChange('hr-dashboard');
  };

  const handleNavigateToManager = () => {
    onStepChange('manager-dashboard');
  };

  const handleNavigateToThankYou = () => {
    onStepChange('thank-you');
  };

  const handleSurveyContinue = (responses: Record<number, number>) => {
    onUserDataUpdate({ surveyResponses: responses });
    onStepChange('focus');
  };

  const handleFocusContinue = (focus: string) => {
    onUserDataUpdate({ focusArea: focus });
    onStepChange('insights');
  };

  const goBack = (step: FlowStep) => {
    onStepChange(step);
  };

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
          onRestart={onRestart}
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
          onRestart={onRestart}
        />
      );
    
    default:
      return null;
  }
};

export default FlowManager;
