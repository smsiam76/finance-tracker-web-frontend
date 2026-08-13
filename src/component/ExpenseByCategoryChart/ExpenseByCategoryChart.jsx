import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// ১. ডেমো ডাটা (আপনার JSON structure অনুযায়ী)
// বাস্তব অ্যাপে এটি API থেকে আসবে বা প্রপস হিসেবে আসবে।
const expenseData = [
  { _id: "cat1", name: "Education", amount: 15000, color: "#059669" }, // Emerald 600
  { _id: "cat2", name: "Shopping", amount: 5000, color: "#047857" }, // Emerald 700
  { _id: "cat3", name: "Food", amount: 10000, color: "#334155" }, // Slate 700 (ডার্ক কালার)
  { _id: "cat4", name: "Others", amount: 4000, color: "#CBD5E1" }, // Slate 300 (হালকা কালার)
];

// ২. কাস্টম টুলটিপ কম্পোনেন্ট (হোভার করলে যা দেখাবে)
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
        <p className="text-gray-200">৳{amount.toLocaleString("en-IN")}</p>
      </div>
    );
  }
  return null;
};

// ৩. কাস্টম লেজেন্ড কম্পোনেন্ট (নিচের তালিকা)
const CustomLegend = ({ data }) => {
  return (
    <div className="mt-8 space-y-3 px-2">
      {data.map((entry) => (
        <div
          key={entry._id}
          className="flex items-center justify-between gap-4 text-sm"
        >
          {/* নাম এবং কালার ডট */}
          <div className="flex items-center gap-3">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            ></span>
            <span className="text-gray-700 font-medium truncate">
              {entry.name}
            </span>
          </div>

          {/* পরিমাণ (৳ এবং 'k' ফরম্যাট) */}
          <div className="text-gray-900 font-semibold tabular-nums text-right whitespace-nowrap">
            ৳{(entry.amount / 1000).toFixed(0)}k
          </div>
        </div>
      ))}
    </div>
  );
};

const ExpenseByCategoryChart = () => {
  return (
    // মূল কার্ড কন্টেইনার (Tailwind styling)
    <div className="">
      {/* চার্ট এরিয়া */}
      <div className="h-60 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
            />
            <Pie
              data={expenseData}
              dataKey="amount"
              nameKey="name"
              cx="50%" // কেন্দ্র X
              cy="50%" // কেন্দ্র Y
              innerRadius="65%" // ডোনাট গর্তের সাইজ
              outerRadius="95%" // বাইরের সাইজ
              paddingAngle={0} // স্লাইসগুলোর মাঝে গ্যাপ (ডিজাইনে নেই)
              startAngle={90} // চার্ট কোথা থেকে শুরু হবে
              endAngle={450}
              cornerRadius={0} // কোণা রাউন্ডেড (ডিজাইনে নেই)
              stroke="none" // স্লাইসের বর্ডার রিমুভ
            >
              {/* প্রতিটি স্লাইসের কালার সেট করা */}
              {expenseData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="focus:outline-none" // ক্লিক করলে বর্ডার রিমুভ
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* কাস্টম লেজেন্ড (তালিকা) */}
      <CustomLegend data={expenseData} />
    </div>
  );
};

export default ExpenseByCategoryChart;
