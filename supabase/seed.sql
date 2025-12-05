-- Insert standard reflection questions
insert into public.questions (text, is_active) values
('How are you feeling about your work this week?', true),
('What was a highlight for you recently?', true),
('Is there anything blocking your progress?', true),
('How can your manager support you right now?', true);

-- Note: We cannot insert into public.users directly effectively without a corresponding auth.users entry.
-- The implementation plan handles user creation via the application or administrative scripts.
-- For local development, this seed script mainly sets up questions.
