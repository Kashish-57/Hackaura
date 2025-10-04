import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Upload, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Database } from "@/integrations/supabase/types"; 
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];

interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  user_type: string | null;

  // student fields
  course_details?: string | null;
  personal_emotions?: string | null;

  // parent fields
  student_email?: string | null;
  child_professional_state?: string | null;
  child_personal_state?: string | null;

  // therapist fields
  expertise?: string | null;
  experience?: string | null;
  qualifications?: string | null;
}

// Config: role → fields
const roleFieldConfig: Record<
  string,
  { key: keyof Profile; label: string; type: "text" | "textarea" }[]
> = {
  student: [
    { key: "course_details", label: "Course Details", type: "textarea" },
    { key: "personal_emotions", label: "Personal Emotions", type: "textarea" },
  ],
  parent: [
    { key: "student_email", label: "Student Email", type: "text" },
    { key: "child_professional_state", label: "Child Professional State", type: "textarea" },
    { key: "child_personal_state", label: "Child Personal State", type: "textarea" },
  ],
  therapist: [
    { key: "expertise", label: "Expertise", type: "textarea" },
    { key: "experience", label: "Experience", type: "textarea" },
    { key: "qualifications", label: "Qualifications", type: "textarea" },
  ],
};

export function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setProfile(data);
      } else {
        setProfile({
          id: user?.id!,
          display_name: user?.email?.split("@")[0] || "",
          email: user?.email || "",
          avatar_url: null,
          bio: null,
          phone: null,
          location: null,
          user_type: null,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: t("profilePage.toasts.errorTitle"),
        description: t("profilePage.toasts.loadError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
  if (!profile || !user) return;

  setSaving(true);
    try {
      const updateData: ProfileInsert = {
        // explicitly include id as foreign key (Supabase allows it even if not in Insert type)
        id: user.id as string, 
        display_name: profile.display_name || null,
        bio: profile.bio || null,
        phone: profile.phone || null,
        location: profile.location || null,
        avatar_url: profile.avatar_url || null,
        // ensure user_type matches enum type
        user_type: profile.user_type as "student" | "parent" | "therapist" | null
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(updateData, { onConflict: "id" });

      if (error) throw error;

      toast({
        title: t("profilePage.toasts.successTitle"),
        description: t("profilePage.toasts.saveSuccess")
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: t("profilePage.toasts.errorTitle"),
        description: t("profilePage.toasts.saveError"),
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

      setProfile((prev) =>
        prev ? { ...prev, avatar_url: data.publicUrl } : null
      );

      toast({
        title: t("profilePage.toasts.successTitle"),
        description: t("profilePage.toasts.uploadSuccess"),
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: t("profilePage.toasts.errorTitle"),
        description: t("profilePage.toasts.uploadError"),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("profilePage.backToDashboard")}
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-primary">
              {t("profilePage.title")}
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>{t("profilePage.cardTitle")}</CardTitle>
              <CardDescription>{t("profilePage.cardDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar upload */}
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar_url || ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {profile.display_name?.slice(0, 2).toUpperCase() ||
                      profile.email?.slice(0, 2).toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button
                    variant="outline"
                    disabled={uploading}
                    onClick={() =>
                      document.getElementById("avatar-upload")?.click()
                    }
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading
                      ? t("profilePage.uploading")
                      : t("profilePage.changeAvatar")}
                  </Button>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {t("profilePage.avatarRequirements")}
                  </p>
                </div>
              </div>

              {/* Common fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    {t("profilePage.displayName")}
                  </label>
                  <Input
                    value={profile.display_name || ""}
                    onChange={(e) =>
                      setProfile((prev) =>
                        prev ? { ...prev, display_name: e.target.value } : null
                      )
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    {t("profilePage.email")}
                  </label>
                  <Input value={profile.email || ""} disabled className="bg-muted" />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    {t("profilePage.phone")}
                  </label>
                  <Input
                    value={profile.phone || ""}
                    onChange={(e) =>
                      setProfile((prev) =>
                        prev ? { ...prev, phone: e.target.value } : null
                      )
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    {t("profilePage.location")}
                  </label>
                  <Input
                    value={profile.location || ""}
                    onChange={(e) =>
                      setProfile((prev) =>
                        prev ? { ...prev, location: e.target.value } : null
                      )
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    {t("profilePage.bio")}
                  </label>
                  <Textarea
                    value={profile.bio || ""}
                    onChange={(e) =>
                      setProfile((prev) =>
                        prev ? { ...prev, bio: e.target.value } : null
                      )
                    }
                    rows={3}
                  />
                </div>
              </div>

              {/* Role-specific fields */}
              {profile.user_type &&
                roleFieldConfig[profile.user_type]?.map((field) => (
                  <div key={field.key}>
                    <label className="text-sm font-medium">{field.label}</label>
                    {field.type === "text" ? (
                      <Input
                        value={profile[field.key] || ""}
                        onChange={(e) =>
                          setProfile((prev) =>
                            prev
                              ? { ...prev, [field.key]: e.target.value }
                              : null
                          )
                        }
                      />
                    ) : (
                      <Textarea
                        value={profile[field.key] || ""}
                        onChange={(e) =>
                          setProfile((prev) =>
                            prev
                              ? { ...prev, [field.key]: e.target.value }
                              : null
                          )
                        }
                        rows={3}
                      />
                    )}
                  </div>
                ))}

              <Button onClick={handleSave} disabled={saving} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {saving ? t("profilePage.saving") : t("profilePage.saveChanges")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
