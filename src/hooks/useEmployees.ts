
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmployeeNameResult {
  Employee_Name: string | null;
}

export const useEmployees = () => {
  const [employees, setEmployees] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEmployees = async (department: string) => {
    if (!department) {
      setEmployees([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: employeeData, error: fetchError } = await supabase
        .from('employees')
        .select('Employee_Name')
        .eq('Department', department)
        .not('Employee_Name', 'is', null);

      if (fetchError) throw fetchError;

      if (employeeData && Array.isArray(employeeData)) {
        const employeeNames = (employeeData as EmployeeNameResult[])
          .map(item => item.Employee_Name?.trim())
          .filter((name): name is string => Boolean(name))
          .sort();
        
        setEmployees(employeeNames);
      }
    } catch (fetchError) {
      console.error('Error fetching employees:', fetchError);
      const errorMessage = "Failed to load employees. Please try again.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetEmployees = () => {
    setEmployees([]);
    setError(null);
  };

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    resetEmployees
  };
};
