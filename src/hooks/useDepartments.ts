
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

      const { data, error: fetchError } = await supabase
        .from('employees')
        .select('Department')
        .not('Department', 'is', null);

      if (fetchError) throw fetchError;

      if (data && Array.isArray(data)) {
        // 1. Trim (string | undefined)[]
        const trimmed: (string | undefined)[] = data.map(item =>
          item.Department?.trim()
        );
        // 2. Remove null/undefined
        const nonNull: (string | undefined)[] = trimmed.filter(
          (d): d is string | undefined => d != null
        );
        // 3. Remove empty strings
        const nonEmpty: string[] = nonNull.filter((d): d is string =>
          d && d.trim().length > 0
        );
        // 4. Dedupe & sort
        const unique = Array.from(new Set(nonEmpty)).sort();

        setDepartments(unique);
      }
    } catch (fetchError) {
      console.error('Error fetching departments:', fetchError);
      const errorMessage = 'Failed to load departments. Please try again.';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
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
    refetch: fetchDepartments,
  };
};
