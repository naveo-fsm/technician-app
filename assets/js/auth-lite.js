// Super-light "auth": remember role + technician in localStorage, gate pages by role.
(function(){
  const LS = {
    role: 'fsm_role',
    techId: 'fsm_technician_id',
    techName: 'fsm_technician_name'
  };

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

  // Redirect to role picker if no role or not allowed.
  function ensureRole(allowed = ['planner'], redirect = '/access/role.html') {
    const role = getRole();
    if (!role || (allowed && allowed.length && !allowed.includes(role))) {
      window.location.replace(redirect);
      return false;
    }
    return true;
  }

  // Optional: add a tiny badge + switch button into any container
  function injectRoleBadge(containerSelector = 'header') {
    const el = document.querySelector(containerSelector);
    if (!el) return;
    const role = getRole() || '—';
    const tech = getTech();
    const badge = document.createElement('div');
    badge.style.display = 'flex';
    badge.style.gap = '8px';
    badge.style.alignItems = 'center';
    badge.innerHTML = `
      <span style="padding:4px 8px;border-radius:999px;background:#eef5ff;color:#111;font-size:12px">
        Role: <b>${role}</b>${role==='technician' && tech.id ? ` • ${tech.name||('Tech #'+tech.id)}`:''}
      </span>
      <button id="switchRoleBtn" style="border:1px solid #e5e7eb;background:#fff;border-radius:8px;padding:6px 10px;cursor:pointer">
        Switch Role
      </button>
    `;
    el.appendChild(badge);
    document.getElementById('switchRoleBtn').onclick = () => { clear(); window.location.href = '/access/role.html'; };
  }

  window.Auth = { setRole, getRole, getTech, clear, ensureRole, injectRoleBadge };
})();
