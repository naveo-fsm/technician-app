// ================== CONFIG ==================
const NC_BASE_URL = "https://app.nocodb.com/api/v2";
const NC_PAT = "7x7ZxLedCtJSWtiD4dNOu9sB7JlEFB8JiVe0TpRh";
const USERS_TABLE_ID = "mes51s7dmb2mewm";

const COL = {
  id: "id",
  email: "email_address",
  password: "password",
  role: "user_role",
  status: "status",
  phone: "phone",
  name: "email_address", // Reusing email as display name
};

// ================== HELPERS ==================
async function ncFetch(path, options = {}) {
  const res = await fetch(`${NC_BASE_URL}${path}`, {
    headers: {
      "xc-token": NC_PAT,
      "Content-Type": "application/json",
    },
    ...options,
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`NocoDB error ${res.status}: ${errText}`);
  }
  return res.json();
}

async function getUserByEmail(email) {
  const where = encodeURIComponent(`(${COL.email},eq,${email})`);
  const fields = `${COL.id},${COL.email},${COL.password},${COL.role},${COL.status},${COL.phone},${COL.name}`;
  const data = await ncFetch(`/tables/${USERS_TABLE_ID}/records?where=${where}&limit=1&fields=${fields}`);
  return data.list?.[0] || null;
}

function toSession(user) {
  return {
    id: user[COL.id],
    email: user[COL.email],
    role: user[COL.role],
    status: user[COL.status],
    name: user[COL.name],
    phone: user[COL.phone],
  };
}

function saveSession(session) {
  localStorage.setItem("fsm_session", JSON.stringify(session));
}

function loadSession() {
  const s = localStorage.getItem("fsm_session");
  return s ? JSON.parse(s) : null;
}

// ================== LOGIN HANDLER ==================
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const user = await getUserByEmail(email);
      if (!user) throw new Error("User not found");
      if (user[COL.password] !== password) throw new Error("Invalid password");

      const session = toSession(user);
      saveSession(session);

      window.location.href = "index.html"; // redirect after login
    } catch (err) {
      document.getElementById("login-error").innerText = err.message;
    }
  });
});
