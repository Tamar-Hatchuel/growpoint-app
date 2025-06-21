
-- Enable Row Level Security on the employees table (if not already enabled)
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to SELECT (read) from the employees table
-- This is needed for the department and employee dropdowns to work
CREATE POLICY "Allow public read access to employees" 
ON public.employees 
FOR SELECT 
TO public 
USING (true);
