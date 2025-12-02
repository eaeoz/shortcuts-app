import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param dirty - The potentially unsafe HTML string
 * @returns Sanitized HTML string safe for rendering
 */
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
};

/**
 * Sanitize user input to remove any HTML/script tags
 * @param input - The user input string
 * @returns Sanitized plain text string
 */
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};

/**
 * Validate and sanitize URL
 * @param url - The URL to validate
 * @returns Sanitized URL or null if invalid
 */
export const sanitizeUrl = (url: string): string | null => {
  try {
    const sanitized = DOMPurify.sanitize(url, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
    
    // Validate URL format
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(sanitized)) {
      return null;
    }
    
    // Ensure URL has protocol
    if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
      return `https://${sanitized}`;
    }
    
    return sanitized;
  } catch {
    return null;
  }
};

/**
 * Escape HTML special characters
 * @param text - The text to escape
 * @returns Escaped text safe for HTML rendering
 */
export const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return text.replace(/[&<>"'/]/g, (char) => map[char]);
};

/**
 * Validate email format
 * @param email - The email to validate
 * @returns true if valid email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

/**
 * Validate password strength
 * @param password - The password to validate
 * @returns Object with validation result and message
 */
export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  
  // Check for at least one letter and one number (optional but recommended)
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (!hasLetter || !hasNumber) {
    return { 
      isValid: true, // Still valid but weak
      message: 'Consider using both letters and numbers for a stronger password' 
    };
  }
  
  return { isValid: true, message: 'Password strength: Good' };
};

/**
 * Sanitize shortcode to ensure it follows rules
 * @param shortCode - The short code to validate
 * @returns Sanitized shortcode or null if invalid
 */
export const sanitizeShortCode = (shortCode: string): string | null => {
  // Remove any non-alphanumeric characters
  const sanitized = shortCode.replace(/[^a-zA-Z0-9]/g, '');
  
  // Validate length (4-10 characters)
  if (sanitized.length < 4 || sanitized.length > 10) {
    return null;
  }
  
  return sanitized;
};

/**
 * Prevent common injection patterns in user input
 * @param input - The input to check
 * @returns true if input contains suspicious patterns
 */
export const containsSuspiciousPatterns = (input: string): boolean => {
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers like onclick=
    /<iframe/i,
    /eval\(/i,
    /expression\(/i,
    /vbscript:/i,
    /data:text\/html/i,
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(input));
};

/**
 * Safe JSON parse with error handling
 * @param jsonString - The JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed object or fallback
 */
export const safeJsonParse = <T>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return fallback;
  }
};

/**
 * Prevent tabnabbing attacks by adding rel attributes to external links
 * @param url - The URL to check
 * @returns Appropriate rel attribute value
 */
export const getSecureRelAttribute = (url: string): string => {
  try {
    const urlObj = new URL(url);
    if (urlObj.origin !== window.location.origin) {
      return 'noopener noreferrer';
    }
  } catch {
    // Invalid URL, treat as external
    return 'noopener noreferrer';
  }
  return '';
};

/**
 * Rate limiting helper for client-side (e.g., form submissions)
 * @param key - Unique identifier for the action
 * @param limit - Number of attempts allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if action is allowed, false if rate limited
 */
export const isRateLimited = (key: string, limit: number, windowMs: number): boolean => {
  const now = Date.now();
  const storageKey = `rateLimit_${key}`;
  
  try {
    const stored = localStorage.getItem(storageKey);
    const attempts: number[] = stored ? JSON.parse(stored) : [];
    
    // Remove old attempts outside the time window
    const validAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
    
    if (validAttempts.length >= limit) {
      return true; // Rate limited
    }
    
    // Add current attempt
    validAttempts.push(now);
    localStorage.setItem(storageKey, JSON.stringify(validAttempts));
    
    return false; // Not rate limited
  } catch {
    // If localStorage fails, allow the action (fail open)
    return false;
  }
};

/**
 * Clear rate limit for a specific key
 * @param key - The rate limit key to clear
 */
export const clearRateLimit = (key: string): void => {
  try {
    localStorage.removeItem(`rateLimit_${key}`);
  } catch {
    // Ignore errors
  }
};
