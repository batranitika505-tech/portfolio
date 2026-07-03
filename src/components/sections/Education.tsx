'use client';

import { motion } from 'framer-motion';

const EDUCATION = [
  {
    college: 'Nrewton School of Technology',
    degree: 'B.Tech Computer Science',
    years: '2025 - 2029',
    achievements: 'CGPA: 9.14 / 10',
    coursework: ['Data Structures', 'Computer Graphics', 'Machine Learning', 'Operating Systems']
  }
];

export default function Education() {
  return (
    <section className="relative w-full py-32 px-4 sm:px-10 max-w-4xl mx-auto flex flex-col justify-center">
      <div className="text-center mb-24">
        <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30">
          Education
        </h2>
      </div>

      <div className="space-y-16">
        {EDUCATION.map((edu, index) => (
          <motion.div
            key={edu.college}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative p-10 rounded-3xl overflow-hidden group"
          >
            {/* Glass Background */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl transition-colors duration-500 group-hover:bg-white/10" />

            {/* Ambient Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start md:items-center">
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-white mb-2">{edu.degree}</h3>
                <h4 className="text-xl text-neon-cyan mb-2">{edu.college}</h4>
                <p className="text-white/50 mb-6">{edu.years}</p>
                <p className="text-white/80 leading-relaxed mb-6">
                  {edu.achievements}
                </p>
                <div>
                  <h5 className="text-sm uppercase tracking-wider text-white/40 mb-3">Relevant Coursework</h5>
                  <div className="flex flex-wrap gap-2">
                    {edu.coursework.map(course => (
                      <span key={course} className="px-3 py-1 rounded-full bg-black/50 border border-white/5 text-sm text-white/70">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative 3D Element Placeholder (SVG for performance here since canvas is heavy if repeated) */}
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border border-white/10 flex items-center justify-center relative shadow-[inset_0_0_50px_rgba(255,255,255,0.05)]">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full border-t border-r border-neon-cyan rounded-full absolute top-0 left-0"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="w-[80%] h-[80%] border-b border-l border-neon-purple rounded-full absolute top-[10%] left-[10%]"
                />
                <div className="w-12 h-12 bg-white/20 rounded-full blur-md" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
