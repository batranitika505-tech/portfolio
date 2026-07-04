'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, FileText, Send, X, CheckCircle } from 'lucide-react';
import { useState, useRef } from 'react';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCancelFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFile(null);
    const input = document.getElementById('resume-upload') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    const formData = new FormData(e.currentTarget);

    // Manually append file from state (file input is outside the <form> element)
    if (selectedFile) {
      formData.append('attachment', selectedFile, selectedFile.name);
    }

    // FormSubmit.co configuration fields
    formData.append('_subject', `Portfolio Contact from ${formData.get('name')}`);
    formData.append('_captcha', 'false');
    formData.append('_template', 'table');

    try {
      const res = await fetch('https://formsubmit.co/ajax/batranitika505@gmail.com', {
        method: 'POST',
        body: formData,
        // Do NOT set Content-Type — browser must set multipart boundary automatically
      });

      if (res.ok) {
        setStatus('success');
        formRef.current?.reset();
        setSelectedFile(null);
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 4000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
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
                Let&apos;s Build Something Great.
              </h2>
              <p className="text-white/60 mb-10 text-lg">
                I&apos;m currently open for new opportunities. Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you!
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
                <span>Newton School of Technology, Pune</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mt-12">
              <div className="flex gap-4">
                <a
                  href="https://github.com/batranitika505-tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] cursor-none"
                >
                  <GitIcon className="w-6 h-6 text-white" />
                </a>
                <a
                  href="https://www.linkedin.com/in/nitika-batra-aa0b52246"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] cursor-none"
                >
                  <Linkedin className="w-6 h-6 text-white" />
                </a>
              </div>

              <div className="relative flex items-center gap-2">
                <input
                  type="file"
                  id="resume-upload"
                  name="attachment"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="resume-upload"
                  className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-neon-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all duration-300 cursor-none text-sm font-medium text-white/80 hover:text-white"
                >
                  <FileText className="w-5 h-5 text-neon-cyan" />
                  {selectedFile ? `Selected: ${selectedFile.name.substring(0, 15)}${selectedFile.name.length > 15 ? '...' : ''}` : 'Upload Resume'}
                </label>

                {selectedFile && (
                  <button
                    type="button"
                    onClick={handleCancelFile}
                    className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all duration-300 cursor-none flex items-center justify-center"
                    title="Remove selected file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="w-full md:w-1/2">
            <form
              ref={formRef}
              className="flex flex-col gap-6"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
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

              <button
                type="submit"
                disabled={status === 'sending'}
                className="relative w-full py-4 rounded-xl font-bold text-black overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed transition-opacity"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple" />
                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-blue opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {status === 'sending' && (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Sending...
                    </>
                  )}
                  {status === 'success' && (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Sent Successfully!
                    </>
                  )}
                  {status === 'error' && 'Failed — Try Again'}
                  {status === 'idle' && (
                    <>
                      Send Message <Send className="w-4 h-4" />
                    </>
                  )}
                </span>
              </button>

              {status === 'error' && (
                <p className="text-red-400 text-sm text-center">
                  Something went wrong. Please email me directly at batranitika505@gmail.com
                </p>
              )}
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
