"use client";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef, FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { SectionHeading } from "@/components/section-heading";
import { usePortfolioData } from "@/hooks/use-portfolio-data";
import { getIconComponent } from "@/lib/icon-map";

export function Contact() {
  const { data, loading } = usePortfolioData();
  const contactInfo = data.contactInfo;
  const profile = data.profile;

  // Pisahkan email dari social media agar tidak duplikat
  const emailContact = contactInfo.find((item) => item.label === "Email");
  const socialMedia = contactInfo.filter((item) => item.label !== "Email");

  // State untuk form EmailJS
  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Fungsi kirim email via EmailJS
  const sendEmail = async (e: FormEvent) => {
    e.preventDefault();

    if (!formRef.current) {
      console.error("Form ref tidak ada");
      return;
    }

    setIsSending(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error("EmailJS configuration missing. Check your .env.local file.");
      }

      const result = await emailjs.sendForm(serviceId, templateId, formRef.current, {
        publicKey: publicKey,
      });

      console.log("✅ Email berhasil dikirim!", result.text);
      setStatus("success");
      formRef.current.reset();

      setTimeout(() => setStatus("idle"), 5000);
    } catch (error: any) {
      console.error("❌ Gagal kirim email:", error);
      setStatus("error");
      const errorMsg = error?.text || error?.message || "Gagal mengirim pesan. Silakan coba lagi.";
      setErrorMessage(errorMsg);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <section id="contact" className="container-page py-24">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#FFC300] border-t-transparent" />
      </section>
    );
  }

  return (
    <section id="contact" className="container-page py-24">
      <SectionHeading
        eyebrow="Contact"
        title="Mari Terhubung"
        description="Untuk kolaborasi, pertanyaan project, atau diskusi seputar IT Support dan Web Development."
      />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Contact Info - Email & Social Media */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          transition={{ duration: 0.5 }}
          className="glass rounded-lg p-6"
        >
          <h3 className="text-xl font-bold text-black dark:text-white mb-6">Informasi Kontak</h3>

          {/* Email Section */}
          {emailContact && (
            <a
              href={emailContact.href}
              className="flex items-center gap-3 rounded-md border border-black/10 bg-white p-4 text-neutral-700 transition hover:-translate-y-0.5 hover:border-[#FFC300] hover:text-[#FFC300] dark:border-white/15 dark:bg-black dark:text-neutral-200 dark:hover:text-[#FFC300] mb-4"
            >
              <span className="grid h-10 w-10 place-items-center rounded-md bg-[#FFC300] text-black">
                {(() => {
                  const Icon = getIconComponent(emailContact.icon);
                  return <Icon size={18} />;
                })()}
              </span>
              <span>
                <span className="block text-sm font-bold">Email</span>
                <span className="block text-sm opacity-75">{emailContact.value}</span>
              </span>
            </a>
          )}

          {/* Social Media Section */}
          <div className="mt-6">
            <h4 className="text-sm font-bold text-neutral-600 dark:text-neutral-400 mb-3">Social Media</h4>
            <div className="grid gap-3">
              {socialMedia.map((item) => {
                const Icon = getIconComponent(item.icon);
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-md border border-black/10 bg-white p-4 text-neutral-700 transition hover:-translate-y-0.5 hover:border-[#FFC300] hover:text-[#FFC300] dark:border-white/15 dark:bg-black dark:text-neutral-200 dark:hover:text-[#FFC300]"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-md bg-[#FFC300] text-black">
                      <Icon size={18} />
                    </span>
                    <span>
                      <span className="block text-sm font-bold">{item.label}</span>
                      <span className="block text-sm opacity-75 truncate">{item.href}</span>
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Contact Form - EmailJS */}
        <motion.form
          ref={formRef}
          onSubmit={sendEmail}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="glass rounded-lg p-6"
        >
          <h3 className="text-xl font-bold text-black dark:text-white mb-6">Kirim Pesan</h3>

          {/* Pesan Sukses */}
          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-center gap-2 rounded-md border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400"
            >
              <CheckCircle2 size={18} />
              <span>Pesan berhasil dikirim! Saya akan segera membalas.</span>
            </motion.div>
          )}

          {/* Pesan Error */}
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400"
            >
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
              Nama
              <input
                name="from_name"
                required
                disabled={isSending}
                className="rounded-md border border-black/10 bg-white px-4 py-3 text-black outline-none transition focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 disabled:opacity-50 dark:border-white/15 dark:bg-black dark:text-white"
                placeholder="Nama kamu"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
              Email
              <input
                name="from_email"
                type="email"
                required
                disabled={isSending}
                className="rounded-md border border-black/10 bg-white px-4 py-3 text-black outline-none transition focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 disabled:opacity-50 dark:border-white/15 dark:bg-black dark:text-white"
                placeholder="email@example.com"
              />
            </label>
          </div>
          <label className="mt-4 grid gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
            Pesan
            <textarea
              name="message"
              required
              rows={7}
              disabled={isSending}
              className="resize-none rounded-md border border-black/10 bg-white px-4 py-3 text-black outline-none transition focus:border-[#FFC300] focus:ring-4 focus:ring-[#FFC300]/20 disabled:opacity-50 dark:border-white/15 dark:bg-black dark:text-white"
              placeholder="Tulis pesan kamu..."
            />
          </label>

          {/* Hidden input untuk email tujuan (email kamu) */}
          <input type="hidden" name="to_email" value={profile.email} />

          <button
            type="submit"
            disabled={isSending}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#FFC300] px-5 py-3 text-sm font-bold text-black shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#ffd84a] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isSending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Send size={18} />
                Kirim Pesan
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}