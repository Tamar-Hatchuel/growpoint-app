
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useEmployeeAuth } from '@/hooks/useEmployeeAuth';
import { validateEmployeeId } from '@/utils/employeeValidation';
import DepartmentSelector from '@/components/forms/DepartmentSelector';
import EmployeeSelector from '@/components/forms/EmployeeSelector';
import EmployeeIdInput from '@/components/forms/EmployeeIdInput';

interface DepartmentSelectionScreenProps {
  onBack: () => void;
  onContinue: (data: { department: string; employee: string; employeeId: string }) => void;
  onNavigateToHR: () => void;
  onNavigateToManager: () => void;
  onNavigateToThankYou: () => void;
  onNavigateToHRChoice: (userData: any) => void;
  onNavigateToAdminChoice: (userData: any) => void;
}

const DepartmentSelectionScreen: React.FC<DepartmentSelectionScreenProps> = ({ 
  onBack, 
  onContinue, 
  onNavigateToHR, 
  onNavigateToManager, 
  onNavigateToThankYou,
  onNavigateToHRChoice,
  onNavigateToAdminChoice
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [employeeIdError, setEmployeeIdError] = useState('');

  const { 
    departments, 
    employees, 
    fetchEmployees, 
    setEmployees,
    departmentsLoading,
    employeesLoading 
  } = useEmployeeData();
  
  const { authenticateUser, isLoading } = useEmployeeAuth();

  // Fetch employees when department changes
  useEffect(() => {
    if (selectedDepartment) {
      fetchEmployees(selectedDepartment);
      setSelectedEmployee(''); // Reset employee selection
    } else {
      setEmployees([]); // Clear employees when no department selected
    }
  }, [selectedDepartment]);

  const handleEmployeeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmployeeId(value);
    
    if (value) {
      const validation = validateEmployeeId(value);
      setEmployeeIdError(validation.error);
    } else {
      setEmployeeIdError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateEmployeeId(employeeId);
    
    if (!selectedDepartment || !selectedEmployee || !employeeId || !validation.isValid) {
      return;
    }

    await authenticateUser({
      selectedDepartment,
      selectedEmployee,
      employeeId,
      onContinue,
      onNavigateToHRChoice,
      onNavigateToAdminChoice
    });
  };

  const isFormValid = selectedDepartment && selectedEmployee && employeeId && !employeeIdError;
  const isFormLoading = departmentsLoading || employeesLoading || isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-growpoint-soft via-white to-growpoint-primary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-growpoint-dark hover:text-growpoint-accent hover:bg-growpoint-soft/50 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/d7cd3b1a-3e3c-49c7-8986-3d60c7901948.png" 
            alt="GrowPoint" 
            className="w-16 h-16 md:w-20 md:h-20 object-contain" 
            style={{ background: 'transparent' }}
          />
        </div>
        
        <Card className="border-growpoint-accent/20 shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl md:text-2xl font-bold text-growpoint-dark">
              Identify Yourself
            </CardTitle>
            <CardDescription className="text-growpoint-dark/70">
              Help us connect you with your team for personalized insights
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <DepartmentSelector
                departments={departments}
                selectedDepartment={selectedDepartment}
                onDepartmentChange={setSelectedDepartment}
              />
              
              <EmployeeSelector
                employees={employees}
                selectedEmployee={selectedEmployee}
                selectedDepartment={selectedDepartment}
                onEmployeeChange={setSelectedEmployee}
              />
              
              <EmployeeIdInput
                employeeId={employeeId}
                employeeIdError={employeeIdError}
                onEmployeeIdChange={handleEmployeeIdChange}
              />
              
              <Button
                type="submit"
                className="w-full bg-growpoint-primary hover:bg-growpoint-accent text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] min-h-[48px]"
                disabled={!isFormValid || isFormLoading}
              >
                {isFormLoading ? 'Loading...' : 'Continue'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DepartmentSelectionScreen;
