"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Shield,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [profile, setProfile] = useState({
    id: "",
    email: "",
    full_name: "",
    role: "user",
  });

  const supabase = createClient();

  useEffect(() => {
    async function getProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile({
        id: user.id,
        email: user.email || "",
        full_name:
          profileData?.full_name || user.user_metadata?.full_name || "",
        role: profileData?.role || "user",
      });
      setLoading(false);
    }

    getProfile();
  }, [supabase, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    // Use upsert to handle cases where the profile record might be missing
    const { error } = await supabase.from("profiles").upsert(
      {
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
      },
      { onConflict: "id" },
    );

    if (error) {
      console.error("Profile update error:", error);
      setMessage({ type: "error", text: "Database Error: " + error.message });
    } else {
      // Update auth metadata as well for consistency
      const {
        data: { user: updatedUser },
        error: authError,
      } = await supabase.auth.updateUser({
        data: { full_name: profile.full_name },
      });

      if (authError) {
        console.error("Auth update error:", authError);
        setMessage({ type: "error", text: "Auth Error: " + authError.message });
      } else {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        if (updatedUser) {
          setProfile((prev) => ({
            ...prev,
            full_name: updatedUser.user_metadata?.full_name || prev.full_name,
          }));
        }
        router.refresh();
      }
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30 pb-20">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 mt-30">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-secondary mb-2 tracking-tight">
            Your Profile
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your personal information and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Avatar/Basic Info Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-[5px] rounded-tl-[20px] rounded-br-[20px] p-8 border border-border shadow-soft text-center group">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden transition-transform group-hover:scale-105">
                  <User className="w-16 h-16 text-primary" />
                </div>
                <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-white"></div>
              </div>
              <h2 className="text-2xl font-bold text-secondary mb-1">
                {profile.full_name}
              </h2>
              <div className="inline-flex items-center px-3 py-1 bg-accent rounded-full text-xs font-bold text-primary uppercase tracking-wider mb-4">
                {profile.role}
              </div>
            </div>
          </div>

          {/* Settings Form */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-[5px] rounded-tl-[20px] rounded-br-[20px] p-8 border border-border shadow-soft relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>

              <h3 className="text-xl font-bold text-secondary mb-8 flex items-center">
                <Shield className="w-6 h-6 mr-3 text-primary" />
                Account Information
              </h3>

              {message && (
                <div
                  className={`mb-8 p-4 rounded-2xl flex items-center space-x-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
                    message.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-100"
                      : "bg-red-50 text-red-700 border border-red-100"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span className="font-medium text-sm">{message.text}</span>
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary/70 ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <input
                      type="email"
                      disabled
                      value={profile.email}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-muted/50 border border-border text-muted-foreground cursor-not-allowed outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground ml-1 uppercase tracking-widest font-bold">
                    Your email cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary/70 ml-1 font-inter">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <input
                      type="text"
                      required
                      value={profile.full_name}
                      onChange={(e) =>
                        setProfile({ ...profile, full_name: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-secondary text-white py-4 rounded-2xl font-bold hover:bg-secondary/90 transform active:scale-[0.98] transition-all shadow-xl shadow-secondary/20 flex items-center justify-center space-x-2"
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
