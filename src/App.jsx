// src/App.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Flame,
  Plus,
  Trash2,
  Link as LinkIcon,
  StickyNote,
  Trophy,
  PawPrint,
  Star,
  CalendarDays,
  Settings,
  ChevronDown,
  ChevronRight,
  RefreshCcw,
  Search,
} from "lucide-react";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

// Recharts
import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

// AWS bridge hook (uses your api.js and transform.js)
import { useTimetable } from "./hooks/useTimetable";

// ---------- Utilities ----------
const USER_ID = "nishanth";
const getToday = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState];
}

const uid = () => Math.random().toString(36).slice(2, 9);

// ---------- Cute Screen Pet ----------
function Pet({ percent, justCelebrated }) {
  const mood = percent >= 100 ? "ecstatic" : percent >= 80 ? "happy" : percent >= 40 ? "okay" : "sleepy";
  const face = {
    sleepy: "(´◡﹏◡`)",
    okay: "(•‿•)",
    happy: "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
    ecstatic: "(ᵔ◡ᵔ)🎉",
  }[mood];
  return (
    <motion.div
      className="fixed bottom-5 right-5 z-50"
      animate={{ y: justCelebrated ? [0, -10, 0] : 0, rotate: justCelebrated ? [0, 3, -3, 0] : 0 }}
      transition={{ duration: 0.8 }}
    >
      <Card className="shadow-2xl bg-gradient-to-br from-white/90 to-sky-50/80 backdrop-blur border-sky-200">
        <CardContent className="p-3 flex items-center gap-3">
          <div className="text-3xl">
            <PawPrint className="w-7 h-7 inline mr-1" />
          </div>
          <div>
            <div className="text-sm text-slate-600">Study buddy</div>
            <div className="text-lg font-semibold leading-none">{face}</div>
            <div className="text-xs text-slate-500 mt-1">Mood: <span className="font-medium">{mood}</span></div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ---------- Achievement Modal ----------
function Celebration({ open, onClose, streak }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full mx-4 rounded-2xl shadow-2xl bg-white p-6 text-center border border-emerald-200"
          >
            <div className="flex items-center justify-center gap-2 text-emerald-600">
              <Trophy className="w-8 h-8" />
              <h3 className="text-xl font-bold">Daily Goal Crushed!</h3>
            </div>
            <p className="mt-2 text-slate-600">You hit ≥80% completion today. Keep the flame alive.</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <Badge className="bg-amber-100 text-amber-700 border border-amber-200">
                <Flame className="w-4 h-4 mr-1" /> Streak: {streak.count}
              </Badge>
              <Badge className="bg-sky-100 text-sky-700 border border-sky-200">
                <Star className="w-4 h-4 mr-1" /> Best: {streak.best}
              </Badge>
            </div>
            <Button className="mt-6" onClick={onClose}>Awesome!</Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------- Note Editor Dialog ----------
function NoteEditor({ item, onSave, trigger }) {
  const [val, setVal] = useState(item?.note || "");
  useEffect(() => setVal(item?.note || ""), [item]);
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit note</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="text-sm text-slate-500">{item?.title}</div>
          <Textarea value={val} onChange={(e) => setVal(e.target.value)} rows={6} className="resize-none" />
          <div className="flex justify-end">
            <Button onClick={() => onSave(val)}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Link Editor Dialog ----------
function LinkEditor({ item, onSave, trigger }) {
  const [val, setVal] = useState(item?.link || "");
  useEffect(() => setVal(item?.link || ""), [item]);
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Attach link</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="text-sm text-slate-500">{item?.title}</div>
          <Input placeholder="https://..." value={val} onChange={(e) => setVal(e.target.value)} />
          <div className="flex justify-end">
            <Button onClick={() => onSave(val)}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Item Row (UI) ----------
function ItemRow({ item, isToday, onToggleToday, onCheckDone, onDelete, onSaveNote, onSaveLink }) {
  const todayKey = getToday();
  const isDoneToday = item.doneDates?.includes(todayKey);

  return (
    <div className="group grid grid-cols-12 items-center gap-2 py-2 border-b last:border-none">
      {/* Left: title + time/room */}
      <div className="col-span-6 sm:col-span-5 flex items-start gap-2 min-w-0">
        <Checkbox
          id={`today-${item.id}`}
          checked={isToday}
          onCheckedChange={(v) => onToggleToday(Boolean(v))}
          className="mt-0.5"
        />

        <div className="min-w-0">
          <label
            htmlFor={`today-${item.id}`}
            className="text-sm text-slate-800 truncate cursor-pointer block"
            title={item.title}
          >
            {item.title}
          </label>

          {/* ⬇️ Add this small secondary line for time / room */}
          {(item.meta?.time || item.meta?.room) && (
            <span className="mt-0.5 block text-xs text-slate-500 truncate">
              {item.meta?.time}
              {item.meta?.room ? ` · ${item.meta.room}` : ""}
            </span>
          )}
        </div>

        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="ml-1 text-sky-600 hover:underline shrink-0"
            title={item.link}
          >
            <LinkIcon className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Middle: Today/Later badge */}
      <div className="col-span-3 sm:col-span-2">
        <Badge variant="outline" className={isToday ? "border-emerald-300 text-emerald-700" : ""}>
          {isToday ? "Today" : "Later"}
        </Badge>
      </div>

      {/* Actions: done / note / link */}
      <div className="col-span-3 sm:col-span-3 flex items-center gap-2">
        <Button
          variant={isDoneToday ? "secondary" : "default"}
          size="sm"
          onClick={() => onCheckDone(!isDoneToday)}
        >
          <CheckCircle2 className="w-4 h-4 mr-1" /> {isDoneToday ? "Done" : "Mark Done"}
        </Button>

        <NoteEditor
          item={item}
          onSave={(val) => onSaveNote(val)}
          trigger={<Button variant="outline" size="icon"><StickyNote className="w-4 h-4" /></Button>}
        />

        <LinkEditor
          item={item}
          onSave={(val) => onSaveLink(val)}
          trigger={<Button variant="outline" size="icon"><LinkIcon className="w-4 h-4" /></Button>}
        />
      </div>

      {/* Delete */}
      <div className="col-span-0 sm:col-span-2 flex justify-end">
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
        </Button>
      </div>
    </div>
  );
}


// ---------- Section Card ----------
function SectionCard({ section, todayFlags, onToggleToday, onAddItem, onUpdateItem, onDeleteItem, collapsed, onToggleCollapse }) {
  const [newItem, setNewItem] = useState("");
  return (
    <Card className="border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onToggleCollapse}>
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          <CardTitle className="text-base">{section.title}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Add item..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="h-8 w-48"
            onKeyDown={(e) => {
              if (e.key === "Enter" && newItem.trim()) {
                onAddItem(newItem.trim());
                setNewItem("");
              }
            }}
          />
          <Button size="sm" onClick={() => { if (newItem.trim()) { onAddItem(newItem.trim()); setNewItem(""); } }}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
      </CardHeader>

      {!collapsed && (
        <CardContent className="p-0">
          {section.items.length === 0 ? (
            <div className="text-sm text-slate-500 px-4 py-6">No items yet.</div>
          ) : (
            <div className="px-4">
              {section.items.map((it) => (
                <ItemRow
                  key={it.id}
                  item={it}
                  isToday={todayFlags[it.id] ?? true}
                  onToggleToday={(v) => onToggleToday(it.id, v)}
                  onCheckDone={(wantDone) => onUpdateItem(it, wantDone)}
                  onDelete={() => onDeleteItem(it)}
                  onSaveNote={(val) => onUpdateItem(it, null, { note: val })}
                  onSaveLink={(val) => onUpdateItem(it, null, { link: val })}
                />
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

// ---------- CSV Helpers ----------
function csvEscape(value) {
  const s = String(value ?? "");
  const noNewlines = s.replace(/\r?\n/g, " ");
  return '"' + noNewlines.replace(/"/g, '""') + '"';
}
function buildCSVFromBoard(board) {
  const rows = [["Date", board.date], [], ["Section", "Title", "Link", "Note", "Done"]];
  for (const sec of board.sections) {
    for (const it of sec.items) {
      rows.push([sec.title, it.title, it.link || "", it.note || "", it.done ? "yes" : "no"]);
    }
  }
  const lines = rows.map((r) => r.map(csvEscape).join(","));
  return lines.join("\n");
}

// ---------- Add Section Dialog ----------
function AddSectionDialog({ onCreate }) {
  const [title, setTitle] = useState("");
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>New Section</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        <Input placeholder="e.g., Coding / DSA" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setTitle("")}>Clear</Button>
          <Button
            onClick={() => {
              if (title.trim()) {
                onCreate(title.trim());
                setTitle("");
                const overlays = document.querySelectorAll('[role="dialog"]');
                (overlays[overlays.length - 1] || {}).dispatchEvent?.(new Event("close"));
              }
            }}
          >
            Create
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

// ============================================================
//                        MAIN APP
// ============================================================
export default function App() {
  const today = getToday();
  const [date] = useState(today);
  const { state, loading, error, addItem, updateItem, removeItem } =
    useTimetable({ userId: USER_ID, date });

  // local-only UI state
  const [collapsed, setCollapsed] = useLocalStorage("toc_collapsed", {});
  const [todayFlags, setTodayFlags] = useLocalStorage("toc_todayflags", {}); // { [itemId]: boolean }
  const [meta, setMeta] = useLocalStorage("toc_meta_v1", {
    streak: { lastDate: "", count: 0, best: 0 },
    history: [], // {date, total, completed, percent}
    boards: [],  // archived boards
  });
  const [query, setQuery] = useState("");
  const [celebrate, setCelebrate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState(null);

  // ensure local todayFlags has entries for current server items (default true)
  useEffect(() => {
    const serverIds = new Set(state.sections.flatMap((s) => s.items.map((it) => it.id)));
    setTodayFlags((prev) => {
      const next = { ...prev };
      // remove flags for items that no longer exist
      Object.keys(next).forEach((id) => { if (!serverIds.has(id)) delete next[id]; });
      // default true for new items
      for (const id of serverIds) if (!(id in next)) next[id] = true;
      return next;
    });
  }, [state.sections, setTodayFlags]);

  // compute today list using local flags
  const allItems = useMemo(() => state.sections.flatMap((s) => s.items), [state.sections]);
  const todayItems = useMemo(() => allItems.filter((it) => todayFlags[it.id] ?? true), [allItems, todayFlags]);

  const completedToday = useMemo(() => {
    return todayItems.filter((it) => it.doneDates?.includes(today)).length;
  }, [todayItems, today]);

  const percent = todayItems.length ? Math.round((completedToday / todayItems.length) * 100) : 0;
  const eligible = todayItems.length > 0 && percent >= 80;

  // 7-day trend (local; mixes stored history + live today)
  const historyMap = useMemo(() => {
    const map = new Map();
    for (const h of meta.history) map.set(h.date, h);
    map.set(today, { date: today, total: todayItems.length, completed: completedToday, percent });
    return map;
  }, [meta.history, today, todayItems.length, completedToday, percent]);

  const last7 = useMemo(() => {
    const arr = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-CA");
      const entry = historyMap.get(key) || { date: key, total: 0, completed: 0, percent: 0 };
      arr.push({ date: key.slice(5), ...entry });
    }
    return arr;
  }, [historyMap]);

  // actions
  const toggleCollapse = (sid) => setCollapsed({ ...collapsed, [sid]: !collapsed[sid] });
  const toggleToday = (itemId, v) => setTodayFlags({ ...todayFlags, [itemId]: v });

  const resetToday = () => {
    const ids = state.sections.flatMap((s) => s.items.map((it) => it.id));
    const cleared = { ...todayFlags };
    ids.forEach((id) => (cleared[id] = false));
    setTodayFlags(cleared);
  };

  const addSectionByCreatingItem = async (sectionTitle) => {
    // Create first item under a new section (course) with default times
    const now = new Date();
    const start = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const endD = new Date(now.getTime() + 50 * 60000);
    const end = `${String(endD.getHours()).padStart(2, "0")}:${String(endD.getMinutes()).padStart(2, "0")}`;
    await addItem({
      period: 0,
      course: sectionTitle,
      room: "",
      startsAt: start,
      endsAt: end,
      title: "New item",   // <-- seed with a visible title
      note: "",
      link: "",
    });
  };

  const saveTodayAsBoard = () => {
    if (todayItems.length === 0) return;
    const boardSections = state.sections
      .map((s) => ({
        title: s.title,
        items: s.items
          .filter((it) => todayFlags[it.id] ?? true)
          .map((it) => ({
            title: it.title,
            link: it.link || "",
            note: it.note || "",
            done: (it.doneDates || []).includes(today),
          })),
      }))
      .filter((sec) => sec.items.length > 0);

    const board = { id: uid(), date: today, createdAt: new Date().toISOString(), sections: boardSections };
    setMeta({ ...meta, boards: [board, ...(meta.boards || [])] });
  };

  const exportBoardCSV = (board) => {
    const csv = buildCSVFromBoard(board);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `board_${board.date}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadBoardItemsToToday = async (board) => {
    // sequentially create items under each section/course
    let cursor = new Date();
    for (const sec of board.sections) {
      for (const it of sec.items) {
        const start = `${String(cursor.getHours()).padStart(2, "0")}:${String(cursor.getMinutes()).padStart(2, "0")}`;
        const endD = new Date(cursor.getTime() + 50 * 60000);
        const end = `${String(endD.getHours()).padStart(2, "0")}:${String(endD.getMinutes()).padStart(2, "0")}`;
        await addItem({
          period: 0,
          course: sec.title,
          room: "",
          startsAt: start,
          endsAt: end,
          note: it.note || "",
          link: it.link || "",
        });
        cursor = new Date(endD.getTime() + 10 * 60000); // small gap
      }
    }
  };

  const claimStreak = () => {
    if (!eligible) return;
    const entry = { date: today, total: todayItems.length, completed: completedToday, percent };
    const newHistory = meta.history.filter((h) => h.date !== today).concat(entry);

    const prev = meta.streak || { lastDate: "", count: 0, best: 0 };
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yKey = yesterday.toLocaleDateString("en-CA");

    let newCount = 1;
    if (prev.lastDate === today) newCount = prev.count; // already claimed
    else if (prev.lastDate === yKey) newCount = prev.count + 1;

    const best = Math.max(prev.best || 0, newCount);

    setMeta({ ...meta, history: newHistory, streak: { lastDate: today, count: newCount, best } });
    setCelebrate(true); setShowModal(true);
    setTimeout(() => setCelebrate(false), 1200);
  };

  // filtered sections for TOC tab
  const filteredSections = useMemo(() => {
    if (!query.trim()) return state.sections;
    const q = query.toLowerCase();
    return state.sections
      .map((s) => ({
        ...s,
        items: s.items.filter(
          (it) =>
            (it.title || "").toLowerCase().includes(q) ||
            (it.note || "").toLowerCase().includes(q) ||
            (it.link || "").toLowerCase().includes(q)
        ),
      }))
      .filter((s) => s.title.toLowerCase().includes(q) || s.items.length > 0);
  }, [state.sections, query]);

  const boards = meta.boards || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="sticky top-0 z-30 backdrop-blur bg-white/75 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-5 h-5 text-sky-600" />
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">TOC Planner — Focus, Notes & Streaks</h1>
            <Badge variant="outline" className="ml-2">v1.3</Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium">Streak: {meta.streak?.count || 0}</span>
              <Badge variant="secondary" className="ml-1">
                <Star className="w-3 h-3 mr-1" />Best {meta.streak?.best || 0}
              </Badge>
            </div>
            <Button variant={eligible ? "default" : "secondary"} onClick={claimStreak} disabled={!eligible}>
              <Trophy className="w-4 h-4 mr-1" /> {eligible ? "Claim Today" : "Complete 80%"}
            </Button>
            <Button variant="outline" onClick={resetToday}>
              <RefreshCcw className="w-4 h-4 mr-1" /> Reset Today
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Error banner */}
        {error ? (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Today</CardTitle></CardHeader>
            <CardContent>
              <div className="text-sm text-slate-600">{completedToday} / {todayItems.length} tasks</div>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={percent} className="h-2" />
                <span className={`text-sm font-medium ${percent>=80?"text-emerald-600":"text-slate-600"}`}>{percent}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">7-Day Trend</CardTitle></CardHeader>
            <CardContent className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={last7} margin={{ left: 0, right: 0, top: 5, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <RTooltip formatter={(v) => `${v}%`} />
                  <Line type="monotone" dataKey="percent" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Quick Add / Search</CardTitle>
              <button type="button" onClick={() => alert("Settings clicked!")}>
                <Settings className="w-4 h-4 text-slate-400" />
              </button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="relative w-full">
                  <Search className="absolute left-2 top-2.5 w-4 h-4 text-slate-400" />
                  <Input
                    className="pl-8"
                    placeholder="Search items or notes..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button><Plus className="w-4 h-4 mr-1" /> Section</Button>
                  </DialogTrigger>
                  <AddSectionDialog onCreate={(t) => addSectionByCreatingItem(t)} />
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-6">
          <Tabs defaultValue="toc" className="w-full">
            <TabsList>
              <TabsTrigger value="toc">Table of Contents</TabsTrigger>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="boards">Daily Boards</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* TOC */}
            <TabsContent value="toc" className="mt-4 space-y-4">
              {loading ? (
                <Card><CardContent className="p-4 text-sm text-slate-500">Loading timetable…</CardContent></Card>
              ) : filteredSections.length ? (
                filteredSections.map((s) => (
                  <SectionCard
                    key={s.id}
                    section={s}
                    todayFlags={todayFlags}
                    collapsed={Boolean(collapsed[s.id])}
                    onToggleCollapse={() => toggleCollapse(s.id)}
                    onToggleToday={(itemId, v) => toggleToday(itemId, v)}
                    onAddItem={async (typedTitle) => {
                    const now = new Date();
                    const start = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
                    const endD = new Date(now.getTime() + 50 * 60000);
                    const end = `${String(endD.getHours()).padStart(2, "0")}:${String(endD.getMinutes()).padStart(2, "0")}`;

                    try {
                      await addItem({
                        period: 0,
                        course: s.title,     // section title = course
                        room: "",
                        startsAt: start,
                        endsAt: end,
                        title: typedTitle,   // <-- CRITICAL: save what you typed
                        note: "",
                        link: "",
                      });
                    } catch (e) {
                      console.error("Add item failed", e);
                      alert("Could not add item. Check console for details.");
                    }
                  }}
                    onUpdateItem={async (it, wantDoneOrNull, patch = {}) => {
                      // if wantDoneOrNull !== null, toggle doneDates for today
                      if (wantDoneOrNull !== null) {
                        const has = (it.doneDates || []).includes(today);
                        let next = it.doneDates || [];
                        if (wantDoneOrNull && !has) next = [...next, today];
                        if (!wantDoneOrNull && has) next = next.filter((d) => d !== today);
                        await updateItem(it.sk, { doneDates: next });
                      } else {
                        // note/link patch
                        await updateItem(it.sk, patch);
                      }
                    }}
                    onDeleteItem={async (it) => removeItem(it.sk)}
                  />
                ))
              ) : (
                <div className="text-sm text-slate-500">No matches. Try a different search.</div>
              )}
            </TabsContent>

            {/* TODAY */}
            <TabsContent value="today" className="mt-4">
              <Card>
                <CardHeader className="pb-2 flex items-center justify-between">
                  <CardTitle className="text-base">Today’s Focus</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={saveTodayAsBoard}>
                      <CalendarDays className="w-4 h-4 mr-1" /> Save Today → Board
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {todayItems.length === 0 ? (
                    <div className="text-sm text-slate-500">No tasks added to Today yet. Toggle "Today" on items from the TOC.</div>
                  ) : (
                    <div className="space-y-2">
                      {state.sections.map((s) => {
                        const vis = s.items.filter((it) => todayFlags[it.id] ?? true);
                        if (vis.length === 0) return null;
                        return (
                          <div key={s.id}>
                            <div className="font-medium text-slate-700 mb-1">{s.title}</div>
                            {vis.map((it) => (
                              <ItemRow
                                key={it.id}
                                item={it}
                                isToday={true}
                                onToggleToday={(v) => toggleToday(it.id, v)}
                                onCheckDone={async (wantDone) => {
                                  const has = (it.doneDates || []).includes(today);
                                  let next = it.doneDates || [];
                                  if (wantDone && !has) next = [...next, today];
                                  if (!wantDone && has) next = next.filter((d) => d !== today);
                                  await updateItem(it.sk, { doneDates: next });
                                }}
                                onDelete={async () => removeItem(it.sk)}
                                onSaveNote={async (val) => updateItem(it.sk, { note: val })}
                                onSaveLink={async (val) => updateItem(it.sk, { link: val })}
                              />
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* BOARDS */}
            <TabsContent value="boards" className="mt-4">
              <Card>
                <CardHeader className="pb-2 flex items-center justify-between">
                  <CardTitle className="text-base">Daily Boards (Archive)</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={saveTodayAsBoard}>
                      <CalendarDays className="w-4 h-4 mr-1" /> Save Today → Board
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {boards.length === 0 ? (
                    <div className="text-sm text-slate-500">No boards yet. Use "Save Today → Board" to archive today's table for later review.</div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-3">
                      <aside className="sm:col-span-1 border-r pr-2">
                        <div className="space-y-1 max-h-80 overflow-auto">
                          {boards.map((b) => (
                            <button
                              key={b.id}
                              onClick={() => setSelectedBoardId(b.id)}
                              className={`w-full text-left px-3 py-2 rounded-xl border ${
                                selectedBoardId === b.id ? "border-sky-300 bg-sky-50" : "border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              <div className="text-sm font-medium">{b.date}</div>
                              <div className="text-xs text-slate-500">Saved {new Date(b.createdAt).toLocaleString()}</div>
                            </button>
                          ))}
                        </div>
                      </aside>

                      <div className="sm:col-span-2">
                        {(() => {
                          const b = boards.find((x) => x.id === selectedBoardId) || boards[0];
                          return b ? (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <div className="text-sm text-slate-500">Board for</div>
                                  <div className="text-lg font-semibold">{b.date}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="secondary" onClick={() => loadBoardItemsToToday(b)}>Load to Today</Button>
                                  <Button variant="outline" onClick={() => exportBoardCSV(b)}>Export CSV</Button>
                                </div>
                              </div>
                              <div className="space-y-3">
                                {b.sections.map((sec, i) => (
                                  <div key={i} className="rounded-xl border border-slate-200">
                                    <div className="px-3 py-2 font-medium bg-slate-50 rounded-t-xl">{sec.title}</div>
                                    <div className="divide-y">
                                      {sec.items.map((it, j) => (
                                        <div key={j} className="px-3 py-2 text-sm flex items-center justify-between">
                                          <div className="min-w-0">
                                            <div className="truncate font-medium">{it.title}</div>
                                            <div className="flex gap-2 text-xs text-slate-500">
                                              {it.link && <a className="text-sky-600 hover:underline" href={it.link} target="_blank" rel="noreferrer">link</a>}
                                              {it.note && <span title={it.note} className="truncate max-w=[280px]">{it.note}</span>}
                                            </div>
                                          </div>
                                          <Badge variant={it.done ? "default" : "outline"}>{it.done ? "done" : "todo"}</Badge>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-slate-500">Select a board.</div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ANALYTICS */}
            <TabsContent value="analytics" className="mt-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">Weekly Progress</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={last7}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 100]} />
                          <RTooltip formatter={(v) => `${v}%`} />
                          <Line type="monotone" dataKey="percent" dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-sm text-slate-600 space-y-2">
                      <div>Each day you claim a streak at ≥80% completion, your streak increases. Missing a day resets the streak.</div>
                      <div className="flex items-center gap-2"><Flame className="w-4 h-4 text-amber-600" /> Current streak: <span className="font-semibold">{meta.streak?.count || 0}</span></div>
                      <div className="flex items-center gap-2"><Star className="w-4 h-4 text-sky-600" /> Best: <span className="font-semibold">{meta.streak?.best || 0}</span></div>
                      <div className="mt-2 flex gap-2">
                        <Button variant={eligible ? "default" : "secondary"} onClick={claimStreak} disabled={!eligible}>
                          <Trophy className="w-4 h-4 mr-1" /> {eligible ? "Claim Today" : "Complete 80%"}
                        </Button>
                        <Button variant="outline" onClick={saveTodayAsBoard}>
                          <CalendarDays className="w-4 h-4 mr-1" /> Save Today → Board
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <Pet percent={percent} justCelebrated={celebrate} />
      <Celebration open={showModal} onClose={() => setShowModal(false)} streak={meta.streak || { count: 0, best: 0 }} />
    </div>
  );
}
