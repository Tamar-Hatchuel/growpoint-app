
-- Add new columns to feedback_responses table to properly store survey data
ALTER TABLE public.feedback_responses 
ADD COLUMN IF NOT EXISTS session_id UUID DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS responses JSONB,
ADD COLUMN IF NOT EXISTS user_department TEXT;

-- Update the table to use the new structure
-- Note: We'll keep existing columns for backward compatibility
