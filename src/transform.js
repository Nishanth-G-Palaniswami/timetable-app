// src/transform.js
import { v4 as uuid } from "uuid";

// Convert DynamoDB rows → your UI { sections:[{title, items:[]}] , streak, history, boards }
export function transformTimetable(apiRows) {
  const sectionMap = new Map();

  for (const row of apiRows || []) {
    const secTitle = row.course || "Untitled";
    if (!sectionMap.has(secTitle)) {
      sectionMap.set(secTitle, { id: uuid(), title: secTitle, items: [] });
    }
    const section = sectionMap.get(secTitle);

    section.items.push({
      id: row.sk,                         // stable key
      title: `${row.startsAt}–${row.endsAt} (${row.room})`,
      link: "",
      note: "",
      today: true,
      doneDates: [],
      sk: row.sk,                         // keep for deletes
      _raw: row,                          // keep original if you need later
    });
  }

  return {
    sections: Array.from(sectionMap.values()),
    streak: { lastDate: "", count: 0, best: 0 },
    history: [],
    boards: [],
  };
}
