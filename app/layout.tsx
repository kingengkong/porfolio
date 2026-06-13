import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Loader } from "@/components/loader";
import { BackgroundEffects } from "@/components/background-effects";
import { CustomCursor } from "@/components/custom-cursor"; // ✅ TAMBAHKAN IMPORT INI

export const metadata: Metadata = {
  title: {
    default: "Portfolio waisalqorni",
    template: "%s | Portfolio"
  },
  description:
    "Portfolio pribadi siswa SMK jurusan IT dengan minat IT Support, Web Development, dan Fotografi.",
  keywords: [
    "portfolio",
    "it support",
    "web developer",
    "photographer",
    "siswa smk",
    "nextjs"
  ],
  authors: [{ name: "Wais Al-Qorni" }],
  openGraph: {
    title: "Portfolio IT Support, Web Developer, Photographer",
    description:
      "Profil, skill, project, sertifikat, dan kontak siswa SMK jurusan IT.",
    type: "website",
    locale: "id_ID"
  },
  icons: {
    icon: '/logo-baru.png',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem
          disableTransitionOnChange // ✅ TAMBAHKAN INI untuk mencegah flash saat ganti tema
        >
          <Loader />
          <BackgroundEffects />
          <CustomCursor /> {/* ✅ CustomCursor sekarang sudah di-import */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}