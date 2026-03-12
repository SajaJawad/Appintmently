import { createClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  
  const { data: staff, error: staffError, count: staffCount } = await supabase
    .from("staff")
    .select("*", { count: 'exact' });
    
  const { data: activeStaff, error: activeStaffError } = await supabase
    .from("staff")
    .select("*")
    .eq("is_active", true);

  const { data: services, error: servicesError, count: servicesCount } = await supabase
    .from("services")
    .select("*", { count: 'exact' });

  const { data: { user } } = await supabase.auth.getUser();

  const { data: ownProfile, error: ownProfileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id || "")
    .single();

  const { data: allProfiles, error: allProfilesError } = await supabase
    .from("profiles")
    .select("*")
    .limit(1);

  return NextResponse.json({
    user: user?.email,
    ownProfile: {
      data: ownProfile,
      error: ownProfileError
    },
    allProfiles: {
      error: allProfilesError
    },
    staff: {
      totalCount: staffCount,
      error: staffError
    },
    activeStaff: {
      count: activeStaff?.length,
      error: activeStaffError
    },
    services: {
      totalCount: servicesCount,
      error: servicesError
    },
    env: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "MISSING",
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "MISSING"
    }
  });
}
