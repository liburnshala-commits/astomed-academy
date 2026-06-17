import React from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import CourseSalesSection from "@/components/landing/CourseSalesSection";
import CourseSection from "@/components/landing/CourseSection";
import AboutSection from "@/components/landing/AboutSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <CourseSalesSection />
      <CourseSection />
      <AboutSection />
      <Footer />
    </div>
  );
}