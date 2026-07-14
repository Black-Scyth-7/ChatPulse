import { CTA } from "@/components/landing/CTA";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Nav } from "@/components/landing/Nav";
import { Security } from "@/components/landing/Security";
import { SocialProof } from "@/components/landing/SocialProof";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Features />
        <SocialProof />
        <Security />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
