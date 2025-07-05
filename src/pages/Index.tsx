
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AdvancedFeaturesSection from "@/components/AdvancedFeaturesSection";
import BenefitsSection from "@/components/BenefitsSection";
import AnalyticsSection from "@/components/AnalyticsSection";
import DemoSection from "@/components/DemoSection";
import ValuePropositionSection from "@/components/ValuePropositionSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
      <Navbar />
      <HeroSection />
      <AdvancedFeaturesSection />
      <AnalyticsSection />
      <BenefitsSection />
      <ValuePropositionSection />
      <DemoSection />
      <CTASection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
