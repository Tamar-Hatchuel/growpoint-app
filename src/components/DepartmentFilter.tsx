
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useDepartmentFilter } from '@/hooks/useDepartmentFilter';

interface DepartmentFilterProps {
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

const DepartmentFilter: React.FC<DepartmentFilterProps> = ({
  selectedDepartment,
  onDepartmentChange,
  dateRange,
  onDateRangeChange
}) => {
  const { departments, loading, error } = useDepartmentFilter();

  if (loading) {
    return (
      <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-growpoint-accent/20">
        <div className="animate-pulse">Loading filters...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-growpoint-accent/20">
        <div className="text-red-600">Error loading departments</div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-growpoint-accent/20">
      <div className="flex flex-col gap-2">
        <Label htmlFor="department-filter" className="text-sm font-medium text-growpoint-dark">
          Filter by Department
        </Label>
        <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
          <SelectTrigger id="department-filter" className="w-48 border-growpoint-accent/30">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-col gap-2">
        <Label htmlFor="date-range-filter" className="text-sm font-medium text-growpoint-dark">
          Time Period
        </Label>
        <Select value={dateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger id="date-range-filter" className="w-48 border-growpoint-accent/30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-7-days">Last 7 Days</SelectItem>
            <SelectItem value="last-30-days">Last 30 Days</SelectItem>
            <SelectItem value="last-90-days">Last 90 Days</SelectItem>
            <SelectItem value="all-time">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DepartmentFilter;
