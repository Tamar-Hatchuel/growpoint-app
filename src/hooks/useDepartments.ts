
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DepartmentRpcResult {
  department_name: string;
}

interface DepartmentResult {
  Department: string | null;
}

// Robust type guard to handle null/undefined and empty strings
const isDepartmentString = (dept: string | null | undefined): dept is string => {
  return typeof dept === 'string' && dept.trim().length > 0;
};

// Process RPC data consistently
const processRpcData = (data: DepartmentRpcResult[]): string[] => {
  return data
    .map(item => item.department_name)
    .filter(isDepartmentString)
    .sort();
};

// Process fallback data consistently with deduplication
const processFallbackData = (data: DepartmentResult[]): string[] => {
  const departments = data
    .map(item => item.Department?.trim())
    .filter(isDepartmentString);
  
  // Deduplicate using Set
  return [...new Set(departments)].sort();
};

export const useDepartments = () => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use RPC with explicit typing
      const { data: rpcData, error: rpcError } = await supabase
        .rpc<DepartmentRpcResult[]>('get_clean_departments');

      if (rpcError) {
        console.log('RPC call failed, using fallback method');
        // Fallback to regular query if RPC doesn't exist
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('employees')
          .select('Department')
          .not('Department', 'is', null);

        if (fallbackError) throw fallbackError;

        if (fallbackData && Array.isArray(fallbackData)) {
          const uniqueDepartments = processFallbackData(fallbackData as DepartmentResult[]);
          setDepartments(uniqueDepartments);
        }
      } else {
        if (rpcData && Array.isArray(rpcData)) {
          const departmentNames = processRpcData(rpcData as DepartmentRpcResult[]);
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
          const uniqueDepartments = processFallbackData(finalData as DepartmentResult[]);
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
