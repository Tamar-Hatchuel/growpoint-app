
import React from 'react';
import { FlowStep } from '@/components/FlowManager';

interface FlowNavigationProps {
  currentStep: FlowStep;
  onStepChange: (step: FlowStep) => void;
}

export const useFlowNavigation = ({ currentStep, onStepChange }: FlowNavigationProps) => {
  const goBack = (step: FlowStep) => {
    onStepChange(step);
  };

  const navigateToStep = (step: FlowStep) => {
    onStepChange(step);
  };

  return {
    goBack,
    navigateToStep,
  };
};
