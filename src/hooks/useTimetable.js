// src/hooks/useTimetable.js
import { useCallback, useEffect, useState } from "react";
import {
  fetchTimetable,
  addTimetableEntry,
  updateTimetableEntry,
  deleteTimetableEntry,
} from "../api";
import { rowsToUI, uiNewToRow, uiPatchToRowPatch } from "../transform";

export function useTimetable({ userId, date }) {
  const [state, setState] = useState({ sections: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const rows = await fetchTimetable(userId, date);
      setState(rowsToUI(rows));
    } catch (e) {
      console.error(e);
      setError("Failed to load timetable");
      setState({ sections: [] });
    } finally {
      setLoading(false);
    }
  }, [userId, date]);

  useEffect(() => { load(); }, [load]);

  async function addItem(uiNew) {
    await addTimetableEntry(uiNewToRow({ userId, date }, uiNew));
    await load();
  }

  async function updateItem(sk, uiPatch) {
    await updateTimetableEntry(userId, sk, uiPatchToRowPatch(uiPatch));
    await load();
  }

  async function removeItem(sk) {
    await deleteTimetableEntry(userId, sk);
    await load();
  }

  return { state, loading, error, addItem, updateItem, removeItem, reload: load };
}
