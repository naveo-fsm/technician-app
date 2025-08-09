/* global window, localStorage, fetch */

// ================== CONFIG ==================
// Put your secrets in config.js (not committed).
// config.js must define:
/// window.NC_BASE = "https://app.nocodb.com/api/v2";
/// window.NC_TOKEN = "YOUR_NOCODB_BEARER";
/// window.CLOUD_NAME = "dcnji9xvd";
/// window.CLOUD_PRESET = "gps_uploads";

if(!window.NC_BASE){ console.warn("Missing NC_BASE. Create config.js from config.example.js."); }

// Table IDs (from your screenshots)
const TBL = {
  technicians: 'mzw1focsec0tekg',
  users: 'mes51s7dmb2mewm',
  service_orders: 'm2dmcyfy30klv76',
  inventory: 'mu70y5tmw0pqflp',
  inventory_assignment: 'mt71bvrpbemeziu',
  inventory_alerts: 'mol0oedvhajviux',
  checklists: 'ma917pno6w5e1ed',
  service_order_inventory: 'm40n0bb2o41gfxp',
  service_order_checklist: 'mibtqjiulezywtx'
};

// Helpers
const NC = {
  url: (tableId, path='records') => `${window.NC_BASE}/tables/${tableId}/${path}`,
  headers: () => ({
    'Content-Type': 'application/json',
    'accept': 'application/json',
    'Authorization': `Bearer ${window.NC_TOKEN}`
  }),
  async get(tableId, params={}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${this.url(tableId,'records')}${qs?`?${qs}`:''}`, { headers: this.headers() });
    if(!res.ok) throw new Error(`NC GET ${tableId} ${res.status}`);
    return res.json();
  },
  async post(tableId, data) {
    const res = await fetch(this.url(tableId,'records'), { method:'POST', headers: this.headers(), body: JSON.stringify(data) });
    if(!res.ok) throw new Error(`NC POST ${tableId} ${res.status}`);
    return res.json();
  },
  async patch(tableId, data) {
    const res = await fetch(this.url(tableId,'records'), { method:'PATCH', headers: this.headers(), body: JSON.stringify(data) });
    if(!res.ok) throw new Error(`NC PATCH ${tableId} ${res.status}`);
    return res.json();
  }
};

// Public API
const Auth = {
  // Login against users table: fields expected: email, password, role, technician_id (optional)
  async login(email, password){
    // NOTE: adjust field names here if your users table differs
    const where = JSON.stringify([["email","eq",email]]);
    const data = await NC.get(TBL.users, { where, limit: 1 });
    const row = data?.list?.[0];
    if(!row) throw new Error('User not found');
    if(String(row.password) !== String(password)) throw new Error('Invalid password'); // replace with hash check if needed
    const user = {
      id: row.id,
      email: row.email,
      role: row.role || 'technician',
      technician_id: row.technician_id || null,
      name: row.full_name || row.name || ''
    };
    localStorage.setItem('fsm_user', JSON.stringify(user));
    return user;
  },
  getSession(){ const s = localStorage.getItem('fsm_user'); return s? JSON.parse(s): null; },
  requireRole(role){
    const u = this.getSession(); if(!u) location.replace('login.html');
    if(role && u.role !== role) location.replace('index.html');
  },
  logout(){ localStorage.removeItem('fsm_user'); },

  // Cloudinary unsigned upload
  async uploadImage(file){
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', window.CLOUD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${window.CLOUD_NAME}/upload`, { method:'POST', body: form });
    if(!res.ok) throw new Error('Upload failed');
    return res.json(); // { secure_url, public_id, ... }
  },

  // Example: fetch current user’s service orders
  async myServiceOrders(){
    const u = this.getSession();
    if(!u) throw new Error('Not logged in');
    // filter by technician if available
    const where = u.technician_id
      ? JSON.stringify([["TechnicianID","eq",u.technician_id]])
      : JSON.stringify([]);
    return NC.get(TBL.service_orders, { where, limit: 200 });
  }
};

window.Auth = Auth; // expose globally
