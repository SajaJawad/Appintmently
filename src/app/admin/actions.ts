"use server";

import { createClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function addStaff(formData: FormData) {
  const supabase = await createClient();
  
  const fullName = formData.get("fullName") as string;
  const specialty = formData.get("specialty") as string;
  const bio = formData.get("bio") as string;
  const image = formData.get("image") as File;

  let imageUrl = null;

  if (image && image.size > 0) {
    const fileExt = image.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `staff/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, image);

    if (uploadError) {
      console.error("Upload error", uploadError);
      throw new Error("Failed to upload image.");
    }

    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    imageUrl = data.publicUrl;
  }

  const { error } = await supabase.from('staff').insert({
    full_name: fullName,
    specialty,
    bio,
    image_url: imageUrl,
    is_active: true
  });

  if (error) {
    console.error("Insert error", error);
    throw new Error("Failed to add staff.");
  }

  revalidatePath("/admin");
  revalidatePath("/doctors");
  return { success: true };
}

export async function deleteStaff(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('staff').delete().eq('id', id);
  if (error) {
    console.error("Delete staff error:", error);
    throw new Error(`Failed to delete staff: ${error.message}`);
  }
  
  revalidatePath("/admin");
  revalidatePath("/doctors");
  return { success: true };
}

export async function addService(formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const duration = parseInt(formData.get("duration") as string);
  const price = parseFloat(formData.get("price") as string);
  const image = formData.get("image") as File;

  let imageUrl = null;

  if (image && image.size > 0) {
    const fileExt = image.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `services/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, image);

    if (uploadError) throw new Error("Failed to upload image.");

    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    imageUrl = data.publicUrl;
  }

  const { error } = await supabase.from('services').insert({
    name,
    description,
    duration_minutes: duration,
    price,
    image_url: imageUrl,
    is_active: true
  });

  if (error) throw new Error("Failed to add service.");

  revalidatePath("/admin");
  revalidatePath("/services");
  revalidatePath("/");
  return { success: true };
}

export async function deleteService(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw new Error("Failed to delete service.");
  
  revalidatePath("/admin");
  revalidatePath("/services");
  revalidatePath("/");
  return { success: true };
}
