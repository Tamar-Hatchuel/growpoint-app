
import React, { useState } from 'react';
import SurveyConfirmationModal from '@/components/SurveyConfirmationModal';
import FlowRenderer from '@/components/flow/FlowRenderer';
import { useFlowNavigation } from '@/components/flow/FlowNavigation';
import { useFlowHandlers } from '@/components/flow/FlowHandlers';
import { useSurveyConfirmationHandler } from '@/components/flow/SurveyConfirmationHandler';

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

  // Initialize hooks
  const navigation = useFlowNavigation({ currentStep, onStepChange });
  
  const handlers = useFlowHandlers({
    onStepChange,
    onUserDataUpdate,
    setShowSurveyConfirmation,
    setPendingSurveyStart,
  });

  const surveyConfirmation = useSurveyConfirmationHandler({
    showSurveyConfirmation,
    pendingSurveyStart,
    onStepChange,
    setShowSurveyConfirmation,
  });

  return (
    <>
      {/* Survey Confirmation Modal */}
      <SurveyConfirmationModal
        open={showSurveyConfirmation}
        onClose={surveyConfirmation.handleSurveyCancel}
        onStartSurvey={surveyConfirmation.handleSurveyConfirm}
      />

      {/* Main Flow Content */}
      <FlowRenderer
        currentStep={currentStep}
        userData={userData}
        onRestart={onRestart}
        handlers={handlers}
        navigation={navigation}
      />
    </>
  );
};

export default FlowManager;
