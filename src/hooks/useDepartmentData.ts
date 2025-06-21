
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDepartmentData = () => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [employees, setEmployees] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

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
      toast.error("Failed to load departments. Please try again.");
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
      toast.error("Failed to load employees. Please try again.");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return {
    departments,
    employees,
    loading,
    fetchError,
    fetchDepartments,
    fetchEmployees,
    setEmployees
  };
};
