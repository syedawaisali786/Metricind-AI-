import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type RegionData = {
  region: string;
  revenue: number;
};

function RegionChart() {
  const [data, setData] = useState<RegionData[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/analytics/region")
      .then((res) => res.json())
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.error("Error loading region data:", error);
      });
  }, []);

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
          textAlign: "center",
          color: "#111827",
          marginBottom: "20px",
        }}
      >
        Revenue by Region
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="region" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="revenue"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RegionChart;