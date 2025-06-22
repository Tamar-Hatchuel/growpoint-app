
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Employee {
  Employee_Name: string;
  Department: string;
  'Employee ID': number;
  Permission: string;
}

interface DepartmentRpcResult {
  department_name: string;
}

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
        console.log('RPC call failed, using fallback method');
        // Fallback to regular query if RPC doesn't exist
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('employees')
          .select('Department')
          .not('Department', 'is', null);

        if (fallbackError) throw fallbackError;

        if (fallbackData && Array.isArray(fallbackData)) {
          const uniqueDepartments = [...new Set(
            fallbackData
              .map((item: { Department: string | null }) => item.Department?.trim())
              .filter((dept): dept is string => Boolean(dept))
          )].sort();
          
          setDepartments(uniqueDepartments);
        }
      } else {
        if (rpcData && Array.isArray(rpcData)) {
          const departmentNames = (rpcData as DepartmentRpcResult[])
            .map(item => item.department_name)
            .filter(Boolean)
            .sort();
          setDepartments(departmentNames);
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
              .map((item: { Department: string | null }) => item.Department?.trim())
              .filter((dept): dept is string => Boolean(dept))
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
      const { data: employeeData, error } = await supabase
        .from('employees')
        .select('Employee_Name')
        .eq('Department', department)
        .not('Employee_Name', 'is', null);

      if (error) throw error;

      if (employeeData && Array.isArray(employeeData)) {
        const employeeNames = employeeData
          .map((item: { Employee_Name: string | null }) => item.Employee_Name?.trim())
          .filter((name): name is string => Boolean(name))
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
