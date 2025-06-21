
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from 'lucide-react';

interface EmployeeSelectorProps {
  employees: string[];
  selectedEmployee: string;
  selectedDepartment: string;
  onEmployeeChange: (value: string) => void;
}

const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
  employees,
  selectedEmployee,
  selectedDepartment,
  onEmployeeChange
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-growpoint-dark font-medium flex items-center gap-2">
        <User className="w-4 h-4" />
        Select Your Name
      </Label>
      <Select 
        value={selectedEmployee} 
        onValueChange={onEmployeeChange}
        disabled={!selectedDepartment}
      >
        <SelectTrigger className="border-growpoint-accent/30 focus:border-growpoint-primary">
          <SelectValue placeholder={selectedDepartment ? "Select your name" : "Select department first"} />
        </SelectTrigger>
        <SelectContent>
          {employees.map((employee) => (
            <SelectItem key={employee} value={employee}>{employee}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EmployeeSelector;
