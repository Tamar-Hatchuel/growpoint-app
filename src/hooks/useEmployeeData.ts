
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useEmployeeData = () => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [employees, setEmployees] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchDepartments = async () => {
    try {
      // Use DISTINCT and TRIM to get clean, unique department names
      const { data, error } = await supabase
        .rpc('get_clean_departments');

      if (error) {
        // Fallback to regular query if RPC doesn't exist
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('employees')
          .select('Department')
          .not('Department', 'is', null);

        if (fallbackError) throw fallbackError;

        if (fallbackData) {
          const uniqueDepartments = [...new Set(
            fallbackData
              .map(item => item.Department?.trim())
              .filter(Boolean)
          )].sort();
          
          setDepartments(uniqueDepartments);
        }
      } else {
        if (data) {
          setDepartments(data.map((item: any) => item.department_name).sort());
        }
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      
      // Try one more fallback approach
      try {
        const { data, error: finalError } = await supabase
          .from('employees')
          .select('Department')
          .not('Department', 'is', null);

        if (finalError) throw finalError;

        if (data) {
          const uniqueDepartments = [...new Set(
            data
              .map(item => item.Department?.trim())
              .filter(Boolean)
          )].sort();
          
          setDepartments(uniqueDepartments);
        }
      } catch (finalError) {
        console.error('Final error fetching departments:', finalError);
        toast({
          title: "Error",
          description: "Failed to load departments. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const fetchEmployees = async (department: string) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('Employee_Name')
        .eq('Department', department)
        .not('Employee_Name', 'is', null);

      if (error) throw error;

      if (data) {
        const employeeNames = data
          .map(item => item.Employee_Name?.trim())
          .filter(Boolean)
          .sort();
        
        setEmployees(employeeNames);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Error",
        description: "Failed to load employees. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return {
    departments,
    employees,
    fetchEmployees,
    setEmployees
  };
};
