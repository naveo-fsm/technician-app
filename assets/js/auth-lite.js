// Lightweight "auth" for role picking (planner/technician) + GH Pages base-path support.
(function () {
  const LS = { role: 'fsm_role', techId: 'fsm_technician_id', techName: 'fsm_technician_name' };

  // Detect base path for project pages: '/' for user site, '/repo' for project site.
  const BASE_PATH = (() => {
    const segs = location.pathname.split('/').filter(Boolean);
    // If first segment has a dot it's likely a user/org root (e.g., username.github.io) => ''
    // Otherwise treat '/<repo>' as the base path.
    return segs.length && !segs[0].includes('.') ? '/' + segs[0] : '';
  })();

  function setRole(role, tech) {
    localStorage.setItem(LS.role, role);
    if (role === 'technician' && tech) {
      localStorage.setItem(LS.techId, String(tech.id));
      localStorage.setItem(LS.techName, tech.name || '');
    } else {
      localStorage.removeItem(LS.techId);
      localStorage.removeItem(LS.techName);
    }
  }
  function getRole() { return localStorage.getItem(LS.role); }
  function getTech() {
    const id = parseInt(localStorage.getItem(LS.techId) || '', 10);
    const name = localStorage.getItem(LS.techName) || '';
    return { id: Number.isFinite(id) ? id : null, name };
  }
  function clear() {
    localStorage.removeItem(LS.role);
    localStorage.removeItem(LS.techId);
    localStorage.removeItem(LS.techName);
  }

  // Redirect to role picker if role missing/not allowed.
  function ensureRole(allowed = ['planner'], redirect = `${BASE_PATH}/access/role.html`) {
    const role = getRole();
    if (!role || (allowed.length && !allowed.includes(role))) {
      window.location.replace(redirect);
      return false;
    }
    return true;
  }

  // Small role badge with "Switch Role" button.
  function injectRoleBadge(containerSelector = 'header') {
    const el = document.querySelector(containerSelector);
    if (!el) return;
    const role = getRole() || '—';
    const tech = getTech();
    const d = document.createElement('div');
    d.style.display = 'flex';
    d.style.gap = '8px';
    d.style.alignItems = 'center';
    d.innerHTML = `
      <span style="padding:4px 8px;border-radius:999px;background:#eef5ff;color:#111;font-size:12px">
        Role: <b>${role}</b>${role === 'technician' && tech.id ? ` • ${tech.name || ('Tech #'+tech.id)}` : ''}
      </span>
      <button id="switchRoleBtn" style="border:1px solid #e5e7eb;background:#fff;border-radius:8px;padding:6px 10px;cursor:pointer">
        Switch Role
      </button>`;
    el.appendChild(d);
    document.getElementById('switchRoleBtn').onclick = () => {
      clear();
      window.location.href = `${BASE_PATH}/access/role.html`;
    };
  }

  window.Auth = { setRole, getRole, getTech, clear, ensureRole, injectRoleBadge, BASE_PATH };
})();
