
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IdCard } from 'lucide-react';

interface EmployeeIdInputProps {
  employeeId: string;
  employeeIdError: string;
  onEmployeeIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmployeeIdInput: React.FC<EmployeeIdInputProps> = ({
  employeeId,
  employeeIdError,
  onEmployeeIdChange
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-growpoint-dark font-medium flex items-center gap-2">
        <IdCard className="w-4 h-4" />
        Employee ID
      </Label>
      <Input
        type="text"
        placeholder="Enter 5-digit Employee ID"
        value={employeeId}
        onChange={onEmployeeIdChange}
        className={`border-growpoint-accent/30 focus:border-growpoint-primary ${employeeIdError ? 'border-red-500' : ''}`}
        maxLength={5}
        required
      />
      {employeeIdError && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          ❌ {employeeIdError}
        </p>
      )}
    </div>
  );
};

export default EmployeeIdInput;
