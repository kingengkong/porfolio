import { About } from "@/components/about";
import { BackToTop } from "@/components/back-to-top";
import { Certificates } from "@/components/certificates";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Gallery } from "@/components/gallery";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { Statistics } from "@/components/statistics";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Gallery />
        <Statistics />
        <Certificates />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
