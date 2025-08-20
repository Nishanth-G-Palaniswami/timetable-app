// src/api.js
const BASE = "https://api.nishanthgp.me/timetable";

export async function fetchTimetable(userId, date) {
  const res = await fetch(`${BASE}?userId=${userId}&date=${date}`);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
}

export async function addTimetableEntry(entry) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error(`Add failed: ${res.status}`);
  return res.json();
}

export async function deleteTimetableEntry(userId, sk) {
  const res = await fetch(`${BASE}/${encodeURIComponent(sk)}?userId=${userId}`, {
    method: "DELETE",
  });
  if (!res.ok && res.status !== 204) {
    throw new Error(`Delete failed: ${res.status}`);
  }
  return true;
}
