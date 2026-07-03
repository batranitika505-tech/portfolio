'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommandOutput {
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
}

const SECTION_COMMANDS: Record<string, string> = {
  about: 'about',
  skills: 'skills',
  projects: 'featured work',
  work: 'featured work',
  contact: 'contact',
};

function scrollToSection(sectionKeyword: string): boolean {
  const sections = Array.from(document.querySelectorAll('section'));
  for (const sec of sections) {
    const text = sec.textContent?.toLowerCase() || '';
    if (text.includes(sectionKeyword.toLowerCase())) {
      sec.scrollIntoView({ behavior: 'smooth' });
      return true;
    }
  }
  return false;
}

const COMMAND_RESPONSES: Record<string, string[]> = {
  resume: [
    "Retrieving resume link...",
    "SUCCESS: Resume generated successfully.",
    "Link: [Click here to view PDF] (Redirecting to /resume.pdf...)"
  ]
};

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
      if (e.key === '`1' || e.key === '`' || e.key === '~') {
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

    const args = trimmedCmd.split(' ');
    const mainCommand = args[0];

    switch (mainCommand) {
      case 'help':
        setHistory((prev) => [
          ...prev,
          { text: "Available commands:", type: 'output' },
          { text: "  about        - Navigate to the About section", type: 'output' },
          { text: "  skills       - Navigate to the Skills section", type: 'output' },
          { text: "  projects     - Navigate to the Projects section", type: 'output' },
          { text: "  contact      - Navigate to the Contact section", type: 'output' },
          { text: "  resume       - Get link to professional resume", type: 'output' },
          { text: "  clear        - Clear terminal log screen", type: 'output' },
          { text: "  exit / close - Close the terminal window", type: 'output' }
        ]);
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'exit':
      case 'close':
        setIsOpen(false);
        break;
      case 'about':
      case 'skills':
      case 'projects':
      case 'work':
      case 'contact': {
        const keyword = SECTION_COMMANDS[mainCommand];
        const found = scrollToSection(keyword);
        if (found) {
          setHistory((prev) => [...prev, { text: `Navigating to '${mainCommand}' section...`, type: 'success' }]);
          setTimeout(() => setIsOpen(false), 600);
        } else {
          setHistory((prev) => [...prev, { text: `Error: Could not find '${mainCommand}' section.`, type: 'error' }]);
        }
        break;
      }
      default:
        if (COMMAND_RESPONSES[mainCommand]) {
          const lines = COMMAND_RESPONSES[mainCommand];
          setHistory((prev) => [
            ...prev,
            ...lines.map((line) => ({ text: line, type: 'output' as const }))
          ]);
        } else {
          setHistory((prev) => [
            ...prev,
            { text: `bash: command not found: ${mainCommand}. Type 'help' for options.`, type: 'error' }
          ]);
        }
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
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md pointer-events-auto"
        >
          {/* Main Terminal Window */}
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl h-[60vh] bg-black/90 border border-neon-cyan/30 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.15)] flex flex-col font-mono"
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-6 py-3 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <span className="ml-3 text-xs text-white/40 select-none">nitika@space-deck: ~ (press ~ to exit)</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            {/* Terminal Screen / Output Log */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 scrollbar-thin select-text">
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
            <div className="p-6 bg-white/5 border-t border-white/10 flex items-center gap-2">
              <span className="text-neon-cyan font-bold select-none">nitika-space-deck:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-white font-mono caret-neon-cyan"
                placeholder="type command here..."
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
