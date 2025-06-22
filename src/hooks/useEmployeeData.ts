
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
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_clean_departments');

      if (rpcError) {
        // Fallback to regular query if RPC doesn't exist
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('employees')
          .select('Department')
          .not('Department', 'is', null);

        if (fallbackError) throw fallbackError;

        if (fallbackData && Array.isArray(fallbackData)) {
          const uniqueDepartments = [...new Set(
            fallbackData
              .map((item: any) => item.Department?.trim())
              .filter(Boolean)
          )].sort();
          
          setDepartments(uniqueDepartments as string[]);
        }
      } else {
        if (rpcData && Array.isArray(rpcData)) {
          setDepartments(rpcData.map((item: any) => item.department_name).sort());
        }
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      
      // Try one more fallback approach
      try {
        const { data: finalData, error: finalError } = await supabase
          .from('employees')
          .select('Department')
          .not('Department', 'is', null);

        if (finalError) throw finalError;

        if (finalData && Array.isArray(finalData)) {
          const uniqueDepartments = [...new Set(
            finalData
              .map((item: any) => item.Department?.trim())
              .filter(Boolean)
          )].sort();
          
          setDepartments(uniqueDepartments as string[]);
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
      const { data: employeeData, error } = await supabase
        .from('employees')
        .select('Employee_Name')
        .eq('Department', department)
        .not('Employee_Name', 'is', null);

      if (error) throw error;

      if (employeeData && Array.isArray(employeeData)) {
        const employeeNames = employeeData
          .map((item: any) => item.Employee_Name?.trim())
          .filter(Boolean)
          .sort();
        
        setEmployees(employeeNames as string[]);
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
