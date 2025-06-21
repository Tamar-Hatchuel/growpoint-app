
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Building2, User, IdCard } from 'lucide-react';

interface DepartmentSelectionScreenProps {
  onBack: () => void;
  onContinue: (data: { department: string; employee: string; employeeId: string }) => void;
}

const departments = {
  'Engineering': ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Eve Brown'],
  'Marketing': ['Frank Miller', 'Grace Taylor', 'Henry Anderson', 'Ivy Thomas', 'Jack Jackson'],
  'Sales': ['Karen White', 'Liam Harris', 'Mia Martin', 'Noah Thompson', 'Olivia Garcia'],
  'Product': ['Paul Rodriguez', 'Quinn Lewis', 'Ruby Lee', 'Sam Walker', 'Tina Hall'],
  'Design': ['Uma Allen', 'Victor Young', 'Wendy King', 'Xander Wright', 'Yara Lopez']
};

const DepartmentSelectionScreen: React.FC<DepartmentSelectionScreenProps> = ({ onBack, onContinue }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [employeeIdError, setEmployeeIdError] = useState('');

  const validateEmployeeId = (id: string) => {
    const regex = /^\d{5}$/;
    if (!regex.test(id)) {
      setEmployeeIdError('Employee ID must be exactly 5 digits');
      return false;
    }
    setEmployeeIdError('');
    return true;
  };

  const handleEmployeeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmployeeId(value);
    if (value) {
      validateEmployeeId(value);
    } else {
      setEmployeeIdError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDepartment && selectedEmployee && employeeId && validateEmployeeId(employeeId)) {
      onContinue({
        department: selectedDepartment,
        employee: selectedEmployee,
        employeeId: employeeId
      });
    }
  };

  const availableEmployees = selectedDepartment ? departments[selectedDepartment as keyof typeof departments] : [];

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
        
        <Card className="border-growpoint-accent/20 shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-growpoint-dark">
              Identify Yourself
            </CardTitle>
            <CardDescription className="text-growpoint-dark/70">
              Help us connect you with your team for personalized insights
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-growpoint-dark font-medium flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Department
                </Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="border-growpoint-accent/30 focus:border-growpoint-primary">
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(departments).map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-growpoint-dark font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Employee Name
                </Label>
                <Select 
                  value={selectedEmployee} 
                  onValueChange={setSelectedEmployee}
                  disabled={!selectedDepartment}
                >
                  <SelectTrigger className="border-growpoint-accent/30 focus:border-growpoint-primary">
                    <SelectValue placeholder={selectedDepartment ? "Select your name" : "Select department first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEmployees.map((employee) => (
                      <SelectItem key={employee} value={employee}>{employee}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-growpoint-dark font-medium flex items-center gap-2">
                  <IdCard className="w-4 h-4" />
                  Employee ID
                </Label>
                <Input
                  type="text"
                  placeholder="Enter 5-digit Employee ID"
                  value={employeeId}
                  onChange={handleEmployeeIdChange}
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
              
              <Button
                type="submit"
                className="w-full bg-growpoint-primary hover:bg-growpoint-accent text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                disabled={!selectedDepartment || !selectedEmployee || !employeeId || !!employeeIdError}
              >
                Continue to Survey
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DepartmentSelectionScreen;
