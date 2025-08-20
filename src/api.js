// src/api.js
const API_BASE = import.meta.env.VITE_API_URL || "https://api.nishanthgp.me";

export async function fetchTimetable(userId, date) {
  const r = await fetch(`${API_BASE}/timetable?userId=${encodeURIComponent(userId)}&date=${encodeURIComponent(date)}`);
  if (!r.ok) throw new Error(`GET failed: ${r.status}`);
  return r.json();
}

export async function addPeriod(entry) {
  // expects: { userId, date, period, course, room, startsAt, endsAt }
  const r = await fetch(`${API_BASE}/timetable`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  if (!r.ok) throw new Error(`POST failed: ${r.status}`);
  return r.json();
}

export async function deletePeriod(userId, sk) {
  const r = await fetch(`${API_BASE}/timetable/${encodeURIComponent(sk)}?userId=${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });
  if (!r.ok && r.status !== 204) throw new Error(`DELETE failed: ${r.status}`);
  try { return await r.json(); } catch { return { deleted: true }; }
}
