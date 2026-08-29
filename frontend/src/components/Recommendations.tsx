import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

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

type Recommendation = {
  type: "positive" | "warning" | "info";
  title: string;
  message: string;
};

const API_URL = "http://localhost:5000";

/* ============================================================
   COLORS
============================================================ */

const COLORS = {
  bg: "#050807",
  panel: "#080D0B",
  panelLight: "#0B1210",

  emerald: "#00E6A8",
  emeraldBright: "#00F5B5",

  emeraldSoft: "rgba(0,230,168,0.055)",
  emeraldBorder: "rgba(0,230,168,0.18)",

  white: "#F5F7F6",
  text: "#D9E1DE",
  muted: "#7A8581",
  darkMuted: "#4F5A56",

  red: "#EF4444",
  redSoft: "rgba(239,68,68,0.06)",
  redBorder: "rgba(239,68,68,0.20)",

  amber: "#F59E0B",
  amberSoft: "rgba(245,158,11,0.06)",
  amberBorder: "rgba(245,158,11,0.20)",

  blue: "#60A5FA",
  blueSoft: "rgba(96,165,250,0.05)",
  blueBorder: "rgba(96,165,250,0.18)",
};

/* ============================================================
   MONTHS
============================================================ */

const MONTHS: Record<string, string> = {
  "1": "January",
  "2": "February",
  "3": "March",
  "4": "April",
  "5": "May",
  "6": "June",
  "7": "July",
  "8": "August",
  "9": "September",
  "10": "October",
  "11": "November",
  "12": "December",
};

/* ============================================================
   MAIN COMPONENT
============================================================ */

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

  /* ============================================================
     LOAD DATA
  ============================================================ */

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

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

        const query = params.toString();

        const url =
          `${API_URL}/api/analytics/filtered` +
          (query ? `?${query}` : "");

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            "Unable to load recommendations"
          );
        }

        const result = await response.json();

        if (!result?.data) {
          throw new Error(
            "Invalid recommendation data"
          );
        }

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

  /* ============================================================
     FORMATTERS
  ============================================================ */

  const currency = (value: number): string => {
    return `₹${Number(
      value || 0
    ).toLocaleString("en-IN")}`;
  };

  const percentage = (value: number): string => {
    return `${Number(
      value || 0
    ).toFixed(2)}%`;
  };

  /* ============================================================
     LOADING STATE
  ============================================================ */

  if (loading) {
    return (
      <div style={styles.container}>

        <div style={styles.header}>

          <div>
            <div style={styles.eyebrow}>
              DECISION SUPPORT
            </div>

            <h2 style={styles.title}>
              AI Recommendations
            </h2>

            <p style={styles.subtitle}>
              Intelligent recommendations based on
              business performance
            </p>
          </div>

          <div style={styles.statusBadge}>
            <span style={styles.statusDot} />
            AI Analysis
          </div>

        </div>

        <div style={styles.loadingPanel}>

          <div style={styles.spinner} />

          <div>
            <div style={styles.loadingTitle}>
              Analyzing performance
            </div>

            <div style={styles.loadingText}>
              Generating recommendations...
            </div>
          </div>

        </div>

      </div>
    );
  }

  /* ============================================================
     ERROR STATE
  ============================================================ */

  if (error || !data) {
    return (
      <div style={styles.container}>

        <div style={styles.header}>

          <div>
            <div style={styles.eyebrow}>
              DECISION SUPPORT
            </div>

            <h2 style={styles.title}>
              AI Recommendations
            </h2>

            <p style={styles.subtitle}>
              Intelligent recommendations based on
              business performance
            </p>
          </div>

          <div style={styles.statusBadge}>
            <span
              style={{
                ...styles.statusDot,
                backgroundColor: COLORS.red,
                boxShadow:
                  "0 0 9px rgba(239,68,68,0.55)",
              }}
            />

            Offline
          </div>

        </div>

        <div style={styles.errorPanel}>

          <div style={styles.errorIcon}>
            !
          </div>

          <div>

            <div style={styles.errorTitle}>
              Unable to generate recommendations
            </div>

            <div style={styles.errorText}>
              {error ||
                "No recommendation data available."}
            </div>

          </div>

        </div>

      </div>
    );
  }

  /* ============================================================
     FILTER SCOPE
  ============================================================ */

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
    filterParts.push(
      MONTHS[month] || month
    );
  }

  const scope =
    filterParts.length > 0
      ? filterParts.join(" • ")
      : "All business data";

  /* ============================================================
     RECOMMENDATION LOGIC
  ============================================================ */

  const margin =
    Number(data.margin || 0);

  const recommendations: Recommendation[] = [];

  /* NO DATA */

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

  /* LOSS */

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

  /* LOW MARGIN */

  if (
    data.revenue > 0 &&
    data.profit >= 0 &&
    margin < 20
  ) {
    recommendations.push({
      type: "warning",

      title: "Improve Margin",

      message:
        `Profit margin is ${percentage(
          margin
        )}. Consider reviewing costs or pricing to improve profitability.`,
    });
  }

  /* STRONG MARGIN */

  if (
    data.revenue > 0 &&
    margin >= 30
  ) {
    recommendations.push({
      type: "positive",

      title: "Strong Profitability",

      message:
        `This segment has a strong ${percentage(
          margin
        )} profit margin. Consider maintaining the current strategy.`,
    });
  }

  /* HEALTHY PERFORMANCE */

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
        `The segment is profitable with a ${percentage(
          margin
        )} margin. Continue monitoring cost efficiency.`,
    });
  }

  /* HIGH COST */

  if (
    data.revenue > 0 &&
    data.cost / data.revenue > 0.7
  ) {
    recommendations.push({
      type: "warning",

      title: "High Cost Ratio",

      message:
        "Costs represent more than 70% of revenue. Cost optimization could improve profitability.",
    });
  }

  /* LOW ORDER VOLUME */

  if (
    data.revenue > 0 &&
    data.orders === 1
  ) {
    recommendations.push({
      type: "info",

      title: "Limited Order Volume",

      message:
        "Only one order is represented in the selected scope. More transaction data would provide stronger trend analysis.",
    });
  }

  /* GENERAL */

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

  /* ============================================================
     RECOMMENDATION STYLE
  ============================================================ */

  const getRecommendationStyle = (
    type: "positive" | "warning" | "info"
  ) => {
    if (type === "warning") {
      return {
        icon: "!",
        color: COLORS.amber,
        background: COLORS.amberSoft,
        border: COLORS.amberBorder,
      };
    }

    if (type === "positive") {
      return {
        icon: "✓",
        color: COLORS.emerald,
        background: COLORS.emeraldSoft,
        border: COLORS.emeraldBorder,
      };
    }

    return {
      icon: "i",
      color: COLORS.blue,
      background: COLORS.blueSoft,
      border: COLORS.blueBorder,
    };
  };

  /* ============================================================
     MAIN UI
  ============================================================ */

  return (
    <div style={styles.container}>

      {/* HEADER */}

      <div style={styles.header}>

        <div>

          <div style={styles.eyebrow}>
            DECISION SUPPORT
          </div>

          <h2 style={styles.title}>
            AI Recommendations
          </h2>

          <p style={styles.subtitle}>
            Intelligent recommendations based on
            business performance
          </p>

        </div>

        <div style={styles.statusBadge}>
          <span style={styles.statusDot} />
          AI Analysis
        </div>

      </div>


      {/* MAIN AI PANEL */}

      <div style={styles.aiPanel}>

        <div style={styles.topGlow} />

        {/* ICON */}

        <div style={styles.aiIcon}>
          ✦
        </div>


        {/* TITLE */}

        <h3 style={styles.aiTitle}>
          Decision Recommendation
        </h3>

        <p style={styles.aiSubtitle}>
          Recommendations generated from
          current business performance
        </p>


        {/* SCOPE */}

        <div style={styles.scope}>

          <span style={styles.scopeLabel}>
            SCOPE
          </span>

          <span style={styles.scopeValue}>
            {scope}
          </span>

        </div>


        {/* RECOMMENDATIONS */}

        <div style={styles.recommendationList}>

          {recommendations.map(
            (recommendation, index) => {

              const recStyle =
                getRecommendationStyle(
                  recommendation.type
                );

              return (
                <div
                  key={index}
                  style={{
                    ...styles.recommendation,
                    background:
                      recStyle.background,
                    borderColor:
                      recStyle.border,
                  }}
                >

                  {/* ICON */}

                  <div
                    style={{
                      ...styles.recommendationIcon,
                      color:
                        recStyle.color,
                      background:
                        recStyle.background,
                      borderColor:
                        recStyle.border,
                    }}
                  >
                    {recStyle.icon}
                  </div>


                  {/* CONTENT */}

                  <div
                    style={
                      styles.recommendationContent
                    }
                  >

                    <div
                      style={{
                        ...styles.recommendationTitle,
                        color:
                          recStyle.color,
                      }}
                    >
                      {recommendation.title}
                    </div>

                    <div
                      style={
                        styles.recommendationMessage
                      }
                    >
                      {recommendation.message}
                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>


        {/* GOVERNANCE */}

        <div style={styles.governance}>

          <span style={styles.governanceBadge}>
            ✓ Governed Metrics
          </span>

          <span style={styles.governanceBadge}>
            ✓ Deterministic
          </span>

          <span style={styles.governanceBadge}>
            ✓ Semantic Layer
          </span>

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   STYLES
============================================================ */

const styles: Record<
  string,
  CSSProperties
> = {

  /* ==========================================================
     CONTAINER
  ========================================================== */

  container: {
    position: "relative",

    overflow: "hidden",

    background:
      "radial-gradient(circle at 90% 0%, rgba(0,230,168,0.07), transparent 28%), linear-gradient(145deg, #080D0B 0%, #050807 55%, #030504 100%)",

    padding: "28px",

    borderRadius: "20px",

    marginBottom: "24px",

    border:
      "1px solid rgba(0,230,168,0.13)",

    boxShadow:
      "0 22px 60px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.025)",

    color: COLORS.white,
  },


  /* ==========================================================
     HEADER
  ========================================================== */

  header: {
    display: "flex",

    justifyContent:
      "space-between",

    alignItems:
      "flex-start",

    gap: "20px",

    marginBottom: "22px",
  },


  eyebrow: {
    fontSize: "9px",

    fontWeight: 800,

    letterSpacing: "2px",

    color: COLORS.emerald,

    marginBottom: "8px",
  },


  title: {
    margin: 0,

    fontSize: "28px",

    fontWeight: 800,

    letterSpacing: "-0.04em",

    color: COLORS.white,
  },


  subtitle: {
    margin: "7px 0 0",

    color: COLORS.muted,

    fontSize: "12px",

    lineHeight: 1.5,
  },


  /* ==========================================================
     STATUS
  ========================================================== */

  statusBadge: {
    display: "flex",

    alignItems: "center",

    gap: "8px",

    padding: "8px 13px",

    borderRadius: "999px",

    background:
      "rgba(0,230,168,0.045)",

    border:
      "1px solid rgba(0,230,168,0.15)",

    color: COLORS.emerald,

    fontSize: "10px",

    fontWeight: 700,

    whiteSpace: "nowrap",

    boxShadow:
      "0 0 18px rgba(0,230,168,0.035)",
  },


  statusDot: {
    width: "7px",

    height: "7px",

    borderRadius: "50%",

    backgroundColor:
      COLORS.emerald,

    display: "inline-block",

    boxShadow:
      "0 0 9px rgba(0,230,168,0.65)",
  },


  /* ==========================================================
     LOADING
  ========================================================== */

  loadingPanel: {
    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "14px",

    minHeight: "130px",

    padding: "24px",

    borderRadius: "16px",

    background:
      "linear-gradient(145deg, #0B1410, #050907)",

    border:
      "1px solid rgba(0,230,168,0.14)",
  },


  spinner: {
    width: "24px",

    height: "24px",

    borderRadius: "50%",

    border:
      "3px solid rgba(0,230,168,0.15)",

    borderTop:
      "3px solid #00E6A8",
  },


  loadingTitle: {
    color: COLORS.white,

    fontSize: "14px",

    fontWeight: 700,

    marginBottom: "5px",
  },


  loadingText: {
    color: COLORS.muted,

    fontSize: "11px",
  },


  /* ==========================================================
     ERROR
  ========================================================== */

  errorPanel: {
    display: "flex",

    alignItems: "center",

    gap: "14px",

    padding: "20px",

    borderRadius: "14px",

    background:
      COLORS.redSoft,

    border:
      `1px solid ${COLORS.redBorder}`,
  },


  errorIcon: {
    width: "36px",

    height: "36px",

    flexShrink: 0,

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    borderRadius: "10px",

    color: COLORS.red,

    border:
      `1px solid ${COLORS.redBorder}`,

    background:
      "rgba(239,68,68,0.08)",

    fontWeight: 800,
  },


  errorTitle: {
    color: COLORS.red,

    fontSize: "13px",

    fontWeight: 700,

    marginBottom: "4px",
  },


  errorText: {
    color: COLORS.muted,

    fontSize: "11px",

    lineHeight: 1.5,
  },


  /* ==========================================================
     AI PANEL
  ========================================================== */

  aiPanel: {
    position: "relative",

    overflow: "hidden",

    padding: "28px",

    borderRadius: "17px",

    background:
      "linear-gradient(145deg, #0B1410 0%, #07100D 50%, #050907 100%)",

    border:
      "1px solid rgba(0,230,168,0.20)",

    boxShadow:
      "0 18px 55px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.025)",

    textAlign: "center",
  },


  topGlow: {
    position: "absolute",

    top: 0,

    left: "15%",

    right: "15%",

    height: "1px",

    background:
      "linear-gradient(90deg, transparent, #00E6A8, transparent)",

    boxShadow:
      "0 0 20px rgba(0,230,168,0.55)",
  },


  /* ==========================================================
     AI ICON
  ========================================================== */

  aiIcon: {
    width: "43px",

    height: "43px",

    margin: "0 auto 12px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    borderRadius: "12px",

    color: COLORS.emerald,

    background:
      "rgba(0,230,168,0.07)",

    border:
      "1px solid rgba(0,230,168,0.17)",

    fontSize: "21px",

    boxShadow:
      "0 0 25px rgba(0,230,168,0.07)",
  },


  /* ==========================================================
     AI TITLE
  ========================================================== */

  aiTitle: {
    margin: 0,

    color: COLORS.white,

    fontSize: "20px",

    fontWeight: 800,

    letterSpacing: "-0.025em",
  },


  /* ==========================================================
     AI SUBTITLE
  ========================================================== */

  aiSubtitle: {
    margin: "7px auto 0",

    maxWidth: "600px",

    color: COLORS.muted,

    fontSize: "11px",

    lineHeight: 1.5,
  },


  /* ==========================================================
     SCOPE
  ========================================================== */

  scope: {
    display: "inline-flex",

    alignItems: "center",

    gap: "8px",

    marginTop: "16px",

    padding: "7px 12px",

    borderRadius: "999px",

    background:
      "rgba(0,230,168,0.045)",

    border:
      "1px solid rgba(0,230,168,0.12)",
  },


  scopeLabel: {
    color: COLORS.darkMuted,

    fontSize: "8px",

    fontWeight: 800,

    letterSpacing: "1.2px",
  },


  scopeValue: {
    color: COLORS.emerald,

    fontSize: "10px",

    fontWeight: 700,
  },


  /* ==========================================================
     RECOMMENDATION LIST
  ========================================================== */

  recommendationList: {
    display: "flex",

    flexDirection: "column",

    gap: "10px",

    marginTop: "22px",

    textAlign: "left",
  },


  /* ==========================================================
     RECOMMENDATION
  ========================================================== */

  recommendation: {
    display: "flex",

    alignItems: "flex-start",

    gap: "13px",

    padding: "16px",

    borderRadius: "12px",

    border:
      "1px solid transparent",

    transition:
      "transform 0.2s ease",
  },


  /* ==========================================================
     RECOMMENDATION ICON
  ========================================================== */

  recommendationIcon: {
    width: "34px",

    height: "34px",

    flexShrink: 0,

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    borderRadius: "9px",

    border:
      "1px solid transparent",

    fontSize: "14px",

    fontWeight: 800,
  },


  /* ==========================================================
     CONTENT
  ========================================================== */

  recommendationContent: {
    minWidth: 0,

    flex: 1,
  },


  recommendationTitle: {
    fontSize: "13px",

    fontWeight: 800,

    marginBottom: "5px",
  },


  recommendationMessage: {
    color: COLORS.text,

    fontSize: "11px",

    lineHeight: 1.65,
  },


  /* ==========================================================
     GOVERNANCE
  ========================================================== */

  governance: {
    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    flexWrap: "wrap",

    gap: "8px",

    marginTop: "20px",

    paddingTop: "16px",

    borderTop:
      "1px solid rgba(255,255,255,0.055)",
  },


  governanceBadge: {
    display: "inline-flex",

    alignItems: "center",

    padding: "6px 10px",

    borderRadius: "999px",

    background:
      "rgba(0,230,168,0.035)",

    border:
      "1px solid rgba(0,230,168,0.10)",

    color: COLORS.muted,

    fontSize: "9px",

    fontWeight: 700,
  },
};

export default Recommendations;