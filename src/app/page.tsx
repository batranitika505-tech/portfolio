import Scene from "@/components/canvas/Scene";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Education from "@/components/sections/Education";
import Github from "@/components/sections/Github";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen">
      {/* Global 3D Canvas */}
      <Scene />
      
      {/* Scrollable Content */}
      <div className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Github />
        <Contact />
      </div>
    </main>
  );
}
