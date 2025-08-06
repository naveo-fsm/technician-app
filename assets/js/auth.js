// assets/js/auth.js

// ———————————————————————————————————————————————
// SheetDB API endpoint (update as needed)
const SHEETDB_URL = "https://sheetdb.io/api/v1/xg2dgvssxzvag/Users";

// ———————————————————————————————————————————————
// Validate login credentials against SheetDB Users table
// @param {string} role - planner | technician | admin
// @param {string} email
// @param {string} password
// @returns {Promise<object|false>} - user row if valid, false otherwise
export async function validateLogin(role, email, password) {
  // Build SheetDB query string
  const url = `${SHEETDB_URL}/search?Role=${encodeURIComponent(role)}&Email=${encodeURIComponent(email.trim())}&Status=Active`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network error");
    const users = await res.json();
    if (!Array.isArray(users) || users.length === 0) return false;
    // Password check (case-sensitive)
    const user = users.find(u => u.Password === password);
    return user || false;
  } catch (err) {
    // Optionally log or show error
    return false;
  }
}

// Save session (same as before)
export function saveSession(role, email, userObj) {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userRole', role);
  localStorage.setItem('userEmail', email.trim().toLowerCase());
  if (userObj && userObj.Name) localStorage.setItem('userName', userObj.Name);
  if (userObj && userObj.ID) localStorage.setItem('userID', userObj.ID);
}

// Logout (same as before)
export function logout() {
  localStorage.clear();
}
