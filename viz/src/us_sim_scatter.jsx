import { useState, useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";

const DATA = [
  { sport: "Trampoline", equip: 200, type: "individual", ncaa: false, emp: 2, sim: 7.5 },
  { sport: "Wrestling", equip: 250, type: "duel", ncaa: true, emp: 214, sim: 388.4 },
  { sport: "Volleyball", equip: 300, type: "team", ncaa: false, emp: 45, sim: 12.3 },
  { sport: "Judo", equip: 300, type: "duel", ncaa: false, emp: 30.5, sim: 84.3 },
  { sport: "Beach Volleyball", equip: 300, type: "team", ncaa: false, emp: 56.5, sim: 50.9 },
  { sport: "Diving", equip: 300, type: "individual", ncaa: true, emp: 90, sim: 180.1 },
  { sport: "Rugby Sevens", equip: 350, type: "team", ncaa: false, emp: 4, sim: 2 },
  { sport: "Handball", equip: 350, type: "team", ncaa: false, emp: 0, sim: 19.5 },
  { sport: "Taekwondo", equip: 350, type: "duel", ncaa: false, emp: 53.5, sim: 82.2 },
  { sport: "Artistic Gymnastics", equip: 400, type: "individual", ncaa: true, emp: 322, sim: 283.3 },
  { sport: "Table Tennis", equip: 400, type: "duel", ncaa: false, emp: 2.2, sim: 26.6 },
  { sport: "Weightlifting", equip: 400, type: "individual", ncaa: false, emp: 53, sim: 96 },
  { sport: "Water Polo", equip: 400, type: "team", ncaa: false, emp: 44, sim: 22.2 },
  { sport: "Basketball", equip: 400, type: "team", ncaa: false, emp: 92, sim: 60.9 },
  { sport: "Boxing", equip: 400, type: "duel", ncaa: false, emp: 85.8, sim: 262.9 },
  { sport: "Artistic Swimming", equip: 500, type: "team", ncaa: false, emp: 22, sim: 47 },
  { sport: "Badminton", equip: 500, type: "duel", ncaa: false, emp: 0.8, sim: 9.2 },
  { sport: "Football", equip: 600, type: "team", ncaa: false, emp: 36, sim: 31.8 },
  { sport: "Rhythmic Gym.", equip: 600, type: "individual", ncaa: false, emp: 0, sim: 0.6 },
  { sport: "Hockey", equip: 600, type: "team", ncaa: false, emp: 0, sim: 12.2 },
  { sport: "Athletics Track", equip: 650, type: "individual", ncaa: true, emp: 803, sim: 729.2 },
  { sport: "Baseball/Softball", equip: 700, type: "team", ncaa: false, emp: 32, sim: 40.5 },
  { sport: "Fencing", equip: 700, type: "duel", ncaa: true, emp: 133, sim: 60.1 },
  { sport: "Swimming", equip: 800, type: "individual", ncaa: true, emp: 1200.5, sim: 834.8 },
  { sport: "Canoe Sprint", equip: 800, type: "individual", ncaa: false, emp: 13, sim: 124 },
  { sport: "Marathon Swim", equip: 800, type: "individual", ncaa: false, emp: 10, sim: 4.5 },
  { sport: "Athletics Field", equip: 800, type: "individual", ncaa: true, emp: 332.5, sim: 422.9 },
  { sport: "Tennis", equip: 1000, type: "duel", ncaa: true, emp: 100.2, sim: 111.5 },
  { sport: "Rowing", equip: 1000, type: "individual", ncaa: true, emp: 138, sim: 316 },
  { sport: "Mod. Pentathlon", equip: 1000, type: "individual", ncaa: false, emp: 12, sim: 12.8 },
  { sport: "Golf", equip: 1000, type: "individual", ncaa: true, emp: 25, sim: 4.4 },
  { sport: "Canoe Slalom", equip: 1200, type: "individual", ncaa: false, emp: 15, sim: 72.7 },
  { sport: "Archery", equip: 1200, type: "individual", ncaa: false, emp: 55.5, sim: 83.8 },
  { sport: "Shooting", equip: 1800, type: "individual", ncaa: true, emp: 198, sim: 239.2 },
  { sport: "BMX Racing", equip: 2000, type: "individual", ncaa: false, emp: 36, sim: 8.4 },
  { sport: "Equestrian", equip: 2000, type: "individual", ncaa: false, emp: 102.5, sim: 120.3 },
  { sport: "Track Cycling", equip: 2000, type: "individual", ncaa: false, emp: 64, sim: 135.8 },
  { sport: "Mountain Biking", equip: 3500, type: "individual", ncaa: false, emp: 9, sim: 27.9 },
  { sport: "Triathlon", equip: 3500, type: "individual", ncaa: false, emp: 35, sim: 13.3 },
  { sport: "Sailing", equip: 4000, type: "individual", ncaa: false, emp: 69, sim: 171.2 },
  { sport: "Road Cycling", equip: 4000, type: "individual", ncaa: false, emp: 66, sim: 47.9 },
];

const SHAPES = { individual: "circle", team: "square", duel: "cross" };
const NCAA_OPTS = ["all", "NCAA", "non-NCAA"];
const TYPE_OPTS = ["all", "individual", "team", "duel"];

function linReg(pts) {
  if (pts.length < 2) return null;
  const n = pts.length;
  const sx = pts.reduce((s, p) => s + p.x, 0);
  const sy = pts.reduce((s, p) => s + p.y, 0);
  const sxx = pts.reduce((s, p) => s + p.x * p.x, 0);
  const sxy = pts.reduce((s, p) => s + p.x * p.y, 0);
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const intercept = (sy - slope * sx) / n;
  return { slope, intercept };
}

const CustomShape = ({ cx, cy, type, fill, stroke }) => {
  if (type === "circle") return <circle cx={cx} cy={cy} r={5} fill={fill} stroke={stroke} strokeWidth={1.5} opacity={0.8} />;
  if (type === "square") return <rect x={cx - 4} y={cy - 4} width={8} height={8} fill={fill} stroke={stroke} strokeWidth={1.5} opacity={0.8} />;
  // cross
  return <g>
    <line x1={cx - 4} y1={cy - 4} x2={cx + 4} y2={cy + 4} stroke={fill} strokeWidth={2.5} />
    <line x1={cx - 4} y1={cy + 4} x2={cx + 4} y2={cy - 4} stroke={fill} strokeWidth={2.5} />
  </g>;
};

const CustomDot = (props) => {
  const { cx, cy, payload, dataKey } = props;
  if (!cx || !cy) return null;
  const fill = dataKey === "emp" ? "#2563eb" : "#f97316";
  const stroke = payload.ncaa ? "#000" : "none";
  return <CustomShape cx={cx} cy={cy} type={SHAPES[payload.type]} fill={fill} stroke={stroke} />;
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-300 rounded px-3 py-2 text-sm shadow">
      <div className="font-semibold">{d.sport}</div>
      <div>Equipment: {d.equip}</div>
      <div>Type: {d.type}{d.ncaa ? " (NCAA)" : ""}</div>
      <div className="text-blue-600">Empirical: {d.emp}</div>
      <div className="text-orange-500">Simulated: {Math.round(d.sim)}</div>
      <div className={d.emp - d.sim > 0 ? "text-green-600" : "text-red-600"}>
        Gap: {d.emp - d.sim > 0 ? "+" : ""}{Math.round(d.emp - d.sim)}
      </div>
    </div>
  );
};

export default function USSimScatter() {
  const [ncaaFilter, setNcaaFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = useMemo(() => {
    let d = DATA;
    if (ncaaFilter === "NCAA") d = d.filter((r) => r.ncaa);
    if (ncaaFilter === "non-NCAA") d = d.filter((r) => !r.ncaa);
    if (typeFilter !== "all") d = d.filter((r) => r.type === typeFilter);
    return d;
  }, [ncaaFilter, typeFilter]);

  // Fit lines through individual sports only
  const indFiltered = filtered.filter((d) => d.type === "individual" && d.emp > 0);

  const empLine = useMemo(() => {
    const pts = indFiltered.map((d) => ({ x: Math.log(d.equip), y: d.emp }));
    return linReg(pts);
  }, [indFiltered]);

  const simLine = useMemo(() => {
    const pts = indFiltered.map((d) => ({ x: Math.log(d.equip), y: d.sim }));
    return linReg(pts);
  }, [indFiltered]);

  // Generate line points for rendering
  const xMin = Math.log(180);
  const xMax = Math.log(5000);
  const empLineData = empLine
    ? [{ x: Math.exp(xMin), y: empLine.intercept + empLine.slope * xMin },
       { x: Math.exp(xMax), y: empLine.intercept + empLine.slope * xMax }]
    : [];
  const simLineData = simLine
    ? [{ x: Math.exp(xMin), y: simLine.intercept + simLine.slope * xMin },
       { x: Math.exp(xMax), y: simLine.intercept + simLine.slope * xMax }]
    : [];

  // Totals
  const totals = useMemo(() => {
    const emp = filtered.reduce((s, r) => s + r.emp, 0);
    const sim = filtered.reduce((s, r) => s + r.sim, 0);
    return { emp: Math.round(emp), sim: Math.round(sim), gap: Math.round(emp - sim), n: filtered.length };
  }, [filtered]);

  // Prepare scatter data with log x
  const empData = filtered.filter((d) => d.emp > 0).map((d) => ({ ...d, x: d.equip, y: d.emp }));
  const simData = filtered.filter((d) => d.sim > 0).map((d) => ({ ...d, x: d.equip, y: d.sim }));

  return (
    <div className="max-w-5xl mx-auto p-4 font-sans">
      <h2 className="text-xl font-semibold mb-1">US Points by Sport: Empirical vs Simulated</h2>
      <p className="text-sm text-gray-500 mb-3">
        X: equipment cost (log scale). Y: total Olympic points 2000-2024.
        Shapes: <span style={{ fontSize: 16 }}>●</span> individual, <span style={{ fontSize: 14 }}>■</span> team, <span style={{ fontWeight: "bold" }}>✕</span> duel.
        Black outline = NCAA sport. Lines fit through individual sports only.
      </p>

      <div className="flex gap-4 mb-4 items-end">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Filter</label>
          <div className="flex gap-1">
            {NCAA_OPTS.map((t) => (
              <button key={t} onClick={() => setNcaaFilter(t)}
                className={`px-3 py-1 text-sm rounded ${ncaaFilter === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 rounded px-4 py-2 flex gap-6 text-sm">
          <span>N: <strong>{totals.n}</strong></span>
          <span>Emp: <strong className="text-blue-600">{totals.emp}</strong></span>
          <span>Sim: <strong className="text-orange-500">{totals.sim}</strong></span>
          <span>Gap: <strong className={totals.gap > 0 ? "text-green-700" : "text-red-700"}>{totals.gap > 0 ? "+" : ""}{totals.gap}</strong></span>
        </div>
      </div>

      <div style={{ height: 500 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ left: 20, right: 20, top: 10, bottom: 30 }}>
            <XAxis
              type="number"
              dataKey="x"
              scale="log"
              domain={[180, 5000]}
              ticks={[200, 400, 800, 1500, 3000]}
              tickFormatter={(v) => `€${v}`}
              label={{ value: "Equipment cost (EUR, log scale)", position: "bottom", offset: 10, fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              label={{ value: "Total Olympic points (2000-2024)", angle: -90, position: "insideLeft", offset: -5, fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter name="Empirical" data={empData} dataKey="y"
              shape={(props) => <CustomDot {...props} dataKey="emp" />} />
            <Scatter name="Simulated" data={simData} dataKey="y"
              shape={(props) => <CustomDot {...props} dataKey="sim" />} />
            {empLineData.length === 2 && (
              <Scatter name="Emp fit (individual)" data={empLineData} dataKey="y" line={{ stroke: "#2563eb", strokeWidth: 2, strokeDasharray: "6 3" }} shape={() => null} legendType="none" />
            )}
            {simLineData.length === 2 && (
              <Scatter name="Sim fit (individual)" data={simLineData} dataKey="y" line={{ stroke: "#f97316", strokeWidth: 2, strokeDasharray: "6 3" }} shape={() => null} legendType="none" />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex gap-6 text-xs text-gray-500">
        <span><span className="inline-block w-8 border-t-2 border-blue-600 border-dashed align-middle mr-1"></span> Empirical fit (individual)</span>
        <span><span className="inline-block w-8 border-t-2 border-orange-500 border-dashed align-middle mr-1"></span> Simulated fit (individual)</span>
        <span>Blue = empirical, orange = simulated</span>
      </div>
    </div>
  );
}
