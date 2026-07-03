'use client';

import { motion } from 'framer-motion';

const EXPERIENCES = [
  {
    role: 'Senior Frontend Engineer',
    company: 'TechNova',
    period: '2022 - Present',
    description: 'Led the migration to Next.js 14, improving performance scores by 40%. Architected a scalable 3D configuration tool using Three.js.'
  },
  {
    role: 'Full Stack Developer',
    company: 'InnovateSpace',
    period: '2020 - 2022',
    description: 'Developed real-time collaboration features using WebSockets and Redis. Reduced server costs by 30% through GraphQL optimization.'
  },
  {
    role: 'UI Developer',
    company: 'Creative Labs',
    period: '2018 - 2020',
    description: 'Built award-winning marketing sites with GSAP and WebGL. Created internal design system components.'
  }
];

export default function Experience() {
  return (
    <section className="relative w-full py-32 px-4 sm:px-10 max-w-6xl mx-auto min-h-screen flex flex-col justify-center">
      <div className="text-center mb-24">
        <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30">
          Experience
        </h2>
      </div>

      <div className="relative">
        {/* Connecting Glowing Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-white/5 md:-translate-x-1/2 rounded-full overflow-hidden">
          <motion.div 
            className="w-full h-1/3 bg-gradient-to-b from-transparent via-neon-cyan to-transparent shadow-[0_0_15px_#00fff0]"
            animate={{ y: ["-100%", "300%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="flex flex-col gap-12">
          {EXPERIENCES.map((exp, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div key={exp.company} className={`relative flex flex-col md:flex-row ${isLeft ? '' : 'md:flex-row-reverse'} items-center w-full group`}>
                
                {/* Node */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-black border-2 border-neon-cyan rounded-full md:-translate-x-1/2 z-10 group-hover:bg-neon-cyan group-hover:shadow-[0_0_20px_#00fff0] transition-all duration-300" />
                
                {/* Card Container */}
                <div className="w-full md:w-1/2 pl-20 md:pl-0 flex flex-col">
                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className={`
                      relative p-8 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 
                      hover:bg-white/10 hover:border-white/20 transition-all duration-300
                      shadow-[0_0_0_rgba(0,0,0,0)] hover:shadow-[0_0_30px_rgba(181,42,255,0.15)]
                      ${isLeft ? 'md:mr-12 md:text-right text-left' : 'md:ml-12 text-left'}
                    `}
                  >
                    <h3 className="text-2xl font-bold text-white mb-2">{exp.role}</h3>
                    <div className={`flex flex-col md:flex-row items-start ${isLeft ? 'md:justify-end' : 'justify-start'} gap-2 md:gap-4 mb-4`}>
                      <span className="text-neon-cyan font-medium">{exp.company}</span>
                      <span className="text-white/40">{exp.period}</span>
                    </div>
                    <p className="text-white/70 leading-relaxed">
                      {exp.description}
                    </p>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
