
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// Default Color Palette (Fallback if API doesn't provide a color)
const DEFAULT_COLORS = [
  "#059669", // Emerald 600
  "#047857", // Emerald 700
  "#334155", // Slate 700
  "#CBD5E1", // Slate 300
  "#F59E0B", // Amber 500
  "#EF4444", // Red 500
  "#8B5CF6", // Purple 500
];

// 1. Custom Tooltip Component (Triggers on hover)
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, amount, color } = payload[0].payload;
    return (
      <div className="bg-gray-900 text-white p-3 rounded-lg shadow-lg text-sm border border-gray-700">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: color }}
          ></span>
          <span className="font-semibold">{name}</span>
        </div>
        <p className="text-gray-200">৳{Number(amount).toLocaleString("en-BD")}</p>
      </div>
    );
  }
  return null;
};

// 2. Custom Legend Component (List rendered below the chart)
const CustomLegend = ({ data }) => {
  console.log(data);
  return (
    <div className="mt-8 space-y-3 px-2">
      {data.map((entry) => (
        <div
          key={entry._id || entry.name}
          className="flex items-center justify-between gap-4 text-sm"
        >
          {/* Category name and color indicator */}
          <div className="flex items-center gap-3">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            ></span>
            <span className="text-gray-700 font-medium truncate">
              {entry.name}
            </span>
          </div>

          {/* Amount formatting (e.g., ৳1k or exact amount) */}
          <div className="text-gray-900 font-semibold tabular-nums text-right whitespace-nowrap">
            ৳
            {entry.amount >= 1000
              ? `${(entry.amount / 1000).toFixed(1).replace(/\.0$/, "")}k`
              : entry.amount.toLocaleString("en-BD")}
          </div>
        </div>
      ))}
    </div>
  );
};

// 3. Main Chart Component (Receives chartData as a prop)
const ExpenseByCategoryChart = ({ chartData = [] }) => {
  // Empty state handling if no expense data is available
  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-60 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        <p className="text-sm font-medium">No expense data available</p>
      </div>
    );
  }

  // Merge API data with default colors and format amount values
  const formattedData = chartData.map((item, index) => ({
    ...item,
    amount: Number(item.amount || item.totalAmount || 0),
    color: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
  }));

  return (
    <div>
      {/* Chart Canvas Area */}
      <div className="h-60 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
            />
            <Pie
              data={formattedData}
              dataKey="amount"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="95%"
              paddingAngle={0}
              startAngle={90}
              endAngle={450}
              cornerRadius={0}
              stroke="none"
            >
              {formattedData.map((entry, index) => (
                <Cell
                  key={`cell-${entry._id || index}`}
                  fill={entry.color}
                  className="focus:outline-none"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Render Custom Legend below */}
      <CustomLegend data={formattedData} />
    </div>
  );
};

export default ExpenseByCategoryChart;