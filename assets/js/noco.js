// Minimal NocoDB client for the Planner & Technician apps

window.NC = {
  BASE_URL: 'https://app.nocodb.com/api/v2',   // <-- change only if your instance is self-hosted
  TOKEN: '7x7ZxLedCtJSWtiD4dNOu9sB7JlEFB8JiVe0TpRh', // <-- your PAT
  T: {
    technicians: 'mzw1focsec0tekg',
    service_orders: 'm2dmcyfy30klv76',
    intervention_types: 'mb4yox88hd24r0h',
    checklists: 'ma917pno6w5e1ed',
    service_order_inventory: 'm40n0bb2o41gfxp',
    inventory: 'mu70y5tmw0pqflp',
    inventory_assignment: 'mt71bvrpbemeziu',
    inventory_alerts: 'mol0oedvhajviux',
    users: 'mes51s7dmb2mewm',
    service_order_checklist: 'mibtqjiulezywtx',
    service_order_vehicles: 'mvn2do01qdif4yt',
    technician_locations: 'mdau1eojkb8c56x',
    service_order_status_history: 'mirdk2w4yjcny1b'
  }
};

async function ncFetch(url, method = 'GET', body = null) {
  const res = await fetch(url, {
    method,
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'xc-token': NC.TOKEN
    },
    body: body ? JSON.stringify(body) : null
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`${method} ${url} -> ${res.status} ${txt}`);
  }
  return res.json();
}

const baseUrlFor = (tableId) => `${NC.BASE_URL}/tables/${tableId}`;
const recordsUrl = (tableId, qs = '') => `${baseUrlFor(tableId)}/records${qs ? '?' + qs : ''}`;
const countUrl = (tableId, qs = '') => `${baseUrlFor(tableId)}/records/count${qs ? '?' + qs : ''}`;

window.NCAPI = {
  list: (tableId, qs = '') => ncFetch(recordsUrl(tableId, qs)),
  read: (tableId, id) => ncFetch(`${baseUrlFor(tableId)}/records/${id}`),
  create: (tableId, row) => ncFetch(recordsUrl(tableId), 'POST', row),
  patch: (tableId, rows) => ncFetch(recordsUrl(tableId), 'PATCH', Array.isArray(rows) ? rows : [rows]),
  del: (tableId, id) => ncFetch(`${baseUrlFor(tableId)}/records/${id}`, 'DELETE'),
  count: (tableId, qs = '') => ncFetch(countUrl(tableId, qs)),
};

window.NCUTIL = {
  qs(params = {}) {
    const parts = [];
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    });
    return parts.join('&');
  },
  iso(d) { return new Date(d).toISOString(); },
  fmt(d) { try { return d ? new Date(d).toLocaleString() : ''; } catch { return d || ''; } },
};
