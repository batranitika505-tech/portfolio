'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, FileText, Send } from 'lucide-react';
import { useState } from 'react';

const GitIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Contact() {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') || '';
    const email = formData.get('email') || '';
    const message = formData.get('message') || '';
    
    const mailtoUrl = `mailto:batranitika505@gmail.com?subject=Contact from ${encodeURIComponent(name as string)}&body=Name: ${encodeURIComponent(name as string)}%0DEmail: ${encodeURIComponent(email as string)}%0D%0DMessage:%0D${encodeURIComponent(message as string)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <section id="contact" className="relative w-full py-32 px-4 sm:px-10 max-w-5xl mx-auto min-h-screen flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 via-neon-purple/20 to-neon-cyan/20 blur-[100px] -z-10 rounded-full" />
        
        <div className="w-full flex flex-col md:flex-row gap-12 p-8 md:p-12 rounded-3xl backdrop-blur-xl bg-black/40 border border-white/10 shadow-2xl">
          {/* Info Side */}
          <div className="w-full md:w-1/2 flex flex-col justify-between">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 mb-6">
                Let's Build Something Great.
              </h2>
              <p className="text-white/60 mb-10 text-lg">
                I'm currently open for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
              </p>
            </div>

            <div className="space-y-6">
              <a href="mailto:batranitika505@gmail.com" className="flex items-center gap-4 text-white/80 hover:text-neon-cyan transition-colors group">
                <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:border-neon-cyan transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <span>batranitika505@gmail.com</span>
              </a>
              <div className="flex items-center gap-4 text-white/80">
                <div className="p-3 rounded-full bg-white/5 border border-white/10">
                  <MapPin className="w-5 h-5" />
                </div>
                <span>San Francisco, CA</span>
              </div>
            </div>

            <div className="flex gap-4 mt-12">
              {[GitIcon, Linkedin, FileText].map((Icon, i) => (
                <a key={i} href="#" className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                  <Icon className="w-6 h-6 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Form Side */}
          <div className="w-full md:w-1/2">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="relative">
                <input 
                  type="text" 
                  name="name"
                  placeholder="Your Name"
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-neon-purple transition-colors"
                  required
                />
                {focusedField === 'name' && (
                  <motion.div layoutId="glow" className="absolute -inset-0.5 bg-neon-purple/50 blur opacity-50 rounded-xl -z-10" />
                )}
              </div>

              <div className="relative">
                <input 
                  type="email" 
                  name="email"
                  placeholder="Your Email"
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-neon-blue transition-colors"
                  required
                />
                {focusedField === 'email' && (
                  <motion.div layoutId="glow" className="absolute -inset-0.5 bg-neon-blue/50 blur opacity-50 rounded-xl -z-10" />
                )}
              </div>

              <div className="relative">
                <textarea 
                  name="message"
                  placeholder="Your Message"
                  rows={5}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-neon-cyan transition-colors resize-none"
                  required
                />
                {focusedField === 'message' && (
                  <motion.div layoutId="glow" className="absolute -inset-0.5 bg-neon-cyan/50 blur opacity-50 rounded-xl -z-10" />
                )}
              </div>

              <button type="submit" className="relative w-full py-4 rounded-xl font-bold text-black overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple" />
                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Send Message <Send className="w-4 h-4" />
                </span>
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
