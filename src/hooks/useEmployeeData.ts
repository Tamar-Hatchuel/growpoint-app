
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useEmployeeData = () => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [employees, setEmployees] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('Department')
        .not('Department', 'is', null);

      if (error) throw error;

      const uniqueDepartments = [...new Set(data.map(item => item.Department))].filter(Boolean);
      setDepartments(uniqueDepartments);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast({
        title: "Error",
        description: "Failed to load departments. Please try again.",
        variant: "destructive",
      });
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

      const employeeNames = data.map(item => item.Employee_Name).filter(Boolean);
      setEmployees(employeeNames);
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
