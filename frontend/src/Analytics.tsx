import RevenueChart from "./components/charts/RevenueChart";
import SalesChart from "./components/charts/SalesChart";

function Analytics() {
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