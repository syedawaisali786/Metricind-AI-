import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { product: "Laptop", sales: 23000 },
  { product: "Monitor", sales: 10500 },
  { product: "Keyboard", sales: 3200 },
];

function SalesChart() {
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
        Profit by Product
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
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
            dataKey="product"
            tick={{ fill: "#6b7280" }}
          />

          <YAxis
            tick={{ fill: "#6b7280" }}
          />

          <Tooltip />

          <Bar
            dataKey="sales"
            name="Sales"
            fill="#60a5fa"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalesChart;