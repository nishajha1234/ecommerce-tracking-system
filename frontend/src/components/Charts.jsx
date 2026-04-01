import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const formatName = (name) => {
  const map = {
    "Wireless Headphones": "Headphones",
    "Mechanical Keyboard": "Keyboard",
    "Bluetooth Speaker": "Speaker",
    "External SSD": "SSD",
    "Smart Watch": "Watch",
    "Gaming Mouse": "Mouse",
    "Laptop Stand": "Stand",
    "USB-C Hub": "Hub"
  };
  return map[name] || name;
};

const COLORS = ["#6366f1", "#ec4899", "#f97316", "#ef4444", "#8b5cf6"];
const PAGE_COLORS = ["#0ea5e9", "#14b8a6", "#84cc16"];

export function ProductChart({ data = [] }) {
  if (!data.length) return <Empty title="No product data" />;

  const formattedData = data.map((item) => ({
    name: formatName(item.name),
    fullName: item.name,
    views: item.count
  }));

  return (
    <ChartCard>
      <div className="w-full h-[220px] sm:h-[260px]">
        <ResponsiveContainer>
          <BarChart data={formattedData}>
            <XAxis
              dataKey="name"
              tick={{ fill: "#000", fontSize: 10 }}
              className="sm:text-xs"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#000", fontSize: 10 }}
              label={{
                value: "Views",
                angle: -90,
                position: "insideLeft",
                style: {
                  textAnchor: "middle",
                  dominantBaseline: "central",
                  fontSize: 10,
                  fill: "#000"
                }
              }}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              content={({ active, payload }) => {
                if (active && payload?.length) {
                  const d = payload[0].payload;
                  return (
                    <TooltipBox
                      title={d.fullName}
                      value={`Views: ${d.views}`}
                    />
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="views" radius={[6, 6, 0, 0]}>
              {formattedData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function PageTimeChart({ data = [] }) {
  if (!data.length) return <Empty title="No page time data" />;

  const formatted = data.map((item) => ({
    name: item._id,
    time: item.totalTime
  }));

  return (
    <ChartCard>
      <div className="w-full h-[220px] sm:h-[260px]">
        <ResponsiveContainer>
          <BarChart data={formatted}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#000", fontSize: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#000", fontSize: 10 }}
              label={{
                value: "Total Time (sec)",
                angle: -90,
                position: "insideLeft",
                style: {
                  textAnchor: "middle",
                  dominantBaseline: "central",
                  fontSize: 10,
                  fill: "#000"
                }
              }}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              content={({ active, payload }) => {
                if (active && payload?.length) {
                  const d = payload[0].payload;
                  return (
                    <TooltipBox
                      title={d.name}
                      value={`Time: ${d.time} sec`}
                    />
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="time" radius={[6, 6, 0, 0]}>
              {formatted.map((_, i) => (
                <Cell key={i} fill={PAGE_COLORS[i % PAGE_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function DropOffChart({ data = [] }) {
  if (!data.length) return <Empty title="No drop-off data" />;

  const formatted = data.map((item) => ({
    name: formatName(item.name || item._id),
    value: item.value || item.count
  }));

  return (
    <ChartCard>
      <div className="flex flex-col">

        <div className="relative w-full h-[200px] sm:h-[240px]">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={formatted}
                dataKey="value"
                nameKey="name"
                outerRadius="90%"
                innerRadius="55%"
              >
                {formatted.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>

              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs sm:text-sm fill-gray-500"
              >
                Drop-off
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-3 sm:mt-4">
          {formatted.map((entry, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-600 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg"
            >
              <span
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              {entry.name} ({entry.value})
            </div>
          ))}
        </div>

      </div>
    </ChartCard>
  );
}

function ChartCard({ children }) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border pt-3 sm:pt-4 px-3 sm:px-4 shadow-sm hover:shadow-md transition">
      {children}
    </div>
  );
}

function TooltipBox({ title, value }) {
  return (
    <div className="bg-white p-2 sm:p-3 rounded-lg shadow-md border text-xs sm:text-sm">
      <p className="font-medium text-gray-800">{title}</p>
      <p className="text-gray-500">{value}</p>
    </div>
  );
}

function Empty({ title }) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl text-center text-gray-400 border text-xs sm:text-sm">
      {title}
    </div>
  );
}