import { createClient } from "@supabase/supabase-js";
import { VITE_SUPABASE_KEY, VITE_SUPABASE_URL } from "../environment";

const supabaseClient = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_KEY);

export default supabaseClient;
