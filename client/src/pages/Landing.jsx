import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";
import Templates from "../components/Templates";
import CTA from "../components/CTA";
function Landing() {
  return (
    <div className="min-h-screen bg-[#FFF8F5]">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Templates />
      <CTA />
      <Footer />
      
    </div>
  );
}

export default Landing;