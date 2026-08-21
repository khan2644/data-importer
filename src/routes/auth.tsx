import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Kitchen Login — Ms Delight Admin" },
      { name: "description", content: "Sign in to the Ms Delight kitchen dashboard to manage orders." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Kitchen Login — Ms Delight Admin" },
      { property: "og:description", content: "Sign in to manage Ms Delight orders." },
    ],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check your details");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Account created — check your email to confirm, then sign in.");
          setMode("signin");
          return;
        }
        toast.success("Welcome!");
        void navigate({ to: "/admin", replace: true });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast.success("Signed in");
        void navigate({ to: "/admin", replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-md flex-col justify-center px-5 py-14">
      <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-[var(--shadow-card)]">
        <h1 className="font-display text-2xl font-black text-primary">Kitchen login</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Only the Ms Delight team can open the orders dashboard.
        </p>

        <form onSubmit={submit} className="mt-5 space-y-3">
          <label className="block space-y-1">
            <span className="text-[0.7rem] font-semibold text-muted-foreground">Email</span>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3">
              <Mail className="size-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full bg-transparent py-2 text-sm outline-none"
              />
            </div>
          </label>
          <label className="block space-y-1">
            <span className="text-[0.7rem] font-semibold text-muted-foreground">Password</span>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3">
              <Lock className="size-4 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className="w-full bg-transparent py-2 text-sm outline-none"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={busy}
            className="gold-ring w-full rounded-full py-3 text-sm font-bold text-accent-foreground disabled:opacity-50"
          >
            {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <button
          onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
          className="mt-4 w-full text-xs font-semibold text-muted-foreground hover:text-primary"
        >
          {mode === "signin" ? "First time? Create the admin account" : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}
