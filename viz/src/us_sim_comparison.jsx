import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from "recharts";

const DATA = [
  { sport: "Trampoline", equip: 200, type: "individual", ncaa: false, emp: 2, sim: 7.5, gap: -5.5 },
  { sport: "Wrestling", equip: 250, type: "duel", ncaa: true, emp: 214, sim: 388.4, gap: -174.4 },
  { sport: "Volleyball", equip: 300, type: "team", ncaa: false, emp: 45, sim: 12.3, gap: 32.7 },
  { sport: "Judo", equip: 300, type: "duel", ncaa: false, emp: 30.5, sim: 84.3, gap: -53.8 },
  { sport: "Beach Volleyball", equip: 300, type: "team", ncaa: false, emp: 56.5, sim: 50.9, gap: 5.6 },
  { sport: "Diving", equip: 300, type: "individual", ncaa: true, emp: 90, sim: 180.1, gap: -90.1 },
  { sport: "Rugby Sevens", equip: 350, type: "team", ncaa: false, emp: 4, sim: 2, gap: 2 },
  { sport: "Handball", equip: 350, type: "team", ncaa: false, emp: 0, sim: 19.5, gap: -19.5 },
  { sport: "Taekwondo", equip: 350, type: "duel", ncaa: false, emp: 53.5, sim: 82.2, gap: -28.7 },
  { sport: "Artistic Gymnastics", equip: 400, type: "individual", ncaa: true, emp: 322, sim: 283.3, gap: 38.7 },
  { sport: "Table Tennis", equip: 400, type: "duel", ncaa: false, emp: 2.2, sim: 26.6, gap: -24.4 },
  { sport: "Weightlifting", equip: 400, type: "individual", ncaa: false, emp: 53, sim: 96, gap: -43 },
  { sport: "Water Polo", equip: 400, type: "team", ncaa: false, emp: 44, sim: 22.2, gap: 21.8 },
  { sport: "Basketball", equip: 400, type: "team", ncaa: false, emp: 92, sim: 60.9, gap: 31.1 },
  { sport: "Boxing", equip: 400, type: "duel", ncaa: false, emp: 85.8, sim: 262.9, gap: -177.2 },
  { sport: "Artistic Swimming", equip: 500, type: "team", ncaa: false, emp: 22, sim: 47, gap: -25 },
  { sport: "Badminton", equip: 500, type: "duel", ncaa: false, emp: 0.8, sim: 9.2, gap: -8.5 },
  { sport: "Football", equip: 600, type: "team", ncaa: false, emp: 36, sim: 31.8, gap: 4.2 },
  { sport: "Hockey", equip: 600, type: "team", ncaa: false, emp: 0, sim: 12.2, gap: -12.2 },
  { sport: "Athletics Track", equip: 650, type: "individual", ncaa: true, emp: 803, sim: 729.2, gap: 73.8 },
  { sport: "Baseball/Softball", equip: 700, type: "team", ncaa: false, emp: 32, sim: 40.5, gap: -8.5 },
  { sport: "Fencing", equip: 700, type: "duel", ncaa: true, emp: 133, sim: 60.1, gap: 72.9 },
  { sport: "Swimming", equip: 800, type: "individual", ncaa: true, emp: 1200.5, sim: 834.8, gap: 365.7 },
  { sport: "Canoe Sprint", equip: 800, type: "individual", ncaa: false, emp: 13, sim: 124, gap: -111 },
  { sport: "Marathon Swim", equip: 800, type: "individual", ncaa: false, emp: 10, sim: 4.5, gap: 5.5 },
  { sport: "Athletics Field", equip: 800, type: "individual", ncaa: true, emp: 332.5, sim: 422.9, gap: -90.4 },
  { sport: "Tennis", equip: 1000, type: "duel", ncaa: true, emp: 100.2, sim: 111.5, gap: -11.3 },
  { sport: "Rowing", equip: 1000, type: "individual", ncaa: true, emp: 138, sim: 316, gap: -178 },
  { sport: "Modern Pentathlon", equip: 1000, type: "individual", ncaa: false, emp: 12, sim: 12.8, gap: -0.8 },
  { sport: "Golf", equip: 1000, type: "individual", ncaa: true, emp: 25, sim: 4.4, gap: 20.6 },
  { sport: "Canoe Slalom", equip: 1200, type: "individual", ncaa: false, emp: 15, sim: 72.7, gap: -57.7 },
  { sport: "Archery", equip: 1200, type: "individual", ncaa: false, emp: 55.5, sim: 83.8, gap: -28.3 },
  { sport: "Shooting", equip: 1800, type: "individual", ncaa: true, emp: 198, sim: 239.2, gap: -41.2 },
  { sport: "BMX Racing", equip: 2000, type: "individual", ncaa: false, emp: 36, sim: 8.4, gap: 27.6 },
  { sport: "Equestrian", equip: 2000, type: "individual", ncaa: false, emp: 102.5, sim: 120.3, gap: -17.8 },
  { sport: "Track Cycling", equip: 2000, type: "individual", ncaa: false, emp: 64, sim: 135.8, gap: -71.8 },
  { sport: "Mountain Biking", equip: 3500, type: "individual", ncaa: false, emp: 9, sim: 27.9, gap: -18.9 },
  { sport: "Triathlon", equip: 3500, type: "individual", ncaa: false, emp: 35, sim: 13.3, gap: 21.7 },
  { sport: "Sailing", equip: 4000, type: "individual", ncaa: false, emp: 69, sim: 171.2, gap: -102.2 },
  { sport: "Road Cycling", equip: 4000, type: "individual", ncaa: false, emp: 66, sim: 47.9, gap: 18.1 },
];

const TYPES = ["all", "individual", "duel", "team"];
const NCAA_OPTS = ["all", "NCAA only", "non-NCAA only"];
const VIEWS = ["gap", "emp vs sim"];

export default function USSimComparison() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [ncaaFilter, setNcaaFilter] = useState("all");
  const [view, setView] = useState("gap");
  const [sortBy, setSortBy] = useState("equip");

  const filtered = useMemo(() => {
    let d = DATA;
    if (typeFilter !== "all") d = d.filter((r) => r.type === typeFilter);
    if (ncaaFilter === "NCAA only") d = d.filter((r) => r.ncaa);
    if (ncaaFilter === "non-NCAA only") d = d.filter((r) => !r.ncaa);
    if (sortBy === "gap") d = [...d].sort((a, b) => b.gap - a.gap);
    else if (sortBy === "emp") d = [...d].sort((a, b) => b.emp - a.emp);
    else d = [...d].sort((a, b) => b.equip - a.equip);  // reversed so cheapest at top in vertical chart
    return d;
  }, [typeFilter, ncaaFilter, sortBy]);

  const totals = useMemo(() => {
    const emp = filtered.reduce((s, r) => s + r.emp, 0);
    const sim = filtered.reduce((s, r) => s + r.sim, 0);
    return { emp: Math.round(emp), sim: Math.round(sim), gap: Math.round(emp - sim), n: filtered.length };
  }, [filtered]);

  return (
    <div className="max-w-5xl mx-auto p-4 font-sans">
      <h2 className="text-xl font-semibold mb-1">US Olympic Points: Empirical vs Simulated</h2>
      <p className="text-sm text-gray-500 mb-4">2000-2024, 100-seed simulation mean. Sorted by equipment cost.</p>

      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Sport type</label>
          <div className="flex gap-1">
            {TYPES.map((t) => (
              <button key={t} onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 text-sm rounded ${typeFilter === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">NCAA</label>
          <div className="flex gap-1">
            {NCAA_OPTS.map((t) => (
              <button key={t} onClick={() => setNcaaFilter(t)}
                className={`px-3 py-1 text-sm rounded ${ncaaFilter === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">View</label>
          <div className="flex gap-1">
            {VIEWS.map((t) => (
              <button key={t} onClick={() => setView(t)}
                className={`px-3 py-1 text-sm rounded ${view === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Sort</label>
          <div className="flex gap-1">
            {["equip", "gap", "emp"].map((t) => (
              <button key={t} onClick={() => setSortBy(t)}
                className={`px-3 py-1 text-sm rounded ${sortBy === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded px-4 py-2 mb-4 flex gap-6 text-sm">
        <span>Sports: <strong>{totals.n}</strong></span>
        <span>Empirical: <strong>{totals.emp}</strong></span>
        <span>Simulated: <strong>{totals.sim}</strong></span>
        <span>Gap: <strong className={totals.gap > 0 ? "text-green-700" : "text-red-700"}>{totals.gap > 0 ? "+" : ""}{totals.gap}</strong></span>
      </div>

      <div style={{ height: Math.max(400, filtered.length * 28) }}>
        <ResponsiveContainer width="100%" height="100%">
          {view === "gap" ? (
            <BarChart data={filtered} layout="vertical" margin={{ left: 120, right: 20, top: 5, bottom: 5 }}>
              <XAxis type="number" />
              <YAxis type="category" dataKey={(d) => `${d.sport} (€${d.equip})`} width={180} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => Math.round(v)} />
              <ReferenceLine x={0} stroke="#666" />
              <Bar dataKey="gap" name="Gap (Emp - Sim)">
                {filtered.map((entry, i) => (
                  <Cell key={i} fill={entry.gap > 0 ? (entry.ncaa ? "#16a34a" : "#86efac") : (entry.ncaa ? "#dc2626" : "#fca5a5")} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <BarChart data={filtered} layout="vertical" margin={{ left: 120, right: 20, top: 5, bottom: 5 }}>
              <XAxis type="number" />
              <YAxis type="category" dataKey={(d) => `${d.sport} (€${d.equip})`} width={180} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => Math.round(v)} />
              <Legend />
              <Bar dataKey="emp" name="Empirical" fill="#2563eb" />
              <Bar dataKey="sim" name="Simulated" fill="#f97316" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-xs text-gray-400">
        Gap view: dark = NCAA sport, light = non-NCAA. Green = simulation underpredicts US, red = simulation overpredicts US.
      </div>
    </div>
  );
}
