'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseTerminalCommand } from '@/lib/portfolio-utils';

interface CommandOutput {
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
}

function scrollToSection(sectionTarget: string): boolean {
  const el = document.getElementById(sectionTarget);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    return true;
  }
  const sections = Array.from(document.querySelectorAll('section'));
  for (const sec of sections) {
    const text = sec.textContent?.toLowerCase() || '';
    if (text.includes(sectionTarget.toLowerCase())) {
      sec.scrollIntoView({ behavior: 'smooth' });
      return true;
    }
  }
  return false;
}

export default function InteractiveTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandOutput[]>([
    { text: "Welcome to Nitika's Interactive Space Terminal.", type: 'success' },
    { text: "Type 'help' to see list of available commands. Press '~' or 'Escape' to exit.", type: 'output' }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Toggle terminal on tilde (~) key or backtick (`)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable);

      // Never intercept keystrokes if the user is typing inside any form field on the page
      if (isInput && target !== inputRef.current) {
        return;
      }

      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Scroll to bottom of terminal output
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    if (!trimmedCmd) return;

    // Add to history
    setHistory((prev) => [...prev, { text: `nitika-space-deck:~$ ${cmd}`, type: 'input' }]);
    setCommandHistory((prev) => [cmd, ...prev]);
    setHistoryIndex(-1);

    const action = parseTerminalCommand(trimmedCmd);

    switch (action.type) {
      case 'help':
        setHistory((prev) => [
          ...prev,
          { text: "Available commands:", type: 'output' },
          { text: "  about        - Navigate to the About section", type: 'output' },
          { text: "  skills       - Navigate to the Skills section", type: 'output' },
          { text: "  projects     - Navigate to the Projects section", type: 'output' },
          { text: "  education    - Navigate to the Education section", type: 'output' },
          { text: "  github       - Navigate to the GitHub section", type: 'output' },
          { text: "  contact      - Navigate to the Contact section", type: 'output' },
          { text: "  resume       - Open & download professional resume", type: 'output' },
          { text: "  clear        - Clear terminal log screen", type: 'output' },
          { text: "  exit / close - Close the terminal window", type: 'output' }
        ]);
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'exit':
        setIsOpen(false);
        break;
      case 'resume':
        setHistory((prev) => [
          ...prev,
          { text: "Opening Nitika's resume (/resume.pdf)...", type: 'success' },
          { text: "If the popup was blocked, you can access it directly at: /resume.pdf", type: 'output' }
        ]);
        if (typeof window !== 'undefined') {
          window.open('/resume.pdf', '_blank');
        }
        break;
      case 'navigate': {
        const found = scrollToSection(action.section);
        if (found) {
          setHistory((prev) => [...prev, { text: `Navigating to '${action.section}' section...`, type: 'success' }]);
          setTimeout(() => setIsOpen(false), 600);
        } else {
          setHistory((prev) => [...prev, { text: `Error: Could not find '${action.section}' section.`, type: 'error' }]);
        }
        break;
      }
      default:
        setHistory((prev) => [
          ...prev,
          { text: `bash: command not found: ${action.command || trimmedCmd}. Type 'help' for options.`, type: 'error' }
        ]);
    }

    setInput('');
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    }
    // Command history navigation (arrow keys)
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/70 backdrop-blur-md pointer-events-auto"
        >
          {/* Main Terminal Window */}
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl h-[82vh] sm:h-[65vh] max-h-[90vh] bg-black/92 border border-neon-cyan/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.2)] flex flex-col font-mono"
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 bg-white/5 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-[#27c93f]" />
                <span className="ml-2 sm:ml-3 text-[11px] sm:text-xs text-white/50 select-none truncate max-w-[200px] sm:max-w-none">nitika@space-deck:~ (Esc or ~ to exit)</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                aria-label="Close terminal"
                className="text-white/50 hover:text-white transition-colors text-base min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-white/5"
              >
                ✕
              </button>
            </div>

            {/* Terminal Screen / Output Log */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2 sm:space-y-3 scrollbar-thin select-text text-xs sm:text-sm">
              {history.map((line, index) => (
                <div 
                  key={index} 
                  className={`leading-relaxed whitespace-pre-wrap ${
                    line.type === 'input' ? 'text-neon-purple' :
                    line.type === 'error' ? 'text-red-400' :
                    line.type === 'success' ? 'text-neon-cyan' :
                    'text-white/80'
                  }`}
                >
                  {line.text}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Terminal Input Area */}
            <div className="px-4 py-3 sm:p-6 bg-white/5 border-t border-white/10 flex items-center gap-2 shrink-0">
              <span className="text-neon-cyan font-bold select-none text-xs sm:text-sm shrink-0">
                <span className="hidden sm:inline">nitika-space-deck:</span>~$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs sm:text-sm caret-neon-cyan min-h-[36px]"
                placeholder="type command (help, projects...)"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
