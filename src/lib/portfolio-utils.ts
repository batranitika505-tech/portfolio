export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface StreaksResult {
  currentStreak: number;
  longestStreak: number;
}

/**
 * Calculates current and longest streaks from chronologically sorted contribution days.
 * @param contributions Array of contribution days
 * @param referenceDate Optional date to evaluate current streak against (defaults to new Date())
 */
export function calculateStreaks(
  contributions: ContributionDay[],
  referenceDate: Date = new Date()
): StreaksResult {
  let longestStreak = 0;
  let tempStreak = 0;

  // contributions are sorted chronologically
  contributions.forEach((day) => {
    if (day.count > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  });

  const todayStr = referenceDate.toISOString().split('T')[0];
  const yesterday = new Date(referenceDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let currentStreak = 0;
  const revContribs = [...contributions].reverse();
  const hasRecentCommits = revContribs.some(
    (c) => (c.date === todayStr || c.date === yesterdayStr) && c.count > 0
  );

  if (hasRecentCommits) {
    for (const day of revContribs) {
      if (day.date > todayStr) continue;
      if (day.count > 0) {
        currentStreak++;
      } else {
        if (currentStreak > 0) break;
      }
    }
  }

  return { currentStreak, longestStreak };
}

export type TerminalCommandAction =
  | { type: 'navigate'; section: string }
  | { type: 'resume' }
  | { type: 'clear' }
  | { type: 'exit' }
  | { type: 'help' }
  | { type: 'unknown'; command: string };

export const SECTION_MAP: Record<string, string> = {
  home: 'hero',
  about: 'about',
  skills: 'skills',
  projects: 'projects',
  work: 'projects',
  education: 'education',
  github: 'github',
  contact: 'contact',
};

/**
 * Parse an interactive terminal input command
 */
export function parseTerminalCommand(raw: string): TerminalCommandAction {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) {
    return { type: 'unknown', command: '' };
  }

  const [cmd] = trimmed.split(/\s+/);

  if (cmd === 'help') return { type: 'help' };
  if (cmd === 'clear') return { type: 'clear' };
  if (cmd === 'exit' || cmd === 'close') return { type: 'exit' };
  if (cmd === 'resume') return { type: 'resume' };

  if (cmd in SECTION_MAP) {
    return { type: 'navigate', section: SECTION_MAP[cmd] };
  }

  return { type: 'unknown', command: cmd };
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  file?: {
    name: string;
    size: number;
  } | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Validates contact form submission data
 */
export function validateContactForm(data: ContactFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Name is required.';
  } else if (data.name.trim().length > 100) {
    errors.name = 'Name must be under 100 characters.';
  }

  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!data.message || data.message.trim().length === 0) {
    errors.message = 'Message is required.';
  } else if (data.message.trim().length > 5000) {
    errors.message = 'Message must be under 5000 characters.';
  }

  if (data.file) {
    const ext = '.' + (data.file.name.split('.').pop()?.toLowerCase() || '');
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      errors.file = 'Only .pdf, .doc, or .docx files are allowed.';
    } else if (data.file.size > MAX_FILE_SIZE) {
      errors.file = 'File size exceeds the 5MB limit.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
