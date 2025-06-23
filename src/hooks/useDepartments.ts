
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DepartmentRpcResult {
  department_name: string;
}

interface DepartmentResult {
  Department: string | null;
}

// Standalone type guard that TypeScript can recognize
const isNonEmptyString = (d: string | null | undefined): d is string =>
  typeof d === 'string' && d.trim().length > 0;

export const useDepartments = () => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use RPC call without explicit generics to avoid constraint issues
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_clean_departments');

      if (rpcError) {
        console.log('RPC call failed, using fallback method');
        // Fallback to regular query
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('employees')
          .select('Department')
          .not('Department', 'is', null);

        if (fallbackError) throw fallbackError;

        if (fallbackData && Array.isArray(fallbackData)) {
          // Separate map and filter steps for clarity
          const trimmed = (fallbackData as DepartmentResult[])
            .map(item => item.Department?.trim());
          const filtered = trimmed.filter(isNonEmptyString);
          const unique = Array.from(new Set(filtered)).sort();
          setDepartments(unique);
        }
      } else {
        if (rpcData && Array.isArray(rpcData)) {
          // Separate map and filter for RPC data
          const names = (rpcData as DepartmentRpcResult[])
            .map(item => item.department_name);
          const valid = names.filter(isNonEmptyString);
          setDepartments(valid.sort());
        }
      }
    } catch (fetchError) {
      console.error('Error fetching departments:', fetchError);
      
      // Final fallback approach
      try {
        const { data: finalData, error: finalError } = await supabase
          .from('employees')
          .select('Department')
          .not('Department', 'is', null);

        if (finalError) throw finalError;

        if (finalData && Array.isArray(finalData)) {
          const trimmed = (finalData as DepartmentResult[])
            .map(item => item.Department?.trim());
          const filtered = trimmed.filter(isNonEmptyString);
          const unique = Array.from(new Set(filtered)).sort();
          setDepartments(unique);
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
