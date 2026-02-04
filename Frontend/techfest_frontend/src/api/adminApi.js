const ADMIN_API_BASE = 'http://localhost:8083/api/admin';

export async function adminLogin(email, password) {
  const params = new URLSearchParams({ email, password });
  const res = await fetch(`${ADMIN_API_BASE}/login?${params}`, { method: 'POST' });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Invalid admin credentials');
  }
  return res.text();
}

export async function getAdminEvents() {
  const res = await fetch(`${ADMIN_API_BASE}/events`);
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export async function getAdminPendingEvents() {
  const res = await fetch(`${ADMIN_API_BASE}/events/pending`);
  if (!res.ok) throw new Error('Failed to fetch pending events');
  return res.json();
}

export async function approveEvent(id) {
  const res = await fetch(`${ADMIN_API_BASE}/events/${id}/approve`, { method: 'PUT' });
  if (!res.ok) throw new Error('Failed to approve event');
  return res.json();
}

export async function rejectEvent(id, reason) {
  const params = new URLSearchParams({ reason: reason || 'Not specified' });
  const res = await fetch(`${ADMIN_API_BASE}/events/${id}/reject?${params}`, { method: 'PUT' });
  if (!res.ok) throw new Error('Failed to reject event');
  return res.json();
}

export async function getAdminFeedback() {
  const res = await fetch(`${ADMIN_API_BASE}/feedback`);
  if (!res.ok) throw new Error('Failed to fetch feedback');
  return res.json();
}

export async function getAdminUsers() {
  const res = await fetch(`${ADMIN_API_BASE}/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function getAdminUsersByRole(roleId) {
  const res = await fetch(`${ADMIN_API_BASE}/users/role/${roleId}`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function approveUser(uid) {
  const res = await fetch(`${ADMIN_API_BASE}/users/${uid}/approve`, { method: 'PUT' });
  if (!res.ok) throw new Error('Failed to approve user');
  return res.json();
}
