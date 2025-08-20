// src/App.jsx
import { useEffect, useState } from "react";
import { transformTimetable } from "./transform";
import { fetchTimetable, addPeriod, deletePeriod } from "./api";
import "./index.css";

const USER_ID = "nishanth";
const TODAY = "2025-08-21"; // for now hardcoded, later dynamic

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // load DynamoDB on startup
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const rows = await fetchTimetable(USER_ID, TODAY);
        const state = transformTimetable(rows);
        setData(state);
      } catch (e) {
        console.error("Failed to fetch timetable:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleAdd() {
    const payload = {
      userId: USER_ID,
      date: TODAY,
      period: 4,
      course: "AI",
      room: "B202",
      startsAt: "13:00",
      endsAt: "13:50",
    };
    await addPeriod(payload);
    // re-fetch
    const rows = await fetchTimetable(USER_ID, TODAY);
    setData(transformTimetable(rows));
  }

  async function handleDelete(sk) {
    await deletePeriod(USER_ID, sk);
    // re-fetch
    const rows = await fetchTimetable(USER_ID, TODAY);
    setData(transformTimetable(rows));
  }

  if (loading) return <div className="p-4">Loading timetable…</div>;
  if (!data) return <div className="p-4">No data</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Timetable for {TODAY}</h1>
      {data.sections.map((sec) => (
        <div key={sec.id} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{sec.title}</h2>
          <ul className="space-y-2">
            {sec.items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span>{item.title}</span>
                <button
                  onClick={() => handleDelete(item.sk)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <button
        onClick={handleAdd}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Dummy Entry
      </button>
    </div>
  );
}
