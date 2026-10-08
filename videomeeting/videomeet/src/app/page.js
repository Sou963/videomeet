import Navbar from "../components/home/Navbar";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import QuickJoin from "@/components/home/QuickJoin";
import HowItWorks from "../components/home/HowItWorks";
import UseCases from "../components/home/UseCases";
import Security from "@/components/home/Security";
import CTA from "@/components/home/CTA";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <QuickJoin />
      <HowItWorks />
      <UseCases />
      <Security />
      <CTA />
      <Footer />

      {/* <main className="pt-16">
        <h1 className="text-center text-4xl font-bold">Welcome to VideoMeet</h1>
      </main> */}
    </>
  );
}
