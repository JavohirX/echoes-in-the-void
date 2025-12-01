-- Create letters table for anonymous messages
CREATE TABLE public.letters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read all letters
CREATE POLICY "Anyone can read letters" 
ON public.letters 
FOR SELECT 
USING (true);

-- Create policy to allow anyone to insert letters (anonymous posting)
CREATE POLICY "Anyone can create letters" 
ON public.letters 
FOR INSERT 
WITH CHECK (true);

-- Create index for efficient querying by creation date
CREATE INDEX idx_letters_created_at ON public.letters(created_at DESC);

-- Insert the initial letter
INSERT INTO public.letters (title, content) 
VALUES ('1.12.2025 from the unworthy son to the best dad', 'I fucked up today, I fucked up really hard, unfortunately this time i have no one to tell this to, as there is no one who would really care, I wish you were here, I wish we could talk in the kitchen, one last time');

-- Enable realtime for letters table
ALTER TABLE public.letters REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.letters;