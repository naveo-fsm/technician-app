/* Naveo FSM auth helper for NocoDB v2
   - Looks up users in your NocoDB "users" table
   - Exposes Auth.login / Auth.logout / Auth.current / Auth.requireRole
   - Stores a small session in localStorage
*/
(function () {
  "use strict";

  // ======== CONFIG (edit if needed) ==========================================
  const NC_BASE_URL = "https://app.nocodb.com"; // NocoDB host
  const USERS_TABLE_ID = "mes51s7dmb2mewm";     // <-- your users table id
  const SESSION_KEY = "naveo-session";

  // If your column names differ, adjust here:
  const COL = {
    id: "id",
    email: "email_address",
    password: "password",
    role: "user_role",
    status: "status",
    name: "full_name",
    phone: "phone",
    lastLogin: "last_login",
    address: "address",
  };

  // ======== TOKEN RESOLUTION (PAT) ===========================================
  // Priority: <meta name="nocodb-pat"> -> localStorage -> throw
  function resolvePAT() {
    const meta = document.querySelector('meta[name="nocodb-pat"]');
    const pat = (meta && meta.content && meta.content.trim()) ||
                (localStorage.getItem("NC_PAT") || "").trim();
    if (!pat) {
      const err = new Error("NocoDB PAT is missing. Add <meta name='nocodb-pat' content='YOUR_PAT'> or set localStorage.NC_PAT.");
      err.code = "NO_PAT";
      throw err;
    }
    return pat;
  }

  // ======== LOW-LEVEL API HELPER =============================================
  async function ncFetch(path, options = {}) {
    const pat = resolvePAT();
    const headers = {
      "content-type": "application/json",
      "xc-token": pat,
      ...(options.headers || {}),
    };
    const res = await fetch(`${NC_BASE_URL}/api/v2${path}`, { ...options, headers });
    if (!res.ok) {
      let details = "";
      try { details = await res.text(); } catch {}
      const err = new Error(`NocoDB error ${res.status}${details ? `: ${details}` : ""}`);
      err.status = res.status;
      throw err;
    }
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    return ct.includes("application/json") ? res.json() : res.text();
  }

  // ======== USERS LOOKUP (by email) ==========================================
  async function getUserByEmail(email) {
    const where = encodeURIComponent(`(${COL.email},eq,${email})`);
    const data = await ncFetch(`/tables/${USERS_TABLE_ID}/records?where=${where}&limit=1&fields=${COL.id},${COL.email},${COL.password},${COL.role},${COL.status},${COL.name},${COL.phone},${COL.address},${COL.lastLogin}`);
    const rows = Array.isArray(data?.list) ? data.list : [];
    return rows[0] || null;
  }

  // ======== SESSION HELPERS ===================================================
  function toSession(user) {
    if (!user) return null;
    return {
      id: user[COL.id],
      email: user[COL.email],
      role: user[COL.role],
      status: user[COL.status],
      name: user[COL.name],
      phone: user[COL.phone],
      address: user[COL.address],
    };
  }
  function saveSession(session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
  function loadSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || ""); }
    catch { return null; }
  }
  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  // ======== PUBLIC API ========================================================
  async function login(email, password) {
    if (!email || !password) throw new Error("Email and password are required.");

    const user = await getUserByEmail(String(email).trim().toLowerCase());
    if (!user) {
      const e = new Error("No account found for this email.");
      e.code = "NO_USER";
      throw e;
    }

    // If later you hash passwords, replace this comparison.
    const ok = String(user[COL.password] ?? "") === String(password);
    if (!ok) {
      const e = new Error("Invalid email or password.");
      e.code = "BAD_CREDENTIALS";
      throw e;
    }

    // Enforce active status
    const status = String(user[COL.status] || "").toLowerCase();
    if (status !== "active") {
      const e = new Error("Your account is inactive. Please contact the administrator.");
      e.code = "INACTIVE";
      throw e;
    }

    // Save session
    const sess = toSession(user);
    saveSession(sess);

    // Best-effort: touch last_login
    try {
      await ncFetch(`/tables/${USERS_TABLE_ID}/records/${user[COL.id]}`, {
        method: "PATCH",
        body: JSON.stringify({ [COL.lastLogin]: new Date().toISOString() }),
      });
    } catch {}
    return sess;
  }

  function current() {
    return loadSession();
  }

  async function logout() {
    clearSession();
  }

  // Guard that ensures a user is logged in; or (optionally) redirect
  function requireRole(roles, options = {}) {
    const sess = current();
    if (!sess) {
      if (options.fallback) window.location.href = options.fallback;
      return null;
    }
    const list = Array.isArray(roles) ? roles : (roles ? [roles] : []);
    if (list.length) {
      const ok = list.map(r => String(r).toLowerCase())
                     .includes(String(sess.role || "").toLowerCase());
      if (!ok) {
        if (options.fallback) window.location.href = options.fallback;
        return null;
      }
    }
    return sess;
  }

  // Expose globally
  window.Auth = { login, current, logout, requireRole };
})();
