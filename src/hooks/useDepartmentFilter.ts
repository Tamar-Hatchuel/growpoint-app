
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useDepartmentFilter = () => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('employees')
          .select('Department')
          .not('Department', 'is', null)
          .order('Department');

        if (error) {
          console.error('Error fetching departments:', error);
          setError(error.message);
        } else {
          // Extract unique department names
          const uniqueDepartments = [...new Set(data.map(item => item.Department).filter(Boolean))];
          setDepartments(uniqueDepartments);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return {
    departments,
    selectedDepartment,
    setSelectedDepartment,
    loading,
    error
  };
};
