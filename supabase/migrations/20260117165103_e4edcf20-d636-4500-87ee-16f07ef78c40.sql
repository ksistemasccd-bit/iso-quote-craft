-- Agregar campos username y password_hash a advisors
ALTER TABLE public.advisors 
ADD COLUMN username TEXT UNIQUE,
ADD COLUMN password_hash TEXT;

-- Eliminar la columna user_id ya que no usaremos Supabase Auth
ALTER TABLE public.advisors 
DROP COLUMN IF EXISTS user_id;