
import React, { useState } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import FlowManager, { FlowStep, UserData } from '@/components/FlowManager';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('welcome');
  const [userData, setUserData] = useState<UserData>({});

  const handleWelcomeStart = () => {
    setCurrentStep('department');
  };

  const handleUserDataUpdate = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const handleRestart = () => {
    setUserData({});
    setCurrentStep('welcome');
  };

  if (currentStep === 'welcome') {
    return <WelcomeScreen onStart={handleWelcomeStart} />;
  }

  return (
    <FlowManager
      currentStep={currentStep}
      userData={userData}
      onStepChange={setCurrentStep}
      onUserDataUpdate={handleUserDataUpdate}
      onRestart={handleRestart}
    />
  );
};

export default Index;
