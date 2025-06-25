import React, { useState } from 'react';
import IdentificationScreen from '@/components/IdentificationScreen';
import DepartmentSelectionScreen from '@/components/DepartmentSelectionScreen';
import HRChoiceScreen from '@/components/HRChoiceScreen';
import AdminChoiceScreen from '@/components/AdminChoiceScreen';
import SociometricTestScreen from '@/components/SociometricTestScreen';
import ThankYouScreen from '@/components/ThankYouScreen';
import HRDashboard from '@/components/dashboards/HRDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import SurveyConfirmationModal from '@/components/SurveyConfirmationModal';

export type FlowStep = 'welcome' | 'identification' | 'department' | 'hr-choice' | 'admin-choice' | 'survey' | 'hr-dashboard' | 'manager-dashboard' | 'thank-you';

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
  const [showSurveyConfirmation, setShowSurveyConfirmation] = useState(false);
  const [pendingSurveyStart, setPendingSurveyStart] = useState<() => void>(() => {});

  const handleIdentificationContinue = (data: { name: string; team: string }) => {
    onUserDataUpdate(data);
    onStepChange('department');
  };

  const handleDepartmentContinue = (data: { department: string; employee: string; employeeId: string; permission?: string; userDepartment?: string }) => {
    onUserDataUpdate(data);
    
    // Show confirmation modal for users with "user" permission
    if (data.permission === 'user') {
      setPendingSurveyStart(() => () => onStepChange('survey'));
      setShowSurveyConfirmation(true);
    } else {
      onStepChange('survey');
    }
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
    // Always go to thank you screen after survey completion
    onStepChange('thank-you');
  };

  const handleSurveyConfirm = () => {
    setShowSurveyConfirmation(false);
    pendingSurveyStart();
  };

  const handleSurveyCancel = () => {
    setShowSurveyConfirmation(false);
    // Return to department selection
    onStepChange('department');
  };

  const handleQuestionnaireChoice = (data: any) => {
    // Show confirmation modal for HR/Admin users choosing to fill questionnaire
    setPendingSurveyStart(() => () => {
      onUserDataUpdate(data);
      onStepChange('survey');
    });
    setShowSurveyConfirmation(true);
  };

  const goBack = (step: FlowStep) => {
    onStepChange(step);
  };

  return (
    <>
      {/* Survey Confirmation Modal */}
      <SurveyConfirmationModal
        open={showSurveyConfirmation}
        onClose={handleSurveyCancel}
        onStartSurvey={handleSurveyConfirm}
      />

      {/* Main Flow Content */}
      {(() => {
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
      })()}
    </>
  );
};

export default FlowManager;
