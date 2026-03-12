"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Mail, Lock, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Auto-create Admin if credentials strictly match the .env fixed admin
    if (
      error &&
      error.message.includes("Invalid login credentials") &&
      email === process.env.NEXT_PUBLIC_ADMIN_EMAIL &&
      password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    ) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: "Admin" } },
      });
      
      if (!signUpError) {
        const retryLogin = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        error = retryLogin.error;
      }
    }

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        setError(
          "Your email has not been confirmed yet. Please check your inbox for the verification link.",
        );
      } else {
        setError(error.message);
      }
      setLoading(false);
    } else {
      if (
        email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
        email === "admin@gmail.com"
      ) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center mb-6">
            <div className="relative w-20 h-20 overflow-hidden rounded-2xl border-2 border-primary/10 shadow-md hover:scale-105 transition-transform">
              <img
                src="/brand-logo.png"
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-secondary">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to manage your appointments
          </p>
        </div>

        <div className="bg-white p-8 rounded-[5px] rounded-tl-[20px] rounded-br-[20px] shadow-xl border border-border">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3 text-red-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-secondary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-secondary">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  size="sm"
                  className="text-sm text-primary font-semibold hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-white py-4 rounded-xl font-bold hover:bg-secondary/90 transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-primary font-bold hover:underline"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
