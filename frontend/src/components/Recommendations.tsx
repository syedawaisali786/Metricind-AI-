import { useEffect, useState } from "react";

type RecommendationsProps = {
  country: string;
  region: string;
  product: string;
  month: string;
};

type RecommendationData = {
  revenue: number;
  cost: number;
  profit: number;
  orders: number;
  margin: number;
};

const API_URL = "http://localhost:5000";

function Recommendations({
  country,
  region,
  product,
  month,
}: RecommendationsProps) {
  const [data, setData] =
    useState<RecommendationData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadRecommendations =
      async () => {
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
              "Unable to load recommendations"
            );
          }

          const result =
            await response.json();

          setData(result.data);
        } catch (err) {
          console.error(
            "Recommendations Error:",
            err
          );

          setError(
            "Unable to generate recommendations."
          );
        } finally {
          setLoading(false);
        }
      };

    loadRecommendations();
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
          padding: "22px",
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
          🎯 AI Recommendations
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
          padding: "22px",
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
          🎯 AI Recommendations
        </h2>

        <p
          style={{
            color: "#ef4444",
          }}
        >
          {error ||
            "No recommendation data available."}
        </p>
      </div>
    );
  }

  // ============================================================
  // FORMATTERS
  // ============================================================

  const currency = (
    value: number
  ) =>
    `₹${Number(
      value || 0
    ).toLocaleString("en-IN")}`;

  const margin =
    Number(data.margin || 0);

  // ============================================================
  // FILTER SCOPE
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
  // GENERATE RECOMMENDATIONS
  // ============================================================

  const recommendations: {
    type: "positive" | "warning" | "info";
    title: string;
    message: string;
  }[] = [];

  // ------------------------------------------------------------
  // NO DATA
  // ------------------------------------------------------------

  if (
    data.revenue === 0 &&
    data.orders === 0
  ) {
    recommendations.push({
      type: "warning",
      title: "No Data Available",
      message:
        "No business records match the selected filters. Try another country, region, product, or month.",
    });
  }

  // ------------------------------------------------------------
  // LOSS
  // ------------------------------------------------------------

  if (
    data.revenue > 0 &&
    data.profit < 0
  ) {
    recommendations.push({
      type: "warning",
      title: "Review Profitability",
      message:
        `The selected segment is generating a loss of ${currency(
          Math.abs(data.profit)
        )}. Review pricing and operating costs.`,
    });
  }

  // ------------------------------------------------------------
  // LOW MARGIN
  // ------------------------------------------------------------

  if (
    data.revenue > 0 &&
    data.profit >= 0 &&
    margin < 20
  ) {
    recommendations.push({
      type: "warning",
      title: "Improve Margin",
      message:
        `Profit margin is only ${margin.toFixed(
          2
        )}%. Consider reviewing costs or pricing to improve profitability.`,
    });
  }

  // ------------------------------------------------------------
  // STRONG MARGIN
  // ------------------------------------------------------------

  if (
    data.revenue > 0 &&
    margin >= 30
  ) {
    recommendations.push({
      type: "positive",
      title: "Strong Profitability",
      message:
        `This segment has a strong ${margin.toFixed(
          2
        )}% profit margin. Consider maintaining the current business strategy.`,
    });
  }

  // ------------------------------------------------------------
  // PROFITABLE BUSINESS
  // ------------------------------------------------------------

  if (
    data.revenue > 0 &&
    data.profit > 0 &&
    margin >= 20 &&
    margin < 30
  ) {
    recommendations.push({
      type: "positive",
      title: "Healthy Performance",
      message:
        `The segment is profitable with a ${margin.toFixed(
          2
        )}% margin. Continue monitoring cost efficiency.`,
    });
  }

  // ------------------------------------------------------------
  // COST RATIO
  // ------------------------------------------------------------

  if (
    data.revenue > 0 &&
    data.cost / data.revenue > 0.7
  ) {
    recommendations.push({
      type: "warning",
      title: "High Cost Ratio",
      message:
        "Costs represent more than 70% of revenue. Cost optimization could significantly improve profitability.",
    });
  }

  // ------------------------------------------------------------
  // ORDERS
  // ------------------------------------------------------------

  if (
    data.revenue > 0 &&
    data.orders === 1
  ) {
    recommendations.push({
      type: "info",
      title: "Limited Order Volume",
      message:
        "Only one order is represented in the selected data scope. More transaction data would provide stronger trend analysis.",
    });
  }

  // ------------------------------------------------------------
  // GENERAL POSITIVE
  // ------------------------------------------------------------

  if (
    recommendations.length === 0 &&
    data.revenue > 0
  ) {
    recommendations.push({
      type: "positive",
      title: "Business Performing Well",
      message:
        "The selected segment is profitable and does not currently show a major warning condition.",
    });
  }

  // ============================================================
  // CARD STYLES
  // ============================================================

  const getCardStyle = (
    type: "positive" | "warning" | "info"
  ) => {
    if (type === "warning") {
      return {
        background: "#fff7ed",
        border: "1px solid #fed7aa",
        icon: "⚠️",
        titleColor: "#c2410c",
      };
    }

    if (type === "positive") {
      return {
        background: "#f0fdf4",
        border: "1px solid #bbf7d0",
        icon: "✅",
        titleColor: "#15803d",
      };
    }

    return {
      background: "#eff6ff",
      border: "1px solid #bfdbfe",
      icon: "ℹ️",
      titleColor: "#1d4ed8",
    };
  };

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
      {/* HEADER */}

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
          🎯 AI Recommendations
        </h2>

        <p
          style={{
            margin:
              "6px 0 0",
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          Deterministic recommendations based on governed business metrics
        </p>

        <div
          style={{
            display: "inline-block",
            marginTop: "10px",
            background: "#f5f3ff",
            color: "#6d28d9",
            padding: "6px 10px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "bold",
          }}
        >
          Scope: {scope}
        </div>
      </div>

      {/* RECOMMENDATIONS */}

      <div
        style={{
          display: "grid",
          gap: "12px",
        }}
      >
        {recommendations.map(
          (recommendation, index) => {
            const style =
              getCardStyle(
                recommendation.type
              );

            return (
              <div
                key={index}
                style={{
                  background:
                    style.background,
                  border:
                    style.border,
                  padding: "16px",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: "8px",
                    marginBottom:
                      "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "18px",
                    }}
                  >
                    {style.icon}
                  </span>

                  <strong
                    style={{
                      color:
                        style.titleColor,
                      fontSize:
                        "15px",
                    }}
                  >
                    {
                      recommendation.title
                    }
                  </strong>
                </div>

                <div
                  style={{
                    color: "#374151",
                    lineHeight: "1.6",
                    fontSize: "14px",
                  }}
                >
                  {
                    recommendation.message
                  }
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* GOVERNANCE */}

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
          ✓ Governed Metrics
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
          ✓ Deterministic
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
          ✓ Semantic Layer
        </span>
      </div>
    </div>
  );
}

export default Recommendations;