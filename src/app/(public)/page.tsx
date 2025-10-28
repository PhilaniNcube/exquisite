import { AboutSection } from "@/components/homepage/about-section";
import { ContactSection } from "@/components/homepage/contact-section";
// import Hero from "@/components/homepage/hero";
import { HeroSection } from "@/components/homepage/hero-section";
import ServicesSection from "@/components/homepage/services-section";


export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />

      <AboutSection />
      <ContactSection />
    </>
  );
}
