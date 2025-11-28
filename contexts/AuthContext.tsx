"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (params: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async ({
    email,
    password,
    firstName,
    lastName,
    phone,
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/` : undefined;
    const fullName = `${firstName} ${lastName}`.trim();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        ...(redirectUrl ? { emailRedirectTo: redirectUrl } : {}),
        data: {
          first_name: firstName,
          last_name: lastName,
          name: fullName,
          phone: phone ?? null,
        }
      }
    });

    let profileError: Error | null = null;

    if (!error && data.user) {
      const { error: upsertError } = await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          name: fullName,
          phone: phone ?? null,
          account_type: "private",
        },
        { onConflict: "id" }
      );

      profileError = upsertError ?? null;
    }

    if (error || profileError) {
      toast.error("Kunde inte skapa konto", {
        description: error?.message || profileError?.message || "Okänt fel",
      });
    } else {
      toast.success("Konto skapat!", {
        description: "Du är nu inloggad och kan börja använda tjänsten.",
      });
    }

    return { error: error || profileError };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Kunde inte logga in", {
        description: error.message === "Invalid login credentials" 
          ? "Felaktigt email eller lösenord" 
          : error.message,
      });
    } else {
      toast.success("Välkommen tillbaka!");
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Du har loggats ut");
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
