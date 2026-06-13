import type { Certificate, Project, SkillCategory } from "@/types/portfolio";

export const profile = {
  name: "Wais Al-Qorni",
  roles: ["IT Support", "Web Developer", "Photographer"],
  location: "Indonesia",
  email: "email@example.com",
  cvUrl: "/cv.pdf",
  summary:
    "Siswa SMK jurusan IT yang senang membangun website modern, mengelola server dasar, merapikan jaringan, dan menangkap momen lewat fotografi.",
  socials: [
    { label: "GitHub", href: "https://github.com/", icon: "Github" },
    { label: "LinkedIn", href: "https://linkedin.com/", icon: "Linkedin" },
    { label: "Instagram", href: "https://instagram.com/", icon: "Instagram" },
    { label: "WhatsApp", href: "https://wa.me/6280000000000", icon: "MessageCircle" }
  ]
};

export const aboutItems = [
  {
    title: "Tentang Saya",
    description:
      "Saya berfokus pada solusi IT yang rapi, website yang cepat, dan visual yang enak dilihat.",
    icon: "BadgeCheck"
  },
  {
    title: "Pendidikan",
    description:
      "Siswa SMK jurusan IT dengan pembelajaran aktif di jaringan, pemrograman web, dan administrasi sistem.",
    icon: "GraduationCap"
  },
  {
    title: "Pengalaman PKL",
    description:
      "Terbiasa membantu troubleshooting perangkat, instalasi software, konfigurasi jaringan, dan dokumentasi teknis.",
    icon: "BriefcaseBusiness"
  },
  {
    title: "Hobi",
    description:
      "Fotografi, eksplorasi teknologi web, belajar Linux server, dan membuat konten visual.",
    icon: "Camera"
  }
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    icon: "Code2",
    skills: [
      { name: "HTML", percentage: 90, icon: "FileCode2" },
      { name: "CSS", percentage: 86, icon: "Palette" },
      { name: "JavaScript", percentage: 78, icon: "Code2" },
      { name: "TypeScript", percentage: 70, icon: "Code2" },
      { name: "Tailwind CSS", percentage: 82, icon: "Palette" },
      { name: "Next.js", percentage: 74, icon: "FileCode2" }
    ]
  },
  {
    title: "Backend",
    icon: "Database",
    skills: [
      { name: "PHP", percentage: 76, icon: "Code2" },
      { name: "Laravel", percentage: 70, icon: "FileCode2" },
      { name: "MySQL", percentage: 78, icon: "Database" },
      { name: "REST API", percentage: 72, icon: "Server" }
    ]
  },
  {
    title: "IT Support",
    icon: "Wrench",
    skills: [
      { name: "Linux", percentage: 80, icon: "Terminal" },
      { name: "Ubuntu Server", percentage: 76, icon: "Server" },
      { name: "Networking", percentage: 82, icon: "Network" },
      { name: "Mikrotik", percentage: 68, icon: "Network" },
      { name: "SSH", percentage: 78, icon: "Terminal" },
      { name: "Git & GitHub", percentage: 84, icon: "Github" }
    ]
  },
  {
    title: "Design",
    icon: "Palette",
    skills: [
      { name: "Canva", percentage: 88, icon: "Palette" },
      { name: "Photoshop", percentage: 72, icon: "Palette" },
      { name: "Photography", percentage: 84, icon: "Camera" }
    ]
  }
];

export const projects: Project[] = [
  {
    title: "School Helpdesk Dashboard",
    description:
      "Dashboard tiket sederhana untuk mencatat keluhan perangkat, status penanganan, dan riwayat teknisi.",
    image: "/project-helpdesk.svg",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Landing Page Fotografi",
    description:
      "Website showcase portofolio foto dengan galeri responsif dan tampilan gelap yang elegan.",
    image: "/project-photo.svg",
    tech: ["HTML", "CSS", "JavaScript"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    title: "Network Inventory App",
    description:
      "Aplikasi pencatatan perangkat jaringan, IP address, lokasi perangkat, dan catatan maintenance.",
    image: "/project-network.svg",
    tech: ["Laravel", "MySQL", "REST API"],
    demoUrl: "#",
    githubUrl: "#"
  }
];

export const stats = [
  { label: "Projects", value: 10, suffix: "+", icon: "Code2" },
  { label: "Certificates", value: 3, suffix: "+", icon: "ShieldCheck" },
  { label: "Years Learning", value: 2, suffix: "+", icon: "GraduationCap" },
  { label: "Git Commits", value: 100, suffix: "+", icon: "Github" }
];

export const certificates: Certificate[] = [
  {
    title: "Dasar Pemrograman Web",
    issuer: "Dicoding / Sekolah",
    image: "/certificate-web.svg"
  },
  {
    title: "Linux Fundamental",
    issuer: "Training Internal",
    image: "/certificate-linux.svg"
  },
  {
    title: "Networking Basic",
    issuer: "SMK / PKL",
    image: "/certificate-network.svg"
  }
];

export const contactInfo = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: "Mail" },
  ...profile.socials
];
