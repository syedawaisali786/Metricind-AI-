import { useEffect, useState } from "react";

type ExecutiveInsightsProps = {
  country: string;
  region: string;
  product: string;
  month: string;
};

type InsightData = {
  revenue: number;
  cost: number;
  profit: number;
  orders: number;
  margin: number;
};

const API_URL = "http://localhost:5000";

function ExecutiveInsights({
  country,
  region,
  product,
  month,
}: ExecutiveInsightsProps) {
  const [data, setData] =
    useState<InsightData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadInsights = async () => {
      try {
        setLoading(true);
        setError("");

        const params =
          new URLSearchParams();

        if (country) {
          params.set("country", country);
        }

        if (region) {
          params.set("region", region);
        }

        if (product) {
          params.set("product", product);
        }

        if (month) {
          params.set("month", month);
        }

        const query =
          params.toString();

        const url =
          `${API_URL}/api/analytics/filtered` +
          (query ? `?${query}` : "");

        const response =
          await fetch(url);

        if (!response.ok) {
          throw new Error(
            "Unable to load executive insights"
          );
        }

        const result =
          await response.json();

        setData(result.data);

      } catch (err) {
        console.error(
          "Executive Insights Error:",
          err
        );

        setError(
          "Unable to load business insights."
        );

      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, [
    country,
    region,
    product,
    month,
  ]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#111827",
          }}
        >
          💡 Executive Insights
        </h2>

        <p
          style={{
            color: "#6b7280",
          }}
        >
          Analyzing business performance...
        </p>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error || !data) {
    return (
      <div
        style={{
          background: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#111827",
          }}
        >
          💡 Executive Insights
        </h2>

        <p
          style={{
            color: "#ef4444",
          }}
        >
          {error ||
            "No insight data available."}
        </p>
      </div>
    );
  }

  // ============================================================
  // FORMATTERS
  // ============================================================

  const currency = (
    value: number
  ) => {
    return `₹${Number(
      value || 0
    ).toLocaleString("en-IN")}`;
  };

  const percentage = (
    value: number
  ) => {
    return `${Number(
      value || 0
    ).toFixed(2)}%`;
  };

  // ============================================================
  // FILTER DESCRIPTION
  // ============================================================

  const filterParts: string[] = [];

  if (country) {
    filterParts.push(country);
  }

  if (region) {
    filterParts.push(region);
  }

  if (product) {
    filterParts.push(product);
  }

  if (month) {
    const months = [
      "",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
    ];

    filterParts.push(
      months[Number(month)] ||
        month
    );
  }

  const scope =
    filterParts.length > 0
      ? filterParts.join(" • ")
      : "All business data";

  // ============================================================
  // BUSINESS INSIGHT
  // ============================================================

  const getBusinessInsight = () => {
    if (data.revenue === 0) {
      return "No revenue was recorded for the selected business filters.";
    }

    if (data.profit < 0) {
      return (
        `The selected business segment is operating at a loss of ` +
        `${currency(Math.abs(data.profit))}. ` +
        `Cost control should be investigated.`
      );
    }

    if (data.margin >= 30) {
      return (
        `The selected business segment is performing profitably ` +
        `with a strong margin of ${percentage(data.margin)}.`
      );
    }

    return (
      `The selected business segment is profitable, but its margin ` +
      `is ${percentage(data.margin)}. There may be an opportunity ` +
      `to improve cost efficiency.`
    );
  };

  const businessInsight =
    getBusinessInsight();

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "22px",
        borderRadius: "12px",
        marginBottom: "20px",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div
        style={{
          marginBottom: "18px",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#111827",
            fontSize: "22px",
          }}
        >
          💡 Executive Insights
        </h2>

        <p
          style={{
            margin: "6px 0 0",
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          Automated business performance analysis
        </p>

        <div
          style={{
            marginTop: "10px",
            display: "inline-block",
            background: "#eff6ff",
            color: "#1d4ed8",
            padding: "6px 10px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "bold",
          }}
        >
          Scope: {scope}
        </div>
      </div>

      {/* ====================================================== */}
      {/* KPI INSIGHTS */}
      {/* ====================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "15px",
        }}
      >

        {/* REVENUE */}

        <div
          style={{
            background: "#eff6ff",
            padding: "16px",
            borderRadius: "10px",
            border:
              "1px solid #bfdbfe",
          }}
        >
          <div
            style={{
              color: "#64748b",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            REVENUE
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "22px",
              fontWeight: "bold",
              color: "#2563eb",
            }}
          >
            {currency(data.revenue)}
          </div>
        </div>

        {/* COST */}

        <div
          style={{
            background: "#fef2f2",
            padding: "16px",
            borderRadius: "10px",
            border:
              "1px solid #fecaca",
          }}
        >
          <div
            style={{
              color: "#64748b",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            COST
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "22px",
              fontWeight: "bold",
              color: "#dc2626",
            }}
          >
            {currency(data.cost)}
          </div>
        </div>

        {/* PROFIT */}

        <div
          style={{
            background:
              data.profit >= 0
                ? "#f0fdf4"
                : "#fef2f2",
            padding: "16px",
            borderRadius: "10px",
            border:
              data.profit >= 0
                ? "1px solid #bbf7d0"
                : "1px solid #fecaca",
          }}
        >
          <div
            style={{
              color: "#64748b",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            PROFIT
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "22px",
              fontWeight: "bold",
              color:
                data.profit >= 0
                  ? "#16a34a"
                  : "#dc2626",
            }}
          >
            {currency(data.profit)}
          </div>
        </div>

        {/* MARGIN */}

        <div
          style={{
            background: "#faf5ff",
            padding: "16px",
            borderRadius: "10px",
            border:
              "1px solid #e9d5ff",
          }}
        >
          <div
            style={{
              color: "#64748b",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            PROFIT MARGIN
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "22px",
              fontWeight: "bold",
              color: "#7c3aed",
            }}
          >
            {percentage(data.margin)}
          </div>
        </div>

        {/* ORDERS */}

        <div
          style={{
            background: "#fffbeb",
            padding: "16px",
            borderRadius: "10px",
            border:
              "1px solid #fde68a",
          }}
        >
          <div
            style={{
              color: "#64748b",
              fontSize: "13px",
              fontWeight: "bold",
            }}
          >
            ORDERS
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "22px",
              fontWeight: "bold",
              color: "#d97706",
            }}
          >
            {Number(
              data.orders || 0
            ).toLocaleString("en-IN")}
          </div>
        </div>

      </div>

      {/* ====================================================== */}
      {/* BUSINESS INSIGHT */}
      {/* ====================================================== */}

      <div
        style={{
          marginTop: "18px",
          background: "#f8fafc",
          padding: "18px",
          borderRadius: "10px",
          border:
            "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            color: "#64748b",
            fontWeight: "bold",
            marginBottom: "7px",
          }}
        >
          BUSINESS INSIGHT
        </div>

        <div
          style={{
            fontSize: "16px",
            color: "#111827",
            lineHeight: "1.6",
          }}
        >
          💡 {businessInsight}
        </div>
      </div>

      {/* ====================================================== */}
      {/* GOVERNANCE STATUS */}
      {/* ====================================================== */}

      <div
        style={{
          marginTop: "15px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >

        <span
          style={{
            background: "#ecfdf5",
            color: "#047857",
            padding: "7px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          ✓ Semantic Layer
        </span>

        <span
          style={{
            background: "#eff6ff",
            color: "#1d4ed8",
            padding: "7px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          ✓ Deterministic Calculation
        </span>

        <span
          style={{
            background: "#f5f3ff",
            color: "#6d28d9",
            padding: "7px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          ✓ Governed Metrics
        </span>

      </div>

    </div>
  );
}

export default ExecutiveInsights;