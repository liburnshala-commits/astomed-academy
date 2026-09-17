import React from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import StatsBar from "@/components/landing/StatsBar";
import CategoryNav from "@/components/landing/CategoryNav";
import CourseSalesSection from "@/components/landing/CourseSalesSection";
import NewsSection from "@/components/landing/NewsSection";
import CourseSection from "@/components/landing/CourseSection";
import PremiumModulesSection from "@/components/landing/PremiumModulesSection";
import SpecialistCoursesSection from "@/components/landing/SpecialistCoursesSection";
import MachineTrainingSection from "@/components/landing/MachineTrainingSection";
import PedagogySection from "@/components/landing/PedagogySection";
import Testimonials from "@/components/landing/Testimonials";
import AboutSection from "@/components/landing/AboutSection";
import RequestAccessSection from "@/components/landing/RequestAccessSection";
import Footer from "@/components/landing/Footer";
import { CheckCircle } from "lucide-react";

export default function Home() {
  const [searchParams] = useSearchParams();
  const bundleSuccess = searchParams.get("payment") === "bundle_success";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <StatsBar />
      <CategoryNav />
      {bundleSuccess && (
        <div className="bg-green-50 border-b border-green-200 py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
            <div>
              <p className="font-heading font-semibold text-green-800">Köp genomfört – välkommen till Grundkursen!</p>
              <p className="text-sm text-green-700 mt-0.5">Du har nu tillgång till alla moduler. Logga in och klicka på en modul nedan för att börja.</p>
            </div>
          </div>
        </div>
      )}
      <CourseSalesSection />
      <NewsSection />
      <CourseSection />
      <PremiumModulesSection />
      <SpecialistCoursesSection />
      <MachineTrainingSection />
      <PedagogySection />
      <Testimonials />
      <AboutSection />
      <RequestAccessSection />
      <Footer />
      {/* Spacer for mobile sticky apply button */}
      <div className="h-24 lg:hidden" />
    </div>
  );
}