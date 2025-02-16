let retrievalFunction: Record<string, string | undefined>;

if (typeof window === "undefined") {
  retrievalFunction = process.env as Record<string, string | undefined>;
} else {
  retrievalFunction = import.meta.env as Record<string, string | undefined>;
}

export const VITE_SUPABASE_URL = retrievalFunction.VITE_SUPABASE_URL ?? "";
export const VITE_SUPABASE_KEY = retrievalFunction.VITE_SUPABASE_KEY ?? "";
