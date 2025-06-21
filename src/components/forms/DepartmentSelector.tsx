
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';

interface DepartmentSelectorProps {
  departments: string[];
  selectedDepartment: string;
  onDepartmentChange: (value: string) => void;
}

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({
  departments,
  selectedDepartment,
  onDepartmentChange
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-growpoint-dark font-medium flex items-center gap-2">
        <Building2 className="w-4 h-4" />
        Select Your Department
      </Label>
      <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
        <SelectTrigger className="border-growpoint-accent/30 focus:border-growpoint-primary">
          <SelectValue placeholder="Select your department" />
        </SelectTrigger>
        <SelectContent>
          {departments.map((dept) => (
            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DepartmentSelector;
