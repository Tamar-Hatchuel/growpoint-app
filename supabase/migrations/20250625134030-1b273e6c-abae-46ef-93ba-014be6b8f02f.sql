
-- Add verbal response columns to feedback_responses table
ALTER TABLE public.feedback_responses 
ADD COLUMN IF NOT EXISTS verbal_q1_comment TEXT,
ADD COLUMN IF NOT EXISTS verbal_q2_comment TEXT,
ADD COLUMN IF NOT EXISTS verbal_q3_comment TEXT,
ADD COLUMN IF NOT EXISTS verbal_q4_comment TEXT,
ADD COLUMN IF NOT EXISTS verbal_q5_comment TEXT,
ADD COLUMN IF NOT EXISTS verbal_q6_comment TEXT,
ADD COLUMN IF NOT EXISTS verbal_q7_comment TEXT;

-- Add constraints to limit comment length (500 characters max)
ALTER TABLE public.feedback_responses 
ADD CONSTRAINT verbal_q1_comment_length CHECK (length(verbal_q1_comment) <= 500),
ADD CONSTRAINT verbal_q2_comment_length CHECK (length(verbal_q2_comment) <= 500),
ADD CONSTRAINT verbal_q3_comment_length CHECK (length(verbal_q3_comment) <= 500),
ADD CONSTRAINT verbal_q4_comment_length CHECK (length(verbal_q4_comment) <= 500),
ADD CONSTRAINT verbal_q5_comment_length CHECK (length(verbal_q5_comment) <= 500),
ADD CONSTRAINT verbal_q6_comment_length CHECK (length(verbal_q6_comment) <= 500),
ADD CONSTRAINT verbal_q7_comment_length CHECK (length(verbal_q7_comment) <= 500);
