
import { FlowStep, UserData } from '@/components/FlowManager';

interface FlowHandlersProps {
  onStepChange: (step: FlowStep) => void;
  onUserDataUpdate: (data: Partial<UserData>) => void;
  setShowSurveyConfirmation: (show: boolean) => void;
  setPendingSurveyStart: (fn: () => void) => void;
}

export const useFlowHandlers = ({
  onStepChange,
  onUserDataUpdate,
  setShowSurveyConfirmation,
  setPendingSurveyStart,
}: FlowHandlersProps) => {
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

  const handleQuestionnaireChoice = (data: any) => {
    // Show confirmation modal for HR/Admin users choosing to fill questionnaire
    setPendingSurveyStart(() => () => {
      onUserDataUpdate(data);
      onStepChange('survey');
    });
    setShowSurveyConfirmation(true);
  };

  return {
    handleIdentificationContinue,
    handleDepartmentContinue,
    handleNavigateToHRChoice,
    handleNavigateToAdminChoice,
    handleNavigateToHR,
    handleNavigateToManager,
    handleNavigateToThankYou,
    handleSurveyContinue,
    handleQuestionnaireChoice,
  };
};
