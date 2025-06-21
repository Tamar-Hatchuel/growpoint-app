
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DepartmentSelector from './DepartmentSelector';
import EmployeeSelector from './EmployeeSelector';
import EmployeeIdInput from './EmployeeIdInput';

interface DepartmentSelectionFormProps {
  onContinue: (data: { department: string; employee: string; employeeId: string; role: string }) => void;
}

const DepartmentSelectionForm: React.FC<DepartmentSelectionFormProps> = ({ onContinue }) => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [employees, setEmployees] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [employeeIdError, setEmployeeIdError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Fetch employees when department changes
  useEffect(() => {
    if (selectedDepartment) {
      fetchEmployees(selectedDepartment);
      setSelectedEmployee(''); // Reset employee selection
    } else {
      setEmployees([]);
    }
  }, [selectedDepartment]);

  const showErrorToast = (description: string) => {
    toast({
      title: "Error",
      description,
      variant: "destructive" as const,
    });
  };

  const fetchDepartments = async () => {
    console.log('🔍 Starting fetchDepartments...');
    setLoading(true);
    setFetchError(null);
    
    try {
      console.log('📡 Making Supabase query for departments...');
      const { data, error } = await supabase
        .from('employees')
        .select('"Team/Department"')
        .not('"Team/Department"', 'is', null);

      console.log('📊 Raw Supabase response:', { data, error });

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }

      if (!data) {
        console.warn('⚠️ No data returned from Supabase');
        setDepartments([]);
        setFetchError('No data found');
        return;
      }

      console.log(`📝 Processing ${data.length} records...`);
      
      // Get unique departments and filter out null/empty values
      const allDepartments = data.map(item => item['Team/Department']).filter(Boolean);
      console.log('🏢 All departments (before unique):', allDepartments);
      
      const uniqueDepartments = [...new Set(allDepartments)];
      console.log('🎯 Unique departments:', uniqueDepartments);
      
      setDepartments(uniqueDepartments);
      
      if (uniqueDepartments.length === 0) {
        setFetchError('No departments found in database');
        console.warn('⚠️ No departments found after processing');
      } else {
        console.log(`✅ Successfully loaded ${uniqueDepartments.length} departments`);
      }
      
    } catch (error) {
      console.error('💥 Error in fetchDepartments:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setFetchError(`Failed to load departments: ${errorMessage}`);
      showErrorToast("Failed to load departments. Please try again.");
    } finally {
      setLoading(false);
      console.log('🏁 fetchDepartments completed, loading set to false');
    }
  };

  const fetchEmployees = async (department: string) => {
    console.log(`👥 Fetching employees for department: ${department}`);
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('"Employee Name"')
        .eq('"Team/Department"', department)
        .not('"Employee Name"', 'is', null);

      console.log(`📊 Employees query result:`, { data, error });

      if (error) throw error;

      const employeeNames = data?.map(item => item['Employee Name']).filter(Boolean) || [];
      console.log(`👤 Found ${employeeNames.length} employees:`, employeeNames);
      setEmployees(employeeNames);
    } catch (error) {
      console.error('💥 Error fetching employees:', error);
      showErrorToast("Failed to load employees. Please try again.");
    }
  };

  const validateEmployeeId = (id: string): boolean => {
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
    // Only allow digits
    if (value === '' || /^\d+$/.test(value)) {
      setEmployeeId(value);
      if (value) {
        validateEmployeeId(value);
      } else {
        setEmployeeIdError('');
      }
    }
  };

  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department);
  };

  const handleEmployeeChange = (employee: string) => {
    setSelectedEmployee(employee);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedDepartment || !selectedEmployee || !employeeId || !validateEmployeeId(employeeId)) {
      return;
    }

    setSubmitting(true);

    try {
      // Query Supabase to find the user and get their role
      const { data, error } = await supabase
        .from('employees')
        .select('Role')
        .eq('"Team/Department"', selectedDepartment)
        .eq('"Employee Name"', selectedEmployee)
        .eq('"Employee ID"', parseInt(employeeId))
        .single();

      if (error || !data) {
        toast({
          title: "Invalid Credentials",
          description: "No matching employee found. Please check your details.",
          variant: "destructive" as const,
        });
        return;
      }

      // Successfully found user, proceed with their role
      onContinue({
        department: selectedDepartment,
        employee: selectedEmployee,
        employeeId: employeeId,
        role: data.Role
      });

    } catch (error) {
      console.error('Error verifying employee:', error);
      showErrorToast("Failed to verify employee details. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
    return (
      <Card className="border-growpoint-accent/20 shadow-lg">
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-growpoint-primary" />
          <p className="text-growpoint-dark">Loading departments...</p>
        </CardContent>
      </Card>
    );
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
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{fetchError}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchDepartments}
              className="ml-auto text-red-700 hover:text-red-800"
            >
              Retry
            </Button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <DepartmentSelector
            departments={departments}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={handleDepartmentChange}
            loading={loading}
          />
          
          <EmployeeSelector
            employees={employees}
            selectedEmployee={selectedEmployee}
            onEmployeeChange={handleEmployeeChange}
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
