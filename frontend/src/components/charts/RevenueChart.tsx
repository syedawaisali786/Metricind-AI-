import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    month: "Jan",
    revenue: 19000,
    profit: 6500,
  },
  {
    month: "Feb",
    revenue: 18000,
    profit: 6700,
  },
  {
    month: "Mar",
    revenue: 20000,
    profit: 6800,
  },
  {
    month: "Apr",
    revenue: 12500,
    profit: 5000,
  },
  {
    month: "May",
    revenue: 16500,
    profit: 6000,
  },
  {
    month: "Jun",
    revenue: 23500,
    profit: 8800,
  },
];

function RevenueChart() {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "24px",
        borderRadius: "12px",
        marginTop: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h2
        style={{
          margin: "0 0 20px 0",
          color: "#111827",
          fontSize: "22px",
          fontWeight: 600,
        }}
      >
        Monthly Revenue & Profit
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
          />

          <XAxis
            dataKey="month"
            tick={{ fill: "#6b7280" }}
          />

          <YAxis
            tick={{ fill: "#6b7280" }}
          />

          <Tooltip />

          <Legend />

          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#3b82f6"
            fill="#93c5fd"
            fillOpacity={0.35}
          />

          <Area
            type="monotone"
            dataKey="profit"
            name="Profit"
            stroke="#ef4444"
            fill="#fca5a5"
            fillOpacity={0.25}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueChart;