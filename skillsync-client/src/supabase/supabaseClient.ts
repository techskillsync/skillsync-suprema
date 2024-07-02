// supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ywyqgzfoobfinubdxdve.supabase.co";
// Public Anon key, safe on browser if backend is RLS-protected
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3eXFnemZvb2JmaW51YmR4ZHZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4MzI5MTUsImV4cCI6MjAzMzQwODkxNX0.c-FSJ2dK6BhEQRyQtfcPd1uCkudZQzJh0BA-QzXmERg";
const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

export default supabase