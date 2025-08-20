// src/transform.js
import { v4 as uuid } from "uuid";

export function transformTimetable(apiRows) {
  // Group by course → section
  const sectionMap = new Map();

  for (const row of apiRows) {
    const secTitle = row.course || "Untitled";
    if (!sectionMap.has(secTitle)) {
      sectionMap.set(secTitle, { id: uuid(), title: secTitle, items: [] });
    }
    const section = sectionMap.get(secTitle);
    section.items.push({
      id: row.sk,                    // use DynamoDB SK as stable ID
      title: `${row.startsAt}–${row.endsAt} (${row.room})`,
      link: "",
      note: "",
      today: true,                   // default: show for today
      doneDates: [],
      sk: row.sk,                    // keep SK around for deletes
    });
  }

  return {
    sections: Array.from(sectionMap.values()),
    streak: { count: 0, best: 0 },
    history: [],
    boards: [],
  };
}
