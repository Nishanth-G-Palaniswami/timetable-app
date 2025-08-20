// src/transform.js

export function rowsToUI(rows = []) {
  const byCourse = new Map();

  for (const r of rows) {
    const key = r.course || "Untitled";
    if (!byCourse.has(key)) byCourse.set(key, []);
    byCourse.get(key).push(r);
  }

  const sections = [...byCourse.entries()].map(([title, items]) => ({
    id: title,
    title,
    items: items
      .slice()
      .sort((a, b) => (a.startsAt || "").localeCompare(b.startsAt || ""))
      .map((r) => ({
        id: r.sk,
        sk: r.sk,
        // 👇 use your saved title first; fallback to time-room if not present
        title: r.title && r.title.trim()
          ? r.title
          : `${r.startsAt ?? "??"}–${r.endsAt ?? "??"}${r.room ? ` (${r.room})` : ""}`,
        link: r.link || "",
        note: r.note || "",
        today: true,
        doneDates: Array.isArray(r.doneDates) ? r.doneDates : [],
        meta: { time: `${r.startsAt ?? "?"}–${r.endsAt ?? "?"}`, room: r.room || "" },
        raw: r,
      })),
  }));

  return { sections };
}

// include `title` on create
export function uiNewToRow({ userId, date }, ui) {
  return {
    userId,
    date,
    period: Number(ui.period ?? 0),
    course: ui.course,
    room: ui.room ?? "",
    startsAt: ui.startsAt,
    endsAt: ui.endsAt,
    title: ui.title ?? "",          // <-- NEW
    note: ui.note ?? "",
    link: ui.link ?? "",
    doneDates: [],
  };
}

export function uiPatchToRowPatch(uiPatch = {}) {
  const out = {};
  if ("note" in uiPatch) out.note = uiPatch.note ?? "";
  if ("link" in uiPatch) out.link = uiPatch.link ?? "";
  if ("doneDates" in uiPatch) out.doneDates = uiPatch.doneDates ?? [];
  if ("title" in uiPatch) out.title = uiPatch.title ?? "";   // <-- allow title edits later
  return out;
}
