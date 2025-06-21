
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Building2 } from 'lucide-react';

interface DepartmentSelectorProps {
  departments: string[];
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
  loading: boolean;
}

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({
  departments,
  selectedDepartment,
  onDepartmentChange,
  loading
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-growpoint-dark font-medium flex items-center gap-2">
        <Building2 className="w-4 h-4" />
        Department
        <span className="text-xs text-gray-500">({departments.length} available)</span>
      </Label>
      <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
        <SelectTrigger className="border-growpoint-accent/30 focus:border-growpoint-primary bg-white">
          <SelectValue placeholder={
            departments.length === 0 
              ? "No departments found" 
              : "Select your department"
          } />
        </SelectTrigger>
        <SelectContent className="bg-white border shadow-lg max-h-60 overflow-y-auto z-50">
          {departments.length === 0 ? (
            <div className="p-3 text-center text-gray-500">
              No departments available
            </div>
          ) : (
            departments.map((dept) => (
              <SelectItem key={dept} value={dept} className="hover:bg-gray-50">
                {dept}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {departments.length === 0 && !loading && (
        <p className="text-xs text-gray-500">
          Debug: {departments.length} departments loaded
        </p>
      )}
    </div>
  );
};

export default DepartmentSelector;
