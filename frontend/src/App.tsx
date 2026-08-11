import { useEffect, useState } from "react";

import RevenueChart from "./components/charts/RevenueChart";
import SalesChart from "./components/charts/SalesChart";
import RegionChart from "./components/RegionChart";
import RegionalPerformance from "./components/RegionalPerformance";
import MonthlyPerformance from "./components/MonthlyPerformance";
import CountryPerformance from "./components/CountryPerformance";
import Chat from "./Chat";

const API_URL = "http://localhost:5000";

function App() {
  const [revenue, setRevenue] = useState<number | null>(null);
  const [profit, setProfit] = useState<number | null>(null);
  const [orders, setOrders] = useState<number | null>(null);
  const [margin, setMargin] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // LOAD KPI SUMMARY
  // ============================================================

  useEffect(() => {
    async function loadMetrics() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/analytics/summary`
        );

        if (!response.ok) {
          throw new Error("Unable to load KPI summary");
        }

        const data = await response.json();

        setRevenue(data.revenue);
        setProfit(data.profit);
        setOrders(data.orders);
        setMargin(data.margin);
      } catch (err) {
        console.error(err);
        setError(
          "Could not connect to MetricMind backend."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, []);

  // ============================================================
  // FORMAT CURRENCY
  // ============================================================

  const formatCurrency = (value: number | null) => {
    if (value === null) {
      return "...";
    }

    return `₹${value.toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div
          style={{
            background: "#ffffff",
            padding: "24px",
            borderRadius: "12px",
            marginBottom: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#111827",
              fontSize: "30px",
            }}
          >
            MetricMind
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "#6b7280",
            }}
          >
            Agentic Semantic BI Dashboard
          </p>
        </div>

        {/* ================================================== */}
        {/* ERROR MESSAGE */}
        {/* ================================================== */}

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* ================================================== */}
        {/* KPI CARDS */}
        {/* ================================================== */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4, minmax(0, 1fr))",
            gap: "20px",
            marginBottom: "20px",
          }}
        >

          {/* REVENUE */}

          <div
            style={{
              background: "#ffffff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <p
              style={{
                color: "#6b7280",
                margin: 0,
              }}
            >
              Revenue
            </p>

            <h2
              style={{
                margin: "8px 0 0",
                color: "#111827",
              }}
            >
              {loading
                ? "Loading..."
                : formatCurrency(revenue)}
            </h2>
          </div>

          {/* PROFIT */}

          <div
            style={{
              background: "#ffffff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <p
              style={{
                color: "#6b7280",
                margin: 0,
              }}
            >
              Profit
            </p>

            <h2
              style={{
                margin: "8px 0 0",
                color: "#111827",
              }}
            >
              {loading
                ? "Loading..."
                : formatCurrency(profit)}
            </h2>
          </div>

          {/* ORDERS */}

          <div
            style={{
              background: "#ffffff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <p
              style={{
                color: "#6b7280",
                margin: 0,
              }}
            >
              Orders
            </p>

            <h2
              style={{
                margin: "8px 0 0",
                color: "#111827",
              }}
            >
              {loading
                ? "Loading..."
                : orders !== null
                ? orders.toLocaleString("en-IN")
                : "..."}
            </h2>
          </div>

          {/* MARGIN */}

          <div
            style={{
              background: "#ffffff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <p
              style={{
                color: "#6b7280",
                margin: 0,
              }}
            >
              Margin
            </p>

            <h2
              style={{
                margin: "8px 0 0",
                color: "#111827",
              }}
            >
              {loading
                ? "Loading..."
                : margin !== null
                ? `${margin.toFixed(1)}%`
                : "..."}
            </h2>
          </div>
        </div>

        {/* ================================================== */}
        {/* ANALYTICS CHARTS */}
        {/* ================================================== */}

        <RevenueChart />

        <SalesChart />

        <RegionChart />

        <RegionalPerformance />

        <MonthlyPerformance />

        <CountryPerformance />

        {/* ================================================== */}
        {/* AI CHAT */}
        {/* ================================================== */}

        <Chat />

      </div>
    </div>
  );
}

export default App;