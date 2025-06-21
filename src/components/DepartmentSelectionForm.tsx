
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useDepartmentData } from '@/hooks/useDepartmentData';
import { useDepartmentForm } from '@/hooks/useDepartmentForm';
import { verifyEmployee } from '@/utils/employeeVerification';
import DepartmentSelector from './DepartmentSelector';
import EmployeeSelector from './EmployeeSelector';
import EmployeeIdInput from './EmployeeIdInput';
import DepartmentFormLoading from './DepartmentFormLoading';
import DepartmentFormError from './DepartmentFormError';

interface DepartmentSelectionFormProps {
  onContinue: (data: { department: string; employee: string; employeeId: string; role: string }) => void;
}

const DepartmentSelectionForm: React.FC<DepartmentSelectionFormProps> = ({ onContinue }) => {
  const { 
    departments, 
    employees, 
    loading, 
    fetchError, 
    fetchDepartments, 
    fetchEmployees, 
    setEmployees 
  } = useDepartmentData();

  const {
    selectedDepartment,
    setSelectedDepartment,
    selectedEmployee,
    setSelectedEmployee,
    employeeId,
    employeeIdError,
    submitting,
    setSubmitting,
    validateEmployeeId,
    handleEmployeeIdChange
  } = useDepartmentForm(fetchEmployees, setEmployees);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedDepartment || !selectedEmployee || !employeeId || !validateEmployeeId(employeeId)) {
      return;
    }

    setSubmitting(true);

    const result = await verifyEmployee(selectedDepartment, selectedEmployee, employeeId);
    
    if (result) {
      onContinue(result);
    }
    
    setSubmitting(false);
  };

  // Debug render state
  console.log('🎨 Form render state:', { 
    loading, 
    departmentsCount: departments.length, 
    departments, 
    fetchError,
    selectedDepartment 
  });

  if (loading) {
    return <DepartmentFormLoading />;
  }

  return (
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
        {fetchError && (
          <DepartmentFormError 
            fetchError={fetchError} 
            onRetry={fetchDepartments} 
          />
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <DepartmentSelector
            departments={departments}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
            loading={loading}
          />
          
          <EmployeeSelector
            employees={employees}
            selectedEmployee={selectedEmployee}
            onEmployeeChange={setSelectedEmployee}
            selectedDepartment={selectedDepartment}
          />
          
          <EmployeeIdInput
            employeeId={employeeId}
            employeeIdError={employeeIdError}
            onEmployeeIdChange={handleEmployeeIdChange}
          />
          
          <Button
            type="submit"
            className="w-full bg-growpoint-primary hover:bg-growpoint-accent text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
            disabled={!selectedDepartment || !selectedEmployee || !employeeId || !!employeeIdError || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DepartmentSelectionForm;
