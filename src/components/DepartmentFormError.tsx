
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface DepartmentFormErrorProps {
  fetchError: string;
  onRetry: () => void;
}

const DepartmentFormError: React.FC<DepartmentFormErrorProps> = ({ fetchError, onRetry }) => {
  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
      <AlertCircle className="w-4 h-4" />
      <span className="text-sm">{fetchError}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRetry}
        className="ml-auto text-red-700 hover:text-red-800"
      >
        Retry
      </Button>
    </div>
  );
};

export default DepartmentFormError;
