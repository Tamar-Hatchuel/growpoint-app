
-- Drop the existing table if it exists
DROP TABLE IF EXISTS public.feedback_responses CASCADE;

-- Create feedback_responses table to store survey responses
CREATE TABLE public.feedback_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id BIGINT REFERENCES public.employees("Employee ID"),
  department TEXT NOT NULL,
  engagement_score DECIMAL(3,1) CHECK (engagement_score >= 0 AND engagement_score <= 10),
  cohesion_score DECIMAL(3,1) CHECK (cohesion_score >= 0 AND cohesion_score <= 10),
  friction_level DECIMAL(3,1) CHECK (friction_level >= 0 AND friction_level <= 5),
  team_goal TEXT CHECK (team_goal IN ('Maintain', 'Improve', 'Resolve')),
  response_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.feedback_responses ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (since we don't have auth implemented yet)
CREATE POLICY "Allow public read access to feedback responses" 
  ON public.feedback_responses 
  FOR SELECT 
  TO public 
  USING (true);

-- Allow public insert access for testing
CREATE POLICY "Allow public insert access to feedback responses" 
  ON public.feedback_responses 
  FOR INSERT 
  TO public 
  WITH CHECK (true);

-- Insert sample data using existing employee IDs and their actual departments
-- This assumes we have employees in the system - if not, we'll insert generic data
INSERT INTO public.feedback_responses (employee_id, department, engagement_score, cohesion_score, friction_level, team_goal, response_date)
SELECT 
  e."Employee ID",
  e."Department",
  ROUND((8.1 + (random() * 1.9 - 0.9))::numeric, 1), -- Random engagement between 7.2-9.0
  ROUND((7.8 + (random() * 1.4 - 0.7))::numeric, 1), -- Random cohesion between 7.1-9.2
  ROUND((1.0 + (random() * 2.5))::numeric, 1),       -- Random friction between 1.0-3.5
  CASE (random() * 3)::int 
    WHEN 0 THEN 'Maintain'
    WHEN 1 THEN 'Improve'
    ELSE 'Resolve'
  END,
  now() - (random() * interval '30 days')
FROM public.employees e
WHERE e."Employee ID" IS NOT NULL
LIMIT 10;

-- If no employees exist, insert some basic sample data without employee_id references
INSERT INTO public.feedback_responses (employee_id, department, engagement_score, cohesion_score, friction_level, team_goal, response_date)
SELECT NULL::BIGINT, 'Engineering', 8.1, 7.8, 1.4, 'Maintain', now() - interval '30 days'
WHERE NOT EXISTS (SELECT 1 FROM public.employees LIMIT 1)
UNION ALL
SELECT NULL::BIGINT, 'Engineering', 7.9, 8.2, 1.8, 'Improve', now() - interval '25 days'
WHERE NOT EXISTS (SELECT 1 FROM public.employees LIMIT 1)
UNION ALL
SELECT NULL::BIGINT, 'Sales', 7.8, 7.5, 2.1, 'Improve', now() - interval '20 days'
WHERE NOT EXISTS (SELECT 1 FROM public.employees LIMIT 1)
UNION ALL
SELECT NULL::BIGINT, 'Sales', 8.3, 8.0, 1.2, 'Maintain', now() - interval '15 days'
WHERE NOT EXISTS (SELECT 1 FROM public.employees LIMIT 1)
UNION ALL
SELECT NULL::BIGINT, 'Marketing', 7.5, 7.2, 2.5, 'Resolve', now() - interval '10 days'
WHERE NOT EXISTS (SELECT 1 FROM public.employees LIMIT 1)
UNION ALL
SELECT NULL::BIGINT, 'Marketing', 6.9, 6.8, 3.2, 'Resolve', now() - interval '5 days'
WHERE NOT EXISTS (SELECT 1 FROM public.employees LIMIT 1)
UNION ALL
SELECT NULL::BIGINT, 'Support', 8.3, 8.5, 1.0, 'Maintain', now() - interval '3 days'
WHERE NOT EXISTS (SELECT 1 FROM public.employees LIMIT 1)
UNION ALL
SELECT NULL::BIGINT, 'Operations', 7.9, 7.7, 1.6, 'Improve', now() - interval '1 day'
WHERE NOT EXISTS (SELECT 1 FROM public.employees LIMIT 1);
