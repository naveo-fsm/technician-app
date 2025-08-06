// assets/js/auth.js

const SHEETDB_URL = "https://sheetdb-proxy.<yourname>.workers.dev/api/v1/xg2dgvssxzvag/Users";

/**
 * Validate login credentials against SheetDB Users table.
 * @param {string} role - planner | technician | admin
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object|false>} - user row if valid, false otherwise
 */
async function validateLogin(role, email, password) {
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
    return false;
  }
}

/**
 * Save session to localStorage
 */
function saveSession(role, email, userObj) {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userRole', role);
  localStorage.setItem('userEmail', email.trim().toLowerCase());
  if (userObj && userObj.Name) localStorage.setItem('userName', userObj.Name);
  if (userObj && userObj.ID) localStorage.setItem('userID', userObj.ID);
}

/**
 * Logout and clear session
 */
function logout() {
  localStorage.clear();
}
