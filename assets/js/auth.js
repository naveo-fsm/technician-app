// assets/js/auth.js

// ————————————————————————————————————————————————————————————————
// Simple credentials store.
// For production, replace with SheetDB/DB fetch or OAuth integration.
// ————————————————————————————————————————————————————————————————
const CREDENTIALS = {
  planner:    { email: "planner@naveo.mu",    pass: "plan1234"   },
  technician: { email: "tech@naveo.mu",       pass: "tech1234"   },
  admin:      { email: "administrator@naveo.mu", pass: "admin1234" }
};

/**
 * Validate a login attempt.
 * @param {string} role      "planner"|"technician"|"admin"
 * @param {string} email     Login email/username
 * @param {string} password
 * @returns {boolean}
 */
export function validateLogin(role, email, password) {
  if (!CREDENTIALS[role]) return false;
  // case-insensitive email match, exact password match
  return (
    CREDENTIALS[role].email.toLowerCase() === email.trim().toLowerCase()
    && CREDENTIALS[role].pass === password
  );
}

/**
 * Save session to localStorage
 * @param {string} role
 * @param {string} email
 */
export function saveSession(role, email) {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userRole', role);
  localStorage.setItem('userEmail', email.trim().toLowerCase());
}

/**
 * Logout and clear session
 */
export function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
}
