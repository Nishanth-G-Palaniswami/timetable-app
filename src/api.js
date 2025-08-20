// src/api.js
const BASE = import.meta.env.VITE_API_BASE ?? "https://api.nishanthgp.me/timetable";

async function j(req) {
  const res = await req;
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

// GET /timetable?userId=&date=
export function fetchTimetable(userId, date) {
  const url = new URL(BASE);
  url.searchParams.set("userId", userId);
  url.searchParams.set("date", date);
  return j(fetch(url.toString(), { method: "GET" }));
}

// POST /timetable
export function addTimetableEntry(entry) {
  return j(fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  }));
}

// PATCH /timetable/{sk}
export function updateTimetableEntry(userId, sk, patch) {
  const url = `${BASE}/${encodeURIComponent(sk)}`;
  return j(fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, ...patch }),
  }));
}

// DELETE /timetable/{sk}?userId=
export function deleteTimetableEntry(userId, sk) {
  const url = new URL(`${BASE}/${encodeURIComponent(sk)}`);
  url.searchParams.set("userId", userId);
  return j(fetch(url.toString(), { method: "DELETE" })).then(() => true);
}
