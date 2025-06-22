
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DepartmentRpcResult {
  department_name: string;
}

interface DepartmentResult {
  Department: string | null;
}

export const useDepartments = () => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);

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
            (fallbackData as DepartmentResult[])
              .map(item => item.Department?.trim())
              .filter((dept): dept is string => Boolean(dept))
          )].sort();
          
          setDepartments(uniqueDepartments);
        }
      } else {
        if (rpcData && Array.isArray(rpcData)) {
          const departmentNames = (rpcData as DepartmentRpcResult[])
            .map(item => item.department_name)
            .filter((dept): dept is string => Boolean(dept))
            .sort();
          setDepartments(departmentNames);
        }
      }
    } catch (fetchError) {
      console.error('Error fetching departments:', fetchError);
      
      // Try one more fallback approach
      try {
        const { data: finalData, error: finalError } = await supabase
          .from('employees')
          .select('Department')
          .not('Department', 'is', null);

        if (finalError) throw finalError;

        if (finalData && Array.isArray(finalData)) {
          const uniqueDepartments = [...new Set(
            (finalData as DepartmentResult[])
              .map(item => item.Department?.trim())
              .filter((dept): dept is string => Boolean(dept))
          )].sort();
          
          setDepartments(uniqueDepartments);
        }
      } catch (finalError) {
        console.error('Final error fetching departments:', finalError);
        const errorMessage = "Failed to load departments. Please try again.";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return {
    departments,
    loading,
    error,
    refetch: fetchDepartments
  };
};
