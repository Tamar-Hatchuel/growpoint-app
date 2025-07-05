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
  const {
    departments,
    loading,
    error
  } = useDepartmentFilter();
  if (loading) {
    return <div className="flex items-center gap-2">
        <div className="animate-pulse text-xs text-growpoint-dark">Loading...</div>
      </div>;
  }
  if (error) {
    return <div className="flex items-center gap-2">
        <div className="text-red-600 text-xs">Error loading</div>
      </div>;
  }
  return <div className="flex items-center gap-2">
      <div className="flex flex-col gap-1">
        
        <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
          <SelectTrigger id="department-filter" className="h-8 w-36 text-xs border-growpoint-accent/30">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map(dept => <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-col gap-1">
        
        <Select value={dateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger id="date-range-filter" className="h-8 w-32 text-xs border-growpoint-accent/30">
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
    </div>;
};
export default DepartmentFilter;