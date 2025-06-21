
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import DepartmentSelectionForm from './DepartmentSelectionForm';

interface DepartmentSelectionScreenProps {
  onBack: () => void;
  onContinue: (data: { department: string; employee: string; employeeId: string; role: string }) => void;
}

const DepartmentSelectionScreen: React.FC<DepartmentSelectionScreenProps> = ({ onBack, onContinue }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-growpoint-dark hover:text-growpoint-accent hover:bg-growpoint-soft/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <DepartmentSelectionForm onContinue={onContinue} />
      </div>
    </div>
  );
};

export default DepartmentSelectionScreen;
