import { useEffect, useState } from "react";
import RevenueChart from "./components/charts/RevenueChart";
import SalesChart from "./components/charts/SalesChart";

type KPIData = {
  revenue: number;
  cost: number;
  profit: number;
  orders: number;
  margin: number;
};

function Analytics() {
  const [kpi, setKpi] = useState<KPIData | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/analytics/summary")
      .then((response) => response.json())
      .then((data) => {
        setKpi(data);
      })
      .catch((error) => {
        console.error("KPI error:", error);
      });
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "30px",
      }}
    >
      <h1>📊 Analytics</h1>

      <p style={{ color: "#94a3b8" }}>
        Detailed business performance analytics
      </p>

      {/* KPI SUMMARY */}

      {kpi && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <div>
            <h3>Total Revenue</h3>
            <h2>{kpi.revenue}</h2>
          </div>

          <div>
            <h3>Total Cost</h3>
            <h2>{kpi.cost}</h2>
          </div>

          <div>
            <h3>Total Profit</h3>
            <h2>{kpi.profit}</h2>
          </div>

          <div>
            <h3>Profit Margin</h3>
            <h2>{kpi.margin}%</h2>
          </div>
        </div>
      )}

      {/* CHARTS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "25px",
          marginTop: "30px",
        }}
      >
        <RevenueChart />
        <SalesChart />
      </div>
    </div>
  );
}

export default Analytics;