// assets/js/auth.js

// ——————————————————————————————————————————————————————————————————————
// Simple in-memory credentials store.
// In a real app you’d point this at a server or use OAuth/OIDC.
// ——————————————————————————————————————————————————————————————————————
const CREDENTIALS = {
  planner:   { user: "planner",   pass: "plan1234" },
  technician:{ user: "tech",      pass: "tech1234" },
  admin:     { user: "administrator", pass: "admin1234" }
};

/**
 * Validate a login attempt.
 * @param {string} role    – one of "planner"|"technician"|"admin"
 * @param {string} username
 * @param {string} password
 * @returns {boolean}
 */
export function validateLogin(role, username, password) {
  const cred = CREDENTIALS[role];
  return cred
    && cred.user   === username
    && cred.pass   === password;
}
