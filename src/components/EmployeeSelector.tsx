
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';

interface EmployeeSelectorProps {
  employees: string[];
  selectedEmployee: string;
  onEmployeeChange: (employee: string) => void;
  selectedDepartment: string;
}

const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
  employees,
  selectedEmployee,
  onEmployeeChange,
  selectedDepartment
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-growpoint-dark font-medium flex items-center gap-2">
        <User className="w-4 h-4" />
        Employee Name
      </Label>
      <Select 
        value={selectedEmployee} 
        onValueChange={onEmployeeChange}
        disabled={!selectedDepartment}
      >
        <SelectTrigger className="border-growpoint-accent/30 focus:border-growpoint-primary bg-white">
          <SelectValue placeholder={selectedDepartment ? "Select your name" : "Select department first"} />
        </SelectTrigger>
        <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto z-50">
          {employees.map((employee) => (
            <SelectItem key={employee} value={employee} className="hover:bg-gray-50">
              {employee}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EmployeeSelector;
