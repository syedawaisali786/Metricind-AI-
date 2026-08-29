import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

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
   COLORS
============================================================ */

const COLORS = {
  background: "#070A09",

  emerald: "#00E6A8",
  emeraldBright: "#00F5B5",

  emeraldSoft: "rgba(0,230,168,0.055)",
  emeraldBorder: "rgba(0,230,168,0.18)",
  emeraldGlow: "0 0 9px rgba(0,230,168,0.65)",

  text: "#F5F7F6",
  textSecondary: "#A7B0AD",
  textMuted: "#69736F",

  red: "#EF4444",
  redSoft: "rgba(239,68,68,0.055)",
  redBorder: "rgba(239,68,68,0.20)",
};

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function ExecutiveInsights({
  country,
  region,
  product,
  month,
}: ExecutiveInsightsProps) {
  const [data, setData] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ============================================================
     LOAD INSIGHTS
  ============================================================ */

  useEffect(() => {
    const controller = new AbortController();

    const loadInsights = async () => {
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

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Backend returned ${response.status}`
          );
        }

        const result = await response.json();

        if (!result || !result.data) {
          throw new Error(
            "Invalid response from analytics API"
          );
        }

        setData({
          revenue: Number(result.data.revenue || 0),
          cost: Number(result.data.cost || 0),
          profit: Number(result.data.profit || 0),
          orders: Number(result.data.orders || 0),
          margin: Number(result.data.margin || 0),
        });
      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Executive Insights Error:",
          err
        );

        setError(
          "Unable to load business insights."
        );

        setData(null);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadInsights();

    return () => {
      controller.abort();
    };
  }, [country, region, product, month]);

  /* ============================================================
     FORMATTERS
  ============================================================ */

  const currency = (value: number): string => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  };

  const percentage = (value: number): string => {
    return `${Number(value || 0).toFixed(2)}%`;
  };

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <div style={styles.eyebrow}>
              EXECUTIVE INTELLIGENCE
            </div>

            <h2 style={styles.title}>
              Executive Insights
            </h2>

            <p style={styles.subtitle}>
              Analyzing business performance...
            </p>
          </div>

          <div style={styles.activeBadge}>
            <span style={styles.greenDot} />
            Analytics Active
          </div>
        </div>

        <div style={styles.loadingBox}>
          <div style={styles.loadingSpinner} />

          <span style={styles.loadingText}>
            Loading executive intelligence...
          </span>
        </div>
      </div>
    );
  }

  /* ============================================================
     ERROR
  ============================================================ */

  if (error || !data) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <div style={styles.eyebrow}>
              EXECUTIVE INTELLIGENCE
            </div>

            <h2 style={styles.title}>
              Executive Insights
            </h2>

            <p style={styles.subtitle}>
              Automated business performance analysis
            </p>
          </div>

          <div style={styles.activeBadge}>
            <span style={styles.greenDot} />
            Analytics Active
          </div>
        </div>

        <div style={styles.errorBox}>
          <div style={styles.errorIcon}>
            !
          </div>

          <div>
            <strong style={styles.errorTitle}>
              Unable to load insights
            </strong>

            <p style={styles.errorText}>
              {error ||
                "No insight data available."}
            </p>
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
     DERIVED BUSINESS SIGNALS
  ============================================================ */

  const profitPositive =
    data.profit >= 0;

  const marginStrong =
    data.margin >= 30;

  const costRatio =
    data.revenue > 0
      ? (data.cost / data.revenue) * 100
      : 0;

  /* ============================================================
     EXECUTIVE STATUS
  ============================================================ */

  // eslint-disable-next-line no-useless-assignment
  let performanceStatus =
    "Needs Attention";

  if (data.revenue === 0) {
    performanceStatus =
      "No Activity";
  } else if (
    profitPositive &&
    marginStrong
  ) {
    performanceStatus =
      "Strong Performance";
  } else if (profitPositive) {
    performanceStatus =
      "Profitable";
  } else {
    performanceStatus =
      "Loss Making";
  }

  /* ============================================================
     EXECUTIVE INSIGHT
  ============================================================ */

  // eslint-disable-next-line no-useless-assignment
  let businessInsight = "";

  if (data.revenue === 0) {
    businessInsight =
      "No revenue was recorded for the selected business scope. Review the active filters and confirm that the selected segment contains business activity.";
  } else if (data.profit < 0) {
    businessInsight =
      `The selected segment generated ${currency(
        data.revenue
      )} in revenue but remains loss-making with a ${percentage(
        data.margin
      )} margin. Cost efficiency should be the primary management focus.`;
  } else if (data.margin >= 30) {
    businessInsight =
      `The selected segment generated ${currency(
        data.profit
      )} in profit from ${currency(
        data.revenue
      )} of revenue, producing a strong ${percentage(
        data.margin
      )} margin.`;
  } else if (data.margin >= 15) {
    businessInsight =
      `The selected segment is profitable, generating ${currency(
        data.profit
      )} at a ${percentage(
        data.margin
      )} margin. There is room to improve profitability through tighter cost management.`;
  } else {
    businessInsight =
      `The selected segment remains profitable, but its ${percentage(
        data.margin
      )} margin indicates limited profitability headroom. Cost efficiency should be monitored closely.`;
  }

  /* ============================================================
     MANAGEMENT DRIVER
  ============================================================ */

  // eslint-disable-next-line no-useless-assignment
  let driverInsight = "";

  if (data.revenue === 0) {
    driverInsight =
      "There is insufficient revenue activity in the selected scope to identify a meaningful performance driver.";
  } else if (costRatio >= 70) {
    driverInsight =
      `Cost represents ${percentage(
        costRatio
      )} of revenue, indicating that operating cost is absorbing a significant share of generated revenue.`;
  } else if (costRatio >= 60) {
    driverInsight =
      `Cost represents ${percentage(
        costRatio
      )} of revenue. Maintaining cost discipline will be important to protect the current profit margin.`;
  } else {
    driverInsight =
      `Cost represents ${percentage(
        costRatio
      )} of revenue, leaving a comparatively healthy portion of revenue as operating profit.`;
  }

  /* ============================================================
     MANAGEMENT ACTION
  ============================================================ */

  // eslint-disable-next-line no-useless-assignment
  let actionInsight = "";

  if (data.revenue === 0) {
    actionInsight =
      "Validate the selected filters and confirm that the underlying dataset contains records for this scope.";
  } else if (data.profit < 0) {
    actionInsight =
      "Prioritize cost reduction and investigate the largest cost drivers before pursuing additional volume.";
  } else if (data.margin < 15) {
    actionInsight =
      "Focus on improving unit economics by controlling costs and protecting revenue quality.";
  } else if (data.margin < 30) {
    actionInsight =
      "Look for opportunities to improve cost efficiency while maintaining the current revenue base.";
  } else {
    actionInsight =
      "Protect the current margin profile while evaluating opportunities to scale profitable revenue.";
  }

  /* ============================================================
     MAIN UI
  ============================================================ */

  return (
    <div style={styles.container}>

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div style={styles.header}>

        <div>
          <div style={styles.eyebrow}>
            EXECUTIVE INTELLIGENCE
          </div>

          <h2 style={styles.title}>
            Executive Insights
          </h2>

          <p style={styles.subtitle}>
            Decision-oriented analysis of governed
            business performance
          </p>
        </div>

        <div style={styles.activeBadge}>
          <span style={styles.greenDot} />
          Analytics Active
        </div>

      </div>


      {/* ======================================================
          ANALYSIS SCOPE
      ====================================================== */}

      <div style={styles.scope}>

        <div style={styles.scopeLeft}>

          <span style={styles.scopeLabel}>
            ANALYSIS SCOPE
          </span>

          <span style={styles.scopeValue}>
            {scope}
          </span>

        </div>

        <div style={styles.scopeLine} />

        <div style={styles.scopeMeta}>
          {month
            ? MONTHS[month] || month
            : "Current Dataset"}
        </div>

      </div>


      {/* ======================================================
          EXECUTIVE SUMMARY
      ====================================================== */}

      <div style={styles.summaryCard}>

        <div style={styles.summaryTopLine} />

        <div style={styles.sectionLabel}>
          EXECUTIVE SUMMARY
        </div>

        <div style={styles.summaryHeader}>

          <div>

            <h3 style={styles.summaryTitle}>
              Business Performance
            </h3>

            <p style={styles.summarySubtitle}>
              Governed metrics translated into
              management-level business signals
            </p>

          </div>

          <div
            style={{
              ...styles.performanceBadge,

              color:
                performanceStatus === "Loss Making"
                  ? COLORS.red
                  : performanceStatus === "No Activity"
                  ? COLORS.textMuted
                  : COLORS.emerald,

              borderColor:
                performanceStatus === "Loss Making"
                  ? COLORS.redBorder
                  : performanceStatus === "No Activity"
                  ? "rgba(255,255,255,0.08)"
                  : COLORS.emeraldBorder,

              backgroundColor:
                performanceStatus === "Loss Making"
                  ? COLORS.redSoft
                  : performanceStatus === "No Activity"
                  ? "rgba(255,255,255,0.025)"
                  : COLORS.emeraldSoft,
            }}
          >

            <span
              style={{
                ...styles.greenDot,

                backgroundColor:
                  performanceStatus === "Loss Making"
                    ? COLORS.red
                    : performanceStatus === "No Activity"
                    ? COLORS.textMuted
                    : COLORS.emerald,

                boxShadow:
                  performanceStatus === "Loss Making"
                    ? "0 0 9px rgba(239,68,68,.55)"
                    : performanceStatus === "No Activity"
                    ? "none"
                    : COLORS.emeraldGlow,
              }}
            />

            {performanceStatus}

          </div>

        </div>


        {/* ====================================================
            EXECUTIVE SIGNAL
        ==================================================== */}

        <div style={styles.insightBox}>

          <div style={styles.insightIcon}>
            <span>✦</span>
          </div>

          <div style={styles.insightContent}>

            <div style={styles.insightLabel}>
              EXECUTIVE SIGNAL
            </div>

            <div style={styles.insightText}>
              {businessInsight}
            </div>

          </div>

        </div>


        {/* ====================================================
            MANAGEMENT DRIVERS
        ==================================================== */}

        <div style={styles.analysisGrid}>

          <div style={styles.analysisCard}>

            <div style={styles.analysisLabel}>
              PERFORMANCE DRIVER
            </div>

            <div style={styles.analysisTitle}>
              Cost efficiency
            </div>

            <p style={styles.analysisText}>
              {driverInsight}
            </p>

          </div>


          <div style={styles.analysisCard}>

            <div style={styles.analysisLabel}>
              MANAGEMENT ACTION
            </div>

            <div style={styles.analysisTitle}>
              Recommended focus
            </div>

            <p style={styles.analysisText}>
              {actionInsight}
            </p>

          </div>

        </div>


        {/* ====================================================
            METRIC STRIP
        ==================================================== */}

        <div style={styles.metricStrip}>

          {/* REVENUE */}

          <div style={styles.metricItem}>

            <span style={styles.metricLabel}>
              REVENUE
            </span>

            <strong style={styles.metricValue}>
              {currency(data.revenue)}
            </strong>

          </div>

          <div style={styles.metricDivider} />


          {/* COST */}

          <div style={styles.metricItem}>

            <span style={styles.metricLabel}>
              COST
            </span>

            <strong style={styles.metricValue}>
              {currency(data.cost)}
            </strong>

          </div>

          <div style={styles.metricDivider} />


          {/* PROFIT */}

          <div style={styles.metricItem}>

            <span style={styles.metricLabel}>
              PROFIT
            </span>

            <strong
              style={{
                ...styles.metricValue,

                color:
                  data.profit >= 0
                    ? COLORS.emerald
                    : COLORS.red,
              }}
            >
              {currency(data.profit)}
            </strong>

          </div>

          <div style={styles.metricDivider} />


          {/* MARGIN */}

          <div style={styles.metricItem}>

            <span style={styles.metricLabel}>
              MARGIN
            </span>

            <strong style={styles.metricValue}>
              {percentage(data.margin)}
            </strong>

          </div>

          <div style={styles.metricDivider} />


          {/* ORDERS */}

          <div style={styles.metricItem}>

            <span style={styles.metricLabel}>
              ORDERS
            </span>

            <strong style={styles.metricValue}>
              {Number(
                data.orders || 0
              ).toLocaleString("en-IN")}
            </strong>

          </div>

        </div>


        {/* ====================================================
            DATA GOVERNANCE
        ==================================================== */}

        <div style={styles.governance}>

          <div style={styles.governanceInfo}>

            <div style={styles.sectionLabel}>
              DATA GOVERNANCE
            </div>

            <div style={styles.governanceTitle}>
              Trusted business metrics
            </div>

            <div style={styles.governanceSubtitle}>
              Metrics are calculated through the
              governed semantic layer.
            </div>

          </div>

          <div style={styles.badges}>

            <span style={styles.badge}>
              <span style={styles.badgeCheck}>
                ✓
              </span>
              Semantic Layer
            </span>

            <span style={styles.badge}>
              <span style={styles.badgeCheck}>
                ✓
              </span>
              Deterministic Calculation
            </span>

            <span style={styles.badge}>
              <span style={styles.badgeCheck}>
                ✓
              </span>
              Governed Metrics
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

  /* ============================================================
   STYLES
============================================================ */

const styles: Record<string, CSSProperties> = {

  /* ==========================================================
     CONTAINER
  ========================================================== */

  container: {
    position: "relative",

    overflow: "hidden",

    background:
      "radial-gradient(circle at 90% 0%, rgba(0,230,168,0.075), transparent 28%), linear-gradient(145deg, #0D1210 0%, #080C0A 55%, #050706 100%)",

    padding: "28px",

    borderRadius: "20px",

    marginBottom: "24px",

    border:
      "1px solid rgba(0,230,168,0.16)",

    boxShadow:
      "0 22px 60px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.025)",

    color: COLORS.text,
  },


  /* ==========================================================
     HEADER
  ========================================================== */

  header: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "flex-start",

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

    color: COLORS.text,
  },

  subtitle: {
    margin: "7px 0 0",

    color: COLORS.textSecondary,

    fontSize: "12px",

    lineHeight: 1.5,
  },

  activeBadge: {
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
  },

  greenDot: {
    width: "7px",

    height: "7px",

    borderRadius: "50%",

    backgroundColor:
      COLORS.emerald,

    display: "inline-block",

    boxShadow:
      COLORS.emeraldGlow,
  },


  /* ==========================================================
     SCOPE
  ========================================================== */

  scope: {
    display: "flex",

    alignItems: "center",

    gap: "14px",

    minHeight: "45px",

    padding: "10px 14px",

    marginBottom: "16px",

    borderRadius: "10px",

    background:
      "rgba(0,230,168,0.025)",

    border:
      "1px solid rgba(0,230,168,0.10)",
  },

  scopeLeft: {
    display: "flex",

    alignItems: "center",

    gap: "10px",

    flexWrap: "wrap",
  },

  scopeLabel: {
    fontSize: "8px",

    fontWeight: 800,

    letterSpacing: "1.4px",

    color: COLORS.textMuted,
  },

  scopeValue: {
    fontSize: "11px",

    fontWeight: 700,

    color: COLORS.emerald,
  },

  scopeLine: {
    width: "1px",

    height: "18px",

    background:
      "rgba(255,255,255,0.08)",
  },

  scopeMeta: {
    fontSize: "10px",

    color: COLORS.textMuted,
  },


  /* ==========================================================
     SUMMARY CARD
  ========================================================== */

  summaryCard: {
    position: "relative",

    marginTop: "8px",

    padding: "24px",

    borderRadius: "16px",

    background:
      "linear-gradient(145deg, #101512 0%, #0A0E0C 100%)",

    border:
      "1px solid rgba(0,230,168,0.13)",

    boxShadow:
      "0 18px 50px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.02)",
  },

  summaryTopLine: {
    position: "absolute",

    top: 0,

    left: "10%",

    right: "10%",

    height: "1px",

    background:
      "linear-gradient(90deg, transparent, rgba(0,230,168,0.65), transparent)",

    boxShadow:
      "0 0 12px rgba(0,230,168,0.25)",
  },

  sectionLabel: {
    color: COLORS.emerald,

    fontSize: "8px",

    fontWeight: 800,

    letterSpacing: "1.7px",
  },

  summaryHeader: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "15px",

    marginTop: "6px",

    marginBottom: "18px",
  },

  summaryTitle: {
    margin: 0,

    fontSize: "20px",

    fontWeight: 750,

    color: COLORS.text,
  },

  summarySubtitle: {
    margin: "5px 0 0",

    color: COLORS.textMuted,

    fontSize: "10px",

    lineHeight: 1.4,
  },

  performanceBadge: {
    display: "flex",

    alignItems: "center",

    gap: "7px",

    padding: "7px 11px",

    borderRadius: "999px",

    fontSize: "9px",

    fontWeight: 800,

    whiteSpace: "nowrap",
  },


  /* ==========================================================
     INSIGHT BOX
  ========================================================== */

  insightBox: {
    display: "flex",

    gap: "14px",

    alignItems: "flex-start",

    padding: "18px",

    borderRadius: "12px",

    background:
      "linear-gradient(145deg, rgba(0,230,168,0.045), rgba(255,255,255,0.012))",

    border:
      "1px solid rgba(0,230,168,0.10)",
  },

  insightIcon: {
    width: "40px",

    height: "40px",

    flexShrink: 0,

    borderRadius: "10px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    background:
      "rgba(0,230,168,0.075)",

    border:
      "1px solid rgba(0,230,168,0.16)",

    color: COLORS.emerald,

    fontSize: "17px",
  },

  insightContent: {
    minWidth: 0,
  },

  insightLabel: {
    color: COLORS.textMuted,

    fontSize: "8px",

    fontWeight: 800,

    letterSpacing: "1.3px",
  },

  insightText: {
    marginTop: "7px",

    color: "#D9E1DE",

    fontSize: "13px",

    lineHeight: 1.65,
  },


  /* ==========================================================
     ANALYSIS GRID
  ========================================================== */

  analysisGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",

    gap: "12px",

    marginTop: "14px",
  },

  analysisCard: {
    padding: "16px",

    borderRadius: "12px",

    background:
      "rgba(255,255,255,0.018)",

    border:
      "1px solid rgba(255,255,255,0.055)",
  },

  analysisLabel: {
    color: COLORS.textMuted,

    fontSize: "8px",

    fontWeight: 800,

    letterSpacing: "1.3px",
  },

  analysisTitle: {
    marginTop: "7px",

    color: COLORS.text,

    fontSize: "12px",

    fontWeight: 750,
  },

  analysisText: {
    margin: "7px 0 0",

    color: COLORS.textSecondary,

    fontSize: "10px",

    lineHeight: 1.55,
  },


  /* ==========================================================
     METRIC STRIP
  ========================================================== */

  metricStrip: {
    display: "flex",

    alignItems: "stretch",

    width: "100%",

    marginTop: "18px",

    padding: "17px 8px",

    boxSizing: "border-box",

    background:
      "linear-gradient(145deg, rgba(0,230,168,0.035), rgba(255,255,255,0.012))",

    border:
      "1px solid rgba(0,230,168,0.10)",

    borderRadius: "12px",

    overflowX: "auto",
  },

  metricItem: {
    flex: "1 1 0",

    minWidth: "105px",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    gap: "6px",

    padding: "2px 10px",

    textAlign: "center",
  },

  metricLabel: {
    color: COLORS.textMuted,

    fontSize: "8px",

    fontWeight: 800,

    letterSpacing: "1.3px",

    whiteSpace: "nowrap",
  },

  metricValue: {
    color: COLORS.text,

    fontSize: "16px",

    fontWeight: 800,

    lineHeight: 1.2,

    whiteSpace: "nowrap",
  },

  metricDivider: {
    width: "1px",

    minWidth: "1px",

    height: "38px",

    alignSelf: "center",

    background:
      "rgba(255,255,255,0.08)",
  },


  /* ==========================================================
     DATA GOVERNANCE
  ========================================================== */

  governance: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "20px",

    marginTop: "16px",

    padding: "16px 18px",

    borderRadius: "12px",

    background:
      "rgba(255,255,255,0.012)",

    border:
      "1px solid rgba(255,255,255,0.055)",
  },

  governanceInfo: {
    minWidth: 0,
  },

  governanceTitle: {
    marginTop: "5px",

    color: COLORS.text,

    fontSize: "11px",

    fontWeight: 700,
  },

  governanceSubtitle: {
    marginTop: "4px",

    color: COLORS.textMuted,

    fontSize: "9px",

    lineHeight: 1.4,
  },

  badges: {
    display: "flex",

    flexWrap: "wrap",

    justifyContent: "flex-end",

    gap: "7px",
  },

  badge: {
    display: "inline-flex",

    alignItems: "center",

    gap: "6px",

    padding: "6px 9px",

    borderRadius: "999px",

    background:
      "rgba(0,230,168,0.035)",

    border:
      "1px solid rgba(0,230,168,0.10)",

    color: COLORS.textSecondary,

    fontSize: "8px",

    fontWeight: 700,

    whiteSpace: "nowrap",
  },

  badgeCheck: {
    color: COLORS.emerald,

    fontWeight: 900,
  },


  /* ==========================================================
     LOADING
  ========================================================== */

  loadingBox: {
    minHeight: "160px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "12px",

    borderRadius: "14px",

    background:
      "rgba(0,230,168,0.025)",

    border:
      "1px solid rgba(0,230,168,0.08)",

    color: COLORS.textMuted,

    fontSize: "11px",
  },

  loadingText: {
    color: COLORS.textMuted,

    fontSize: "11px",
  },

  loadingSpinner: {
    width: "18px",

    height: "18px",

    borderRadius: "50%",

    border:
      "2px solid rgba(0,230,168,0.15)",

    borderTop:
      "2px solid #00E6A8",
  },


  /* ==========================================================
     ERROR
  ========================================================== */

  errorBox: {
    display: "flex",

    alignItems: "center",

    gap: "12px",

    padding: "18px",

    borderRadius: "12px",

    background:
      COLORS.redSoft,

    border:
      `1px solid ${COLORS.redBorder}`,
  },

  errorIcon: {
    width: "32px",

    height: "32px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    flexShrink: 0,

    borderRadius: "50%",

    background:
      "rgba(239,68,68,0.10)",

    border:
      `1px solid ${COLORS.redBorder}`,

    color: COLORS.red,

    fontWeight: 800,
  },

  errorTitle: {
    color: COLORS.red,

    fontSize: "12px",
  },

  errorText: {
    margin: "5px 0 0",

    color: COLORS.textMuted,

    fontSize: "10px",
  },
};