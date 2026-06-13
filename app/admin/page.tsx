"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Home,
  User,
  Briefcase,
  FolderKanban,
  Award,
  LogOut,
  Save,
  Plus,
  Trash2,
  Upload,
  X,
  Image as ImageIcon,
  Filter,
  Calendar,
} from "lucide-react";
import { verifyAdminPin, savePortfolioSection } from "@/app/actions";
import { uploadFile } from "@/lib/upload";
import { AVAILABLE_ICONS, getIconComponent } from "@/lib/icon-map";
import { supabaseClient } from "@/lib/supabase";

type Tab = "home" | "about" | "skills" | "projects" | "certificates" | "gallery";

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "skills", label: "Skills", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    const authTime = localStorage.getItem("admin_auth_time");
    
    if (auth === "true" && authTime) {
      const elapsed = Date.now() - parseInt(authTime);
      const TIMEOUT = 30 * 60 * 1000;
      
      if (elapsed > TIMEOUT) {
        localStorage.removeItem("admin_auth");
        localStorage.removeItem("admin_auth_time");
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPinError("");
    const result = await verifyAdminPin(pin);
    if (result.success) {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
      localStorage.setItem("admin_auth_time", Date.now().toString());
    } else {
      setPinError(result.message);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_auth");
    localStorage.removeItem("admin_auth_time");
    setPin("");
    window.location.href = "/";
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-lg border border-black/10 bg-white p-8 shadow-xl dark:border-white/15 dark:bg-black"
        >
          <div className="mb-6 flex flex-col items-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-[#FFC300] text-black">
              <Lock size={24} />
            </div>
            <h1 className="mt-4 text-2xl font-black text-black dark:text-white">
              Admin Login
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Masukkan PIN untuk melanjutkan
            </p>
          </div>

          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••••"
            maxLength={6}
            className="w-full rounded-md border border-black/10 bg-white px-4 py-3 text-center text-2xl tracking-[0.5em] text-black outline-none focus:border-[#FFC300] dark:border-white/15 dark:bg-neutral-900 dark:text-white"
          />

          {pinError && (
            <p className="mt-3 text-center text-sm text-red-500">{pinError}</p>
          )}

          <button
            type="submit"
            disabled={loading || pin.length < 4}
            className="mt-5 w-full rounded-md bg-[#FFC300] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#ffd84a] disabled:opacity-50"
          >
            {loading ? "Memverifikasi..." : "Masuk"}
          </button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur-xl dark:border-white/15 dark:bg-black/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-[#FFC300] text-black">
              <Lock size={16} />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-wider text-black dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-xs text-neutral-500">Kelola konten portofolio</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="rounded-md border border-black/10 px-3 py-2 text-xs font-bold text-black transition hover:border-[#FFC300] dark:border-white/15 dark:text-white"
            >
              Lihat Web
            </a>
            <button
              onClick={handleLogout}
              className="grid h-9 w-9 place-items-center rounded-md border border-black/10 text-black transition hover:border-red-500 hover:text-red-500 dark:border-white/15 dark:text-white"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <TabNavigation />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <DashboardContent />
      </main>
    </div>
  );
}

// ==================== TAB NAVIGATION ====================
function TabNavigation() {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  useEffect(() => {
    const handler = (e: Event) => {
      setActiveTab((e as CustomEvent).detail);
    };
    window.addEventListener("changeTab", handler);
    return () => window.removeEventListener("changeTab", handler);
  }, []);

  return (
    <div className="border-b border-black/10 bg-white dark:border-white/15 dark:bg-black">
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                window.dispatchEvent(new CustomEvent("changeTab", { detail: tab.id }));
              }}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition ${
                activeTab === tab.id
                  ? "border-[#FFC300] text-black dark:text-white"
                  : "border-transparent text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white"
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ==================== DASHBOARD CONTENT ====================
function DashboardContent() {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  useEffect(() => {
    const handler = (e: Event) => {
      setActiveTab((e as CustomEvent).detail);
    };
    window.addEventListener("changeTab", handler);
    return () => window.removeEventListener("changeTab", handler);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === "home" && <HomeEditor />}
        {activeTab === "about" && <AboutEditor />}
        {activeTab === "skills" && <SkillsEditor />}
        {activeTab === "projects" && <ProjectsEditor />}
        {activeTab === "certificates" && <CertificatesEditor />}
        {activeTab === "gallery" && <GalleryEditor />}
      </motion.div>
    </AnimatePresence>
  );
}

// ==================== GALLERY EDITOR ====================
function GalleryEditor() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabaseClient
          .from("portfolio_data")
          .select("content")
          .eq("section", "gallery")
          .single();

        if (data?.content) {
          setPhotos(data.content);
        }
      } catch (err) {
        console.error("Error fetching gallery:", err);
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const result = await savePortfolioSection("gallery", photos);
    setMessage(result.message);
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const addPhoto = () => {
    setPhotos([
      ...photos,
      {
        id: Date.now().toString(),
        imageUrl: "",
        title: "Foto Baru",
        description: "",
        filter: "original",
        uploadedAt: new Date().toISOString(),
        order: photos.length,
      },
    ]);
  };

  const updatePhoto = (idx: number, field: string, value: any) => {
    const newPhotos = [...photos];
    (newPhotos[idx] as any)[field] = value;
    setPhotos(newPhotos);
  };

  const removePhoto = (idx: number) => {
    const newPhotos = photos.filter((_, i) => i !== idx);
    setPhotos(newPhotos);
  };

  const handleImageUpload = async (idx: number, file: File) => {
    try {
      const { url } = await uploadFile(file, "gallery");
      updatePhoto(idx, "imageUrl", url);
    } catch (err: any) {
      alert("Upload gagal: " + err.message);
    }
  };

  if (loadingData) {
    return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FFC300] border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <SectionTitle title="Gallery" description="Kelola galeri foto dengan filter original dan hitam putih." />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, idx) => (
          <Card key={photo.id || idx} title={`Foto ${idx + 1}`} icon={<ImageIcon size={16} />}>
            <div className="space-y-4">
              {/* Upload Image */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                  Upload Foto
                </label>
                {photo.imageUrl && (
                  <img src={photo.imageUrl} alt="Preview" className="mb-2 h-40 w-full rounded-md object-cover" />
                )}
                <label className="inline-block cursor-pointer rounded-md border border-dashed border-black/20 px-4 py-2 text-sm font-bold hover:border-[#FFC300] dark:border-white/20">
                  <Upload size={16} className="mr-2 inline" />
                  Upload Foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(idx, e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Title */}
              <Input
                label="Judul Foto"
                value={photo.title}
                onChange={(v) => updatePhoto(idx, "title", v)}
              />

              {/* Description */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                  Keterangan
                </label>
                <textarea
                  value={photo.description}
                  onChange={(e) => updatePhoto(idx, "description", e.target.value)}
                  rows={2}
                  className="w-full rounded-md border border-black/10 bg-white px-4 py-2 text-sm dark:border-white/15 dark:bg-neutral-900 dark:text-white"
                />
              </div>

              {/* Filter */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                  Filter
                </label>
                <select
                  value={photo.filter}
                  onChange={(e) => updatePhoto(idx, "filter", e.target.value)}
                  className="w-full rounded-md border border-black/10 bg-white px-4 py-2 text-sm dark:border-white/15 dark:bg-neutral-900 dark:text-white"
                >
                  <option value="original">Original</option>
                  <option value="grayscale">Hitam Putih</option>
                </select>
              </div>

              {/* Upload Date */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                  Tanggal Upload
                </label>
                <input
                  type="datetime-local"
                  value={photo.uploadedAt ? new Date(photo.uploadedAt).toISOString().slice(0, 16) : ""}
                  onChange={(e) => updatePhoto(idx, "uploadedAt", new Date(e.target.value).toISOString())}
                  className="w-full rounded-md border border-black/10 bg-white px-4 py-2 text-sm dark:border-white/15 dark:bg-neutral-900 dark:text-white"
                />
              </div>

              {/* Order */}
              <Input
                label="Urutan Tampilan"
                value={photo.order.toString()}
                onChange={(v) => updatePhoto(idx, "order", parseInt(v) || 0)}
              />

              {/* Delete Button */}
              <button
                onClick={() => removePhoto(idx)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-red-500/50 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-500/20 dark:border-red-500 dark:text-red-400"
              >
                <Trash2 size={14} /> Hapus Foto
              </button>
            </div>
          </Card>
        ))}
      </div>

      <button
        onClick={addPhoto}
        className="inline-flex items-center gap-2 rounded-md border border-dashed border-black/20 px-4 py-2 text-sm font-bold hover:border-[#FFC300] dark:border-white/20"
      >
        <Plus size={14} /> Tambah Foto
      </button>

      <SaveButton onClick={handleSave} saving={saving} message={message} />
    </div>
  );
}

// ==================== HOME EDITOR ====================
function HomeEditor() {
  const [form, setForm] = useState({
    name: "",
    roles: [] as string[],
    location: "",
    email: "",
    cvUrl: "",
    summary: "",
    profileImage: "",
    socials: [] as { label: string; href: string; icon: string }[],
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabaseClient
          .from("portfolio_data")
          .select("content")
          .eq("section", "profile")
          .single();

        if (data?.content) {
          setForm(data.content);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const result = await savePortfolioSection("profile", form);
    setMessage(result.message);
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await uploadFile(file, "profile");
      setForm({ ...form, profileImage: url });
    } catch (err: any) {
      alert("Upload gagal: " + err.message);
    }
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await uploadFile(file, "cv");
      setForm({ ...form, cvUrl: url });
    } catch (err: any) {
      alert("Upload gagal: " + err.message);
    }
  };

  if (loadingData) {
    return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FFC300] border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <SectionTitle title="Home / Profile" description="Edit informasi utama yang tampil di halaman depan." />
      <Card title="Foto Profil">
        <div className="flex items-center gap-4">
          {form.profileImage && (
            <img src={form.profileImage} alt="Preview" className="h-20 w-20 rounded-md object-cover" />
          )}
          <label className="cursor-pointer rounded-md border border-dashed border-black/20 px-4 py-2 text-sm font-bold hover:border-[#FFC300] dark:border-white/20">
            <Upload size={16} className="mr-2 inline" />
            Upload Foto
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
      </Card>

      <Card title="Informasi Dasar">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nama" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Input label="Lokasi" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
          <Input label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        </div>
        <div className="mt-4">
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
            Roles (pisahkan dengan koma)
          </label>
          <input
            value={form.roles.join(", ")}
            onChange={(e) => setForm({ ...form, roles: e.target.value.split(",").map((r) => r.trim()) })}
            className="w-full rounded-md border border-black/10 bg-white px-4 py-2 text-sm dark:border-white/15 dark:bg-neutral-900 dark:text-white"
          />
        </div>
        <div className="mt-4">
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
            Summary
          </label>
          <textarea
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            rows={4}
            className="w-full rounded-md border border-black/10 bg-white px-4 py-2 text-sm dark:border-white/15 dark:bg-neutral-900 dark:text-white"
          />
        </div>
      </Card>

      <Card title="CV (Curriculum Vitae)">
        {form.cvUrl && (
          <a href={form.cvUrl} target="_blank" className="text-sm text-[#FFC300] underline">
            Lihat CV saat ini
          </a>
        )}
        <label className="mt-2 inline-block cursor-pointer rounded-md border border-dashed border-black/20 px-4 py-2 text-sm font-bold hover:border-[#FFC300] dark:border-white/20">
          <Upload size={16} className="mr-2 inline" />
          Upload CV (PDF)
          <input type="file" accept=".pdf" onChange={handleCvUpload} className="hidden" />
        </label>
      </Card>

      <Card title="Social Media">
        {form.socials.map((social, i) => (
          <div key={i} className="mb-3 grid gap-2 rounded-md border border-black/10 p-3 dark:border-white/15 sm:grid-cols-[1fr_2fr_auto_auto]">
            <input
              placeholder="Label"
              value={social.label}
              onChange={(e) => {
                const newSocials = [...form.socials];
                newSocials[i].label = e.target.value;
                setForm({ ...form, socials: newSocials });
              }}
              className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-neutral-900 dark:text-white"
            />
            <input
              placeholder="URL"
              value={social.href}
              onChange={(e) => {
                const newSocials = [...form.socials];
                newSocials[i].href = e.target.value;
                setForm({ ...form, socials: newSocials });
              }}
              className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-neutral-900 dark:text-white"
            />
            <select
              value={social.icon}
              onChange={(e) => {
                const newSocials = [...form.socials];
                newSocials[i].icon = e.target.value;
                setForm({ ...form, socials: newSocials });
              }}
              className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-neutral-900 dark:text-white"
            >
              {AVAILABLE_ICONS.map((ic) => (
                <option key={ic} value={ic}>{ic}</option>
              ))}
            </select>
            <button
              onClick={() => setForm({ ...form, socials: form.socials.filter((_, idx) => idx !== i) })}
              className="grid h-9 w-9 place-items-center rounded-md border border-red-500/30 text-red-500 hover:bg-red-500/10"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          onClick={() => setForm({ ...form, socials: [...form.socials, { label: "", href: "", icon: "Github" }] })}
          className="mt-2 inline-flex items-center gap-2 rounded-md border border-dashed border-black/20 px-4 py-2 text-sm font-bold hover:border-[#FFC300] dark:border-white/20"
        >
          <Plus size={14} /> Tambah Social
        </button>
      </Card>

      <SaveButton onClick={handleSave} saving={saving} message={message} />
    </div>
  );
}

// ==================== ABOUT EDITOR ====================
function AboutEditor() {
  const [aboutData, setAboutData] = useState({
    profileNotes: {
      heading: "Belajar teknologi dengan rasa ingin tahu, ketelitian, dan mata visual.",
      description: "Saya menikmati pekerjaan yang menggabungkan problem solving teknis dan presentasi visual yang rapi, dari troubleshooting perangkat sampai membuat tampilan web dan dokumentasi foto."
    },
    sectionDescription: "Ringkasan profil, pendidikan, pengalaman PKL, dan hobi yang membentuk cara saya belajar teknologi.",
    items: [
      { title: "Tentang Saya", description: "", icon: "BadgeCheck" },
      { title: "Pendidikan", description: "", icon: "GraduationCap" },
      { title: "Pengalaman PKL", description: "", icon: "BriefcaseBusiness" },
      { title: "Hobi", description: "", icon: "Camera" },
    ]
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: itemsData } = await supabaseClient
          .from("portfolio_data")
          .select("content")
          .eq("section", "aboutItems")
          .single();

        const { data: sectionData } = await supabaseClient
          .from("portfolio_data")
          .select("content")
          .eq("section", "aboutSection")
          .single();

        if (sectionData?.content) {
          setAboutData({
            ...aboutData,
            ...sectionData.content,
            items: itemsData?.content || aboutData.items
          });
        } else if (itemsData?.content) {
          setAboutData(prev => ({ ...prev, items: itemsData.content }));
        }
      } catch (err) {
        console.error("Error fetching about data:", err);
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await savePortfolioSection("aboutItems", aboutData.items);
    await savePortfolioSection("aboutSection", {
      profileNotes: aboutData.profileNotes,
      sectionDescription: aboutData.sectionDescription
    });

    setMessage("Data berhasil disimpan!");
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  if (loadingData) {
    return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FFC300] border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <SectionTitle title="About" description="Edit bagian Tentang Saya, Pendidikan, Pengalaman, dan Hobi." />
      
      <Card title="Profile Notes (Kiri Atas)" icon={<User size={16} />}>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              Heading Profile Notes
            </label>
            <textarea
              value={aboutData.profileNotes.heading}
              onChange={(e) => setAboutData({
                ...aboutData,
                profileNotes: { ...aboutData.profileNotes, heading: e.target.value }
              })}
              rows={3}
              className="w-full rounded-md border border-black/10 bg-white px-4 py-2 text-sm dark:border-white/15 dark:bg-neutral-900 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              Deskripsi Profile Notes
            </label>
            <textarea
              value={aboutData.profileNotes.description}
              onChange={(e) => setAboutData({
                ...aboutData,
                profileNotes: { ...aboutData.profileNotes, description: e.target.value }
              })}
              rows={4}
              className="w-full rounded-md border border-black/10 bg-white px-4 py-2 text-sm dark:border-white/15 dark:bg-neutral-900 dark:text-white"
            />
          </div>
        </div>
      </Card>

      <Card title="Deskripsi Section About" icon={<User size={16} />}>
        <textarea
          value={aboutData.sectionDescription}
          onChange={(e) => setAboutData({ ...aboutData, sectionDescription: e.target.value })}
          rows={3}
          className="w-full rounded-md border border-black/10 bg-white px-4 py-2 text-sm dark:border-white/15 dark:bg-neutral-900 dark:text-white"
        />
      </Card>

      <div className="space-y-4">
        {aboutData.items.map((item, i) => {
          const Icon = getIconComponent(item.icon);
          return (
            <Card key={i} title={item.title} icon={<Icon size={16} />}>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <Input label="Judul" value={item.title} onChange={(v) => {
                  const newItems = [...aboutData.items];
                  newItems[i].title = v;
                  setAboutData({ ...aboutData, items: newItems });
                }} />
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    Ikon
                  </label>
                  <select
                    value={item.icon}
                    onChange={(e) => {
                      const newItems = [...aboutData.items];
                      newItems[i].icon = e.target.value;
                      setAboutData({ ...aboutData, items: newItems });
                    }}
                    className="h-[42px] rounded-md border border-black/10 bg-white px-3 text-sm dark:border-white/15 dark:bg-neutral-900 dark:text-white"
                  >
                    {AVAILABLE_ICONS.map((ic) => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-3">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                  Deskripsi
                </label>
                <textarea
                  value={item.description}
                  onChange={(e) => {
                    const newItems = [...aboutData.items];
                    newItems[i].description = e.target.value;
                    setAboutData({ ...aboutData, items: newItems });
                  }}
                  rows={3}
                  className="w-full rounded-md border border-black/10 bg-white px-4 py-2 text-sm dark:border-white/15 dark:bg-neutral-900 dark:text-white"
                />
              </div>
              <button
                onClick={() => {
                  const newItems = aboutData.items.filter((_, idx) => idx !== i);
                  setAboutData({ ...aboutData, items: newItems });
                }}
                className="mt-3 inline-flex items-center gap-2 rounded-md border border-red-500/30 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-500/10"
              >
                <Trash2 size={12} /> Hapus item ini
              </button>
            </Card>
          );
        })}

        <button
          onClick={() => setAboutData({
            ...aboutData,
            items: [...aboutData.items, { title: "Item Baru", description: "", icon: "BadgeCheck" }]
          })}
          className="inline-flex items-center gap-2 rounded-md border border-dashed border-black/20 px-4 py-2 text-sm font-bold hover:border-[#FFC300] dark:border-white/20"
        >
          <Plus size={14} /> Tambah Item About
        </button>
      </div>

      <SaveButton onClick={handleSave} saving={saving} message={message} />
    </div>
  );
}

// ==================== SKILLS EDITOR ====================
function SkillsEditor() {
  const [categories, setCategories] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await supabaseClient
          .from("portfolio_data")
          .select("content")
          .eq("section", "skillCategories")
          .single();
        if (data?.content) setCategories(data.content);
      } catch (err) {
        console.error("Error fetching skillCategories:", err);
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const result = await savePortfolioSection("skillCategories", categories);
    setMessage(result.message);
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const addSkill = (catIdx: number) => {
    const newCats = [...categories];
    newCats[catIdx].skills.push({ name: "Skill Baru", percentage: 70, icon: "Code2" });
    setCategories(newCats);
  };

  const updateSkill = (catIdx: number, skillIdx: number, field: string, value: any) => {
    const newCats = [...categories];
    (newCats[catIdx].skills[skillIdx] as any)[field] = value;
    setCategories(newCats);
  };

  const removeSkill = (catIdx: number, skillIdx: number) => {
    const newCats = [...categories];
    newCats[catIdx].skills.splice(skillIdx, 1);
    setCategories(newCats);
  };

  const removeCategory = (catIdx: number) => {
    const catName = categories[catIdx].title;
    if (confirm(`Yakin ingin menghapus kategori "${catName}" beserta semua skill di dalamnya?`)) {
      const newCats = categories.filter((_, idx) => idx !== catIdx);
      setCategories(newCats);
    }
  };

  if (loadingData) {
    return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FFC300] border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <SectionTitle title="Skills" description="Kelola kategori skill dan daftar kemampuan teknis." />
      {categories.map((cat, catIdx) => {
        const CatIcon = getIconComponent(cat.icon);
        return (
          <Card key={catIdx} title={cat.title} icon={<CatIcon size={16} />}>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <Input
                label="Nama Kategori"
                value={cat.title}
                onChange={(v) => {
                  const newCats = [...categories];
                  newCats[catIdx].title = v;
                  setCategories(newCats);
                }}
              />
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                  Ikon Kategori
                </label>
                <select
                  value={cat.icon}
                  onChange={(e) => {
                    const newCats = [...categories];
                    newCats[catIdx].icon = e.target.value;
                    setCategories(newCats);
                  }}
                  className="h-[42px] rounded-md border border-black/10 bg-white px-3 text-sm dark:border-white/15 dark:bg-neutral-900 dark:text-white"
                >
                  {AVAILABLE_ICONS.map((ic) => (
                    <option key={ic} value={ic}>{ic}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Daftar Skill ({cat.skills.length})
              </p>
              {cat.skills.map((skill: any, skillIdx: number) => (
                <div key={skillIdx} className="grid gap-2 rounded-md border border-black/10 p-3 dark:border-white/15 sm:grid-cols-[2fr_1fr_auto_auto]">
                  <input
                    value={skill.name}
                    onChange={(e) => updateSkill(catIdx, skillIdx, "name", e.target.value)}
                    placeholder="Nama skill"
                    className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-neutral-900 dark:text-white"
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={skill.percentage}
                    onChange={(e) => updateSkill(catIdx, skillIdx, "percentage", parseInt(e.target.value) || 0)}
                    className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/15 dark:bg-neutral-900 dark:text-white"
                  />
                  <select
                    value={skill.icon}
                    onChange={(e) => updateSkill(catIdx, skillIdx, "icon", e.target.value)}
                    className="rounded-md border border-black/10 bg-white px-2 py-2 text-xs dark:border-white/15 dark:bg-neutral-900 dark:text-white"
                  >
                    {AVAILABLE_ICONS.map((ic) => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeSkill(catIdx, skillIdx)}
                    className="grid h-9 w-9 place-items-center rounded-md border border-red-500/50 bg-red-500/10 text-red-500 transition hover:bg-red-500/20 dark:border-red-500 dark:text-red-400"
                    aria-label="Hapus skill"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => addSkill(catIdx)}
                  className="inline-flex items-center gap-2 rounded-md border border-dashed border-black/20 px-3 py-1.5 text-xs font-bold hover:border-[#FFC300] dark:border-white/20"
                >
                  <Plus size={12} /> Tambah Skill
                </button>
                
                <button
                  onClick={() => removeCategory(catIdx)}
                  className="inline-flex items-center gap-2 rounded-md border border-red-500/50 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-500 transition hover:bg-red-500/20 dark:border-red-500 dark:text-red-400"
                >
                  <Trash2 size={12} /> Hapus Kategori
                </button>
              </div>
            </div>
          </Card>
        );
      })}
      
      <button
        onClick={() => setCategories([...categories, { title: "Kategori Baru", icon: "Code2", skills: [] }])}
        className="inline-flex items-center gap-2 rounded-md border border-dashed border-black/20 px-4 py-2 text-sm font-bold hover:border-[#FFC300] dark:border-white/20"
      >
        <Plus size={14} /> Tambah Kategori
      </button>

      <SaveButton onClick={handleSave} saving={saving} message={message} />
    </div>
  );
}

// ==================== PROJECTS EDITOR ====================
function ProjectsEditor() {
  const [projects, setProjects] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabaseClient
          .from("portfolio_data")
          .select("content")
          .eq("section", "projects")
          .single();

        if (data?.content) {
          setProjects(data.content);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const result = await savePortfolioSection("projects", projects);
    setMessage(result.message);
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const addProject = () => {
    setProjects([
      ...projects,
      {
        title: "Project Baru",
        description: "",
        image: "",
        tech: [],
        demoUrl: "#",
        githubUrl: "#",
      },
    ]);
  };

  const updateProject = (idx: number, field: string, value: any) => {
    const newProjects = [...projects];
    (newProjects[idx] as any)[field] = value;
    setProjects(newProjects);
  };

  const handleImageUpload = async (idx: number, file: File) => {
    try {
      const { url } = await uploadFile(file, "projects");
      updateProject(idx, "image", url);
    } catch (err: any) {
      alert("Upload gagal: " + err.message);
    }
  };

  if (loadingData) {
    return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FFC300] border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <SectionTitle title="Projects" description="Kelola daftar project pilihan yang ditampilkan." />
      {projects.map((project, idx) => (
        <Card key={idx} title={project.title || "Project Baru"}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Judul" value={project.title} onChange={(v) => updateProject(idx, "title", v)} />
            <Input label="Demo URL" value={project.demoUrl} onChange={(v) => updateProject(idx, "demoUrl", v)} />
            <Input label="GitHub URL" value={project.githubUrl} onChange={(v) => updateProject(idx, "githubUrl", v)} />
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Tech Stack (pisahkan koma)
              </label>
              <input
                value={project.tech.join(", ")}
                onChange={(e) => updateProject(idx, "tech", e.target.value.split(",").map((t: string) => t.trim()))}
                className="w-full rounded-md border border-black/10 bg-white px-4 py-2 text-sm dark:border-white/15 dark:bg-neutral-900 dark:text-white"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              Deskripsi
            </label>
            <textarea
              value={project.description}
              onChange={(e) => updateProject(idx, "description", e.target.value)}
              rows={3}
              className="w-full rounded-md border border-black/10 bg-white px-4 py-2 text-sm dark:border-white/15 dark:bg-neutral-900 dark:text-white"
            />
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              Thumbnail
            </label>
            {project.image && (
              <img src={project.image} alt="Preview" className="mb-2 h-32 w-full rounded-md object-cover" />
            )}
            <label className="inline-block cursor-pointer rounded-md border border-dashed border-black/20 px-4 py-2 text-sm font-bold hover:border-[#FFC300] dark:border-white/20">
              <Upload size={16} className="mr-2 inline" />
              Upload Thumbnail
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(idx, e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
          <button
            onClick={() => setProjects(projects.filter((_, i) => i !== idx))}
            className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-red-500 hover:underline"
          >
            <Trash2 size={12} /> Hapus Project
          </button>
        </Card>
      ))}

      <button
        onClick={addProject}
        className="inline-flex items-center gap-2 rounded-md border border-dashed border-black/20 px-4 py-2 text-sm font-bold hover:border-[#FFC300] dark:border-white/20"
      >
        <Plus size={14} /> Tambah Project
      </button>

      <SaveButton onClick={handleSave} saving={saving} message={message} />
    </div>
  );
}

// ==================== CERTIFICATES EDITOR ====================
function CertificatesEditor() {
  const [certs, setCerts] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabaseClient
          .from("portfolio_data")
          .select("content")
          .eq("section", "certificates")
          .single();

        if (data?.content) {
          setCerts(data.content);
        }
      } catch (err) {
        console.error("Error fetching certificates:", err);
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const result = await savePortfolioSection("certificates", certs);
    setMessage(result.message);
    setSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const addCert = () => {
    setCerts([...certs, { title: "Sertifikat Baru", issuer: "", image: "" }]);
  };

  const updateCert = (idx: number, field: string, value: any) => {
    const newCerts = [...certs];
    (newCerts[idx] as any)[field] = value;
    setCerts(newCerts);
  };

  const handleImageUpload = async (idx: number, file: File) => {
    try {
      const { url } = await uploadFile(file, "certificates");
      updateCert(idx, "image", url);
    } catch (err: any) {
      alert("Upload gagal: " + err.message);
    }
  };

  if (loadingData) {
    return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FFC300] border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <SectionTitle title="Certificates" description="Kelola daftar sertifikat yang ditampilkan." />
      {certs.map((cert, idx) => (
        <Card key={idx} title={cert.title || "Sertifikat Baru"}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Judul Sertifikat" value={cert.title} onChange={(v) => updateCert(idx, "title", v)} />
            <Input label="Penerbit" value={cert.issuer} onChange={(v) => updateCert(idx, "issuer", v)} />
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              Gambar Sertifikat
            </label>
            {cert.image && (
              <img src={cert.image} alt="Preview" className="mb-2 h-40 w-full rounded-md object-cover" />
            )}
            <label className="inline-block cursor-pointer rounded-md border border-dashed border-black/20 px-4 py-2 text-sm font-bold hover:border-[#FFC300] dark:border-white/20">
              <Upload size={16} className="mr-2 inline" />
              Upload Gambar
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(idx, e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
          <button
            onClick={() => setCerts(certs.filter((_, i) => i !== idx))}
            className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-red-500 hover:underline"
          >
            <Trash2 size={12} /> Hapus Sertifikat
          </button>
        </Card>
      ))}

      <button
        onClick={addCert}
        className="inline-flex items-center gap-2 rounded-md border border-dashed border-black/20 px-4 py-2 text-sm font-bold hover:border-[#FFC300] dark:border-white/20"
      >
        <Plus size={14} /> Tambah Sertifikat
      </button>

      <SaveButton onClick={handleSave} saving={saving} message={message} />
    </div>
  );
}

// ==================== REUSABLE COMPONENTS ====================
function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-black text-black dark:text-white">{title}</h2>
      <p className="mt-1 text-sm text-neutral-500">{description}</p>
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-5 dark:border-white/15 dark:bg-black">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-black dark:text-white">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-black/10 bg-white px-4 py-2 text-sm dark:border-white/15 dark:bg-neutral-900 dark:text-white"
      />
    </div>
  );
}

function SaveButton({ onClick, saving, message }: { onClick: () => void; saving: boolean; message: string }) {
  return (
    <div className="sticky bottom-4 flex items-center justify-end gap-3 rounded-lg border border-black/10 bg-white/95 p-4 shadow-lg backdrop-blur-xl dark:border-white/15 dark:bg-black/95">
      {message && <span className="text-sm font-bold text-green-600">{message}</span>}
      <button
        onClick={onClick}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-md bg-[#FFC300] px-6 py-3 text-sm font-bold text-black shadow-lg transition hover:bg-[#ffd84a] disabled:opacity-50"
      >
        <Save size={16} />
        {saving ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </div>
  );
}