import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

type KPIData = {
  revenue: number;
  cost: number;
  profit: number;
  orders: number;
  margin: number;
};

type KPICardsProps = {
  country: string;
  region: string;
  product: string;
  month: string;
};

function KPICards({
  country,
  region,
  product,
  month,
}: KPICardsProps) {
  const [kpi, setKpi] = useState<KPIData>({
    revenue: 0,
    cost: 0,
    profit: 0,
    orders: 0,
    margin: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchKPIs() {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        if (country.trim()) {
          params.append("country", country.trim());
        }

        if (region.trim()) {
          params.append("region", region.trim());
        }

        if (product.trim()) {
          params.append("product", product.trim());
        }

        if (month.trim()) {
          params.append("month", month.trim());
        }

        const query = params.toString();

        const url = query
          ? `${API_URL}/api/analytics/filtered?${query}`
          : `${API_URL}/api/analytics/summary`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Unable to load KPI data");
        }

        const result = await response.json();

        if (cancelled) return;

        const data = result.data ?? result;

        setKpi({
          revenue: Number(data.revenue || 0),
          cost: Number(data.cost || 0),
          profit: Number(data.profit || 0),
          orders: Number(data.orders || 0),
          margin: Number(data.margin || 0),
        });
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load KPI data:",
            error
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

     
    fetchKPIs();

    return () => {
      cancelled = true;
    };
  }, [country, region, product, month]);

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;
  };

  if (loading) {
    return (
      <div
        style={{
          background: "#ffffff",
          padding: "25px",
          borderRadius: "12px",
          marginBottom: "25px",
          textAlign: "center",
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        Loading business KPIs...
      </div>
    );
  }

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

      {/* REVENUE */}

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

      {/* COST */}

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

      {/* PROFIT */}

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

      {/* ORDERS */}

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
          TOTAL ORDERS
        </p>

        <h2
          style={{
            marginTop: "10px",
            marginBottom: 0,
            color: "#f59e0b",
          }}
        >
          {kpi.orders.toLocaleString("en-IN")}
        </h2>
      </div>

      {/* MARGIN */}

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