import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

type KPIData = {
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
};

function KPICards() {
  const [kpi, setKpi] = useState<KPIData>({
    revenue: 0,
    cost: 0,
    profit: 0,
    margin: 0,
  });

  const [loading, setLoading] = useState(true);

  // ============================================================
  // LOAD KPI DATA
  // ============================================================

  async function loadKPIs() {
    try {
      setLoading(true);

      const [
        revenueRes,
        costRes,
        profitRes,
        marginRes,
      ] = await Promise.all([
        fetch(`${API_URL}/api/metrics/revenue`),
        fetch(`${API_URL}/api/metrics/cost`),
        fetch(`${API_URL}/api/metrics/profit`),
        fetch(`${API_URL}/api/metrics/margin`),
      ]);

      if (
        !revenueRes.ok ||
        !costRes.ok ||
        !profitRes.ok ||
        !marginRes.ok
      ) {
        throw new Error("Failed to fetch KPI data");
      }

      const revenue = await revenueRes.json();
      const cost = await costRes.json();
      const profit = await profitRes.json();
      const margin = await marginRes.json();

      setKpi({
        revenue: Number(revenue.value || 0),
        cost: Number(cost.value || 0),
        profit: Number(profit.value || 0),
        margin: Number(margin.value || 0),
      });
    } catch (error) {
      console.error(
        "Failed to load KPI data:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // LOAD KPIs WHEN COMPONENT STARTS
  // ============================================================

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadKPIs();
  }, []);

  // ============================================================
  // FORMAT CURRENCY
  // ============================================================

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          color: "#64748b",
        }}
      >
        Loading business KPIs...
      </div>
    );
  }

  // ============================================================
  // KPI CARDS
  // ============================================================

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginBottom: "25px",
      }}
    >

      {/* ================================================== */}
      {/* REVENUE */}
      {/* ================================================== */}

      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          TOTAL REVENUE
        </p>

        <h2
          style={{
            marginTop: "10px",
            marginBottom: 0,
            color: "#2563eb",
          }}
        >
          {formatCurrency(kpi.revenue)}
        </h2>
      </div>

      {/* ================================================== */}
      {/* COST */}
      {/* ================================================== */}

      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          TOTAL COST
        </p>

        <h2
          style={{
            marginTop: "10px",
            marginBottom: 0,
            color: "#ef4444",
          }}
        >
          {formatCurrency(kpi.cost)}
        </h2>
      </div>

      {/* ================================================== */}
      {/* PROFIT */}
      {/* ================================================== */}

      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          TOTAL PROFIT
        </p>

        <h2
          style={{
            marginTop: "10px",
            marginBottom: 0,
            color: "#16a34a",
          }}
        >
          {formatCurrency(kpi.profit)}
        </h2>
      </div>

      {/* ================================================== */}
      {/* MARGIN */}
      {/* ================================================== */}

      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          PROFIT MARGIN
        </p>

        <h2
          style={{
            marginTop: "10px",
            marginBottom: 0,
            color: "#7c3aed",
          }}
        >
          {kpi.margin.toFixed(2)}%
        </h2>
      </div>

    </div>
  );
}

export default KPICards;