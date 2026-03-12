"use client";
import Link from "next/link";
import { Calendar, User, Menu, X, Clock, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    async function checkAdminStatus() {
      if (user) {
        if (
          user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
          user.email === "admin@gmail.com"
        ) {
          setIsAdmin(true);
        } else {
          const { data } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();
          setIsAdmin(data?.role === "admin");
        }
      } else {
        setIsAdmin(false);
      }
    }
    checkAdminStatus();
  }, [user, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md border-b border-border py-0"
          : "bg-white/10 backdrop-blur-sm border-transparent py-2"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative w-16 h-16 overflow-hidden rounded-2xl border-2 border-primary/10 shadow-md hover:scale-105 transition-transform">
                <img
                  src="/brand-logo.png"
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/services"
              className="text-black font-bold hover:text-primary transition-colors"
            >
              Services
            </Link>
            <Link
              href="/doctors"
              className="text-black font-bold hover:text-primary transition-colors"
            >
              Doctors
            </Link>
            <Link
              href="/bookings"
              className="text-black font-bold hover:text-primary transition-colors"
            >
              My Bookings
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-primary font-bold flex items-center bg-primary/5 px-4 py-2 rounded-full hover:bg-primary/10 transition-all border border-primary/20 shadow-sm"
              >
                <span>Admin Panel</span>
              </Link>
            )}
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 bg-secondary/5 border border-secondary/10 text-black px-4 py-2 rounded-full hover:bg-secondary/10 transition-all font-bold text-sm shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                    {(user.user_metadata?.full_name || "U")[0].toUpperCase()}
                  </div>
                  <span>{user.user_metadata?.full_name || "Profile"}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2.5 rounded-full bg-secondary/5 border border-secondary/10 text-secondary/70 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm flex items-center justify-center"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Mobile Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-primary focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/services"
              className="block px-3 py-2 text-black font-bold hover:text-primary"
            >
              Services
            </Link>
            <Link
              href="/doctors"
              className="block px-3 py-2 text-black font-bold hover:text-primary"
            >
              Doctors
            </Link>
            <Link
              href="/bookings"
              className="block px-3 py-2 text-black font-bold hover:text-primary"
            >
              My Bookings
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="block px-3 py-2 text-primary font-bold hover:bg-primary/5 rounded-xl transition-all border border-primary/20"
              >
                Admin Panel
              </Link>
            )}
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-black font-bold hover:text-primary"
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2 text-primary font-bold"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
