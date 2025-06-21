
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Filter } from 'lucide-react';

interface DepartmentFilterProps {
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

const departments = [
  { value: 'all', label: 'All Departments' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'support', label: 'Support' },
  { value: 'operations', label: 'Operations' },
];

const dateRanges = [
  { value: 'last-7-days', label: 'Last 7 days' },
  { value: 'last-30-days', label: 'Last 30 days' },
  { value: 'last-90-days', label: 'Last 3 months' },
  { value: 'last-6-months', label: 'Last 6 months' },
  { value: 'last-year', label: 'Last year' },
];

const DepartmentFilter: React.FC<DepartmentFilterProps> = ({
  selectedDepartment,
  onDepartmentChange,
  dateRange,
  onDateRangeChange,
}) => {
  return (
    <Card className="border-growpoint-accent/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-growpoint-primary" />
            <span className="text-sm font-medium text-growpoint-dark">Filters:</span>
          </div>
          
          <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
            <SelectTrigger className="w-40 border-growpoint-accent/30">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent className="bg-white border-growpoint-accent/30">
              {departments.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-growpoint-primary" />
            <Select value={dateRange} onValueChange={onDateRangeChange}>
              <SelectTrigger className="w-36 border-growpoint-accent/30">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent className="bg-white border-growpoint-accent/30">
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectContent>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentFilter;
