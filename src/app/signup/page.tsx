"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Mail, Lock, User, Loader2, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Create profile record
      if (data.user) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: fullName,
          email: email,
        });
      }

      setIsSubmitted(true);
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <div className="max-w-md w-full py-12">
          <div className="text-center mb-10">
            <div className="bg-primary p-1.5 rounded-lg inline-flex mb-6">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-secondary">
              Check your email
            </h1>
            <p className="text-muted-foreground mt-2">
              We've sent a confirmation link to{" "}
              <span className="font-semibold text-secondary">{email}</span>.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[5px] rounded-tl-[20px] rounded-br-[20px] shadow-xl border border-border text-center">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8" />
            </div>
            <p className="text-secondary mb-8">
              Please click the link in the email to confirm your account. Once
              confirmed, you can sign in to your dashboard.
            </p>
            <Link
              href="/login"
              className="inline-block w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="max-w-md w-full py-12">
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
          <h1 className="text-3xl font-bold text-secondary">
            Join Appointmently
          </h1>
          <p className="text-muted-foreground mt-2">
            Start your journey to better healthcare today
          </p>
        </div>

        <div className="bg-white p-8 rounded-[5px] rounded-tl-[20px] rounded-br-[20px] shadow-xl border border-border">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3 text-red-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-secondary mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
              <label className="block text-sm font-semibold text-secondary mb-2">
                Password
              </label>
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
              <p className="text-xs text-muted-foreground mt-2">
                At least 8 characters long
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-secondary font-bold hover:underline"
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
