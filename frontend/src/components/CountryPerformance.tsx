import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

type CountryData = {
  country: string;
  orders: number;
  revenue: number;
  cost: number;
  profit: number;
  margin?: number;
};

type CountryPerformanceProps = {
  country: string;
  region: string;
  product: string;
  month: string;
};

const API_URL = "http://localhost:5000";

const COLORS = {
  background: "#070A09",
  panel: "#0B100E",

  emerald: "#00E6A8",
  emeraldSoft: "rgba(0,230,168,0.06)",
  emeraldBorder: "rgba(0,230,168,0.18)",

  white: "#F5F7F6",
  text: "#D9E1DE",
  muted: "#7A8581",
  darkMuted: "#4F5A56",

  red: "#EF4444",
  redSoft: "rgba(239,68,68,0.06)",
  redBorder: "rgba(239,68,68,0.18)",
};

/* ============================================================
   MAIN COMPONENT
============================================================ */

function CountryPerformance({
  country,
  region,
  product,
  month,
}: CountryPerformanceProps) {
  const [data, setData] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ============================================================
     LOAD COUNTRY DATA FROM METRICMIND BACKEND
============================================================ */

  useEffect(() => {
    const controller = new AbortController();

    const loadCountryData = async () => {
      try {
        setLoading(true);
        setError("");

        /* ======================================================
           BUILD FILTER QUERY
        ====================================================== */

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

        const queryString =
          params.toString();

        const response = await fetch(
          `${API_URL}/api/analytics/country${
            queryString
              ? `?${queryString}`
              : ""
          }`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Backend returned ${response.status}`
          );
        }

        const result = await response.json();

        /*
         * Expected backend response:
         *
         * {
         *   dimension: "Geography",
         *   data: [...]
         * }
         */

        if (!Array.isArray(result?.data)) {
          throw new Error(
            "Invalid country performance response"
          );
        }

        const normalizedData: CountryData[] =
          result.data.map(
            (item: CountryData) => ({
              country: String(
                item.country ?? "Unknown"
              ),

              orders: Number(
                item.orders ?? 0
              ),

              revenue: Number(
                item.revenue ?? 0
              ),

              cost: Number(
                item.cost ?? 0
              ),

              profit: Number(
                item.profit ?? 0
              ),

              margin:
                item.margin !== undefined
                  ? Number(item.margin)
                  : undefined,
            })
          );

        setData(normalizedData);

      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Country Performance API error:",
          err
        );

        setError(
          "Unable to load country performance from MetricMind backend."
        );

        setData([]);

      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadCountryData();

    return () => {
      controller.abort();
    };

  }, [
    country,
    region,
    product,
    month,
  ]);

  /* ============================================================
     FORMATTERS
============================================================ */

  const currency = (value: number) => {
    return `₹${Number(
      value || 0
    ).toLocaleString("en-IN")}`;
  };

  const getMargin = (
    revenue: number,
    profit: number,
    suppliedMargin?: number
  ) => {
    if (
      suppliedMargin !== undefined &&
      Number.isFinite(suppliedMargin)
    ) {
      return suppliedMargin;
    }

    if (!revenue) {
      return 0;
    }

    return (
      (Number(profit) /
        Number(revenue)) *
      100
    );
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
              BUSINESS DATA
            </div>

            <h2 style={styles.title}>
              Country Performance
            </h2>

            <p style={styles.subtitle}>
              Analyzing country-level business performance
            </p>
          </div>
        </div>

        <div style={styles.loadingPanel}>
          <div style={styles.spinner} />

          <span style={styles.loadingText}>
            Loading country performance...
          </span>
        </div>

      </div>
    );
  }

  /* ============================================================
     ERROR
============================================================ */

  if (error) {
    return (
      <div style={styles.container}>

        <div style={styles.header}>
          <div>
            <div style={styles.eyebrow}>
              BUSINESS DATA
            </div>

            <h2 style={styles.title}>
              Country Performance
            </h2>

            <p style={styles.subtitle}>
              Country-level business performance overview
            </p>
          </div>
        </div>

        <div style={styles.errorPanel}>

          <div style={styles.errorIcon}>
            !
          </div>

          <div>
            <strong style={styles.errorTitle}>
              Unable to load country data
            </strong>

            <p style={styles.errorText}>
              {error}
            </p>

            <p style={styles.errorHint}>
              Make sure the MetricMind backend is running
              on port 5000.
            </p>
          </div>

        </div>

      </div>
    );
  }

  /* ============================================================
     EMPTY DATA
============================================================ */

  if (data.length === 0) {
    return (
      <div style={styles.container}>

        <div style={styles.header}>
          <div>
            <div style={styles.eyebrow}>
              BUSINESS DATA
            </div>

            <h2 style={styles.title}>
              Country Performance
            </h2>

            <p style={styles.subtitle}>
              Country-level business performance overview
            </p>
          </div>
        </div>

        <div style={styles.emptyPanel}>
          No country performance data available.
        </div>

      </div>
    );
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
            BUSINESS DATA
          </div>

          <h2 style={styles.title}>
            Country Performance
          </h2>

          <p style={styles.subtitle}>
            Compare revenue, cost and profitability across countries
          </p>

        </div>

        <div style={styles.countryBadge}>

          <span style={styles.statusDot} />

          {data.length} Countries

        </div>

      </div>


      {/* ======================================================
          PERFORMANCE PANEL
      ====================================================== */}

      <div style={styles.tablePanel}>

        <div style={styles.topGlow} />

        {/* ====================================================
            TABLE HEADER
        ==================================================== */}

        <div style={styles.tableHeader}>

          <div style={styles.headerCell}>
            COUNTRY
          </div>

          <div
            style={{
              ...styles.headerCell,
              textAlign: "center",
            }}
          >
            ORDERS
          </div>

          <div
            style={{
              ...styles.headerCell,
              textAlign: "right",
            }}
          >
            REVENUE
          </div>

          <div
            style={{
              ...styles.headerCell,
              textAlign: "right",
            }}
          >
            COST
          </div>

          <div
            style={{
              ...styles.headerCell,
              textAlign: "right",
            }}
          >
            PROFIT
          </div>

        </div>


        {/* ====================================================
            COUNTRY ROWS
        ==================================================== */}

        <div>

          {data.map((item, index) => {

            const margin =
              getMargin(
                item.revenue,
                item.profit,
                item.margin
              );

            const isPositive =
              Number(item.profit) >= 0;

            return (
              <div
                key={`${item.country}-${index}`}
                style={{
                  ...styles.countryRow,

                  borderBottom:
                    index === data.length - 1
                      ? "none"
                      : "1px solid rgba(255,255,255,0.055)",
                }}
              >

                {/* =================================================
                    COUNTRY
                ================================================= */}

                <div style={styles.countryInfo}>

                  <div style={styles.countryName}>
                    {item.country}
                  </div>

                  <div style={styles.marginRow}>

                    <div style={styles.progressTrack}>

                      <div
                        style={{
                          ...styles.progressBar,

                          width: `${Math.min(
                            Math.max(
                              margin,
                              0
                            ),
                            100
                          )}%`,

                          background:
                            isPositive
                              ? COLORS.emerald
                              : COLORS.red,

                          boxShadow:
                            isPositive
                              ? "0 0 10px rgba(0,230,168,0.30)"
                              : "0 0 10px rgba(239,68,68,0.25)",
                        }}
                      />

                    </div>

                    <span
                      style={{
                        ...styles.marginValue,

                        color:
                          isPositive
                            ? COLORS.emerald
                            : COLORS.red,
                      }}
                    >
                      {margin.toFixed(1)}%
                    </span>

                  </div>

                </div>


                {/* =================================================
                    ORDERS
                ================================================= */}

                <div
                  style={{
                    ...styles.dataCell,
                    textAlign: "center",
                  }}
                >

                  <span style={styles.orderValue}>
                    {Number(
                      item.orders || 0
                    ).toLocaleString("en-IN")}
                  </span>

                </div>


                {/* =================================================
                    REVENUE
                ================================================= */}

                <div
                  style={{
                    ...styles.dataCell,
                    textAlign: "right",
                  }}
                >

                  <span style={styles.revenueValue}>
                    {currency(
                      item.revenue
                    )}
                  </span>

                </div>


                {/* =================================================
                    COST
                ================================================= */}

                <div
                  style={{
                    ...styles.dataCell,
                    textAlign: "right",
                  }}
                >

                  <span style={styles.costValue}>
                    {currency(
                      item.cost
                    )}
                  </span>

                </div>


                {/* =================================================
                    PROFIT
                ================================================= */}

                <div
                  style={{
                    ...styles.dataCell,
                    textAlign: "right",
                  }}
                >

                  <span
                    style={{
                      ...styles.profitValue,

                      color:
                        isPositive
                          ? COLORS.emerald
                          : COLORS.red,
                    }}
                  >
                    {currency(
                      item.profit
                    )}
                  </span>

                </div>

              </div>
            );
          })}

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

  container: {
    position: "relative",

    overflow: "hidden",

    background:
      "radial-gradient(circle at 95% 0%, rgba(0,230,168,0.065), transparent 30%), linear-gradient(145deg, #0B100E 0%, #070A09 55%, #040605 100%)",

    padding: "24px",

    borderRadius: "18px",

    marginTop: "20px",

    marginBottom: "24px",

    border:
      "1px solid rgba(0,230,168,0.14)",

    boxShadow:
      "0 20px 55px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.025)",

    color: COLORS.white,
  },

  header: {
    display: "flex",

    justifyContent:
      "space-between",

    alignItems:
      "flex-start",

    gap: "20px",

    marginBottom: "18px",
  },

  eyebrow: {
    color: COLORS.emerald,

    fontSize: "8px",

    fontWeight: 800,

    letterSpacing: "1.8px",

    marginBottom: "7px",
  },

  title: {
    margin: 0,

    color: COLORS.white,

    fontSize: "22px",

    fontWeight: 800,

    letterSpacing: "-0.035em",
  },

  subtitle: {
    margin: "6px 0 0",

    color: COLORS.muted,

    fontSize: "11px",

    lineHeight: 1.5,
  },

  countryBadge: {
    display: "flex",

    alignItems: "center",

    gap: "7px",

    padding: "7px 11px",

    borderRadius: "999px",

    background:
      "rgba(0,230,168,0.045)",

    border:
      "1px solid rgba(0,230,168,0.15)",

    color: COLORS.emerald,

    fontSize: "9px",

    fontWeight: 700,

    whiteSpace: "nowrap",
  },

  statusDot: {
    width: "6px",

    height: "6px",

    borderRadius: "50%",

    background:
      COLORS.emerald,

    boxShadow:
      "0 0 8px rgba(0,230,168,0.65)",
  },

  tablePanel: {
    position: "relative",

    overflow: "hidden",

    background:
      "linear-gradient(145deg, #0D1411 0%, #080D0B 100%)",

    border:
      "1px solid rgba(0,230,168,0.16)",

    borderRadius: "15px",

    boxShadow:
      "0 15px 45px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.02)",
  },

  topGlow: {
    position: "absolute",

    top: 0,

    left: "12%",

    right: "12%",

    height: "1px",

    background:
      "linear-gradient(90deg, transparent, rgba(0,230,168,0.65), transparent)",

    boxShadow:
      "0 0 14px rgba(0,230,168,0.35)",
  },

  tableHeader: {
    display: "grid",

    gridTemplateColumns:
      "2fr 0.8fr 1.25fr 1.25fr 1.25fr",

    alignItems: "center",

    padding:
      "15px 18px",

    background:
      "rgba(0,230,168,0.025)",

    borderBottom:
      "1px solid rgba(0,230,168,0.10)",
  },

  headerCell: {
    color: COLORS.darkMuted,

    fontSize: "8px",

    fontWeight: 800,

    letterSpacing: "1.3px",
  },

  countryRow: {
    display: "grid",

    gridTemplateColumns:
      "2fr 0.8fr 1.25fr 1.25fr 1.25fr",

    alignItems: "center",

    minHeight: "82px",

    padding:
      "12px 18px",
  },

  countryInfo: {
    minWidth: 0,

    paddingRight: "15px",
  },

  countryName: {
    color: COLORS.text,

    fontSize: "12px",

    fontWeight: 700,

    marginBottom: "9px",
  },

  marginRow: {
    display: "flex",

    alignItems: "center",

    gap: "8px",

    maxWidth: "210px",
  },

  progressTrack: {
    flex: 1,

    height: "4px",

    overflow: "hidden",

    borderRadius: "999px",

    background:
      "rgba(255,255,255,0.06)",
  },

  progressBar: {
    height: "100%",

    borderRadius: "999px",

    transition:
      "width 0.4s ease",
  },

  marginValue: {
    minWidth: "34px",

    fontSize: "8px",

    fontWeight: 700,

    textAlign: "right",
  },

  dataCell: {
    fontSize: "11px",

    paddingLeft: "8px",
  },

  orderValue: {
    display: "inline-flex",

    alignItems: "center",

    justifyContent: "center",

    minWidth: "32px",

    padding:
      "5px 8px",

    borderRadius: "6px",

    background:
      "rgba(255,255,255,0.035)",

    color: COLORS.text,

    fontWeight: 700,
  },

  revenueValue: {
    color: COLORS.text,

    fontWeight: 700,
  },

  costValue: {
    color: COLORS.muted,

    fontWeight: 600,
  },

  profitValue: {
    fontWeight: 800,

    textShadow:
      "0 0 10px rgba(0,230,168,0.12)",
  },

  loadingPanel: {
    minHeight: "150px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    gap: "12px",

    borderRadius: "14px",

    background:
      "rgba(0,230,168,0.025)",

    border:
      "1px solid rgba(0,230,168,0.08)",
  },

  spinner: {
    width: "18px",

    height: "18px",

    borderRadius: "50%",

    border:
      "2px solid rgba(0,230,168,0.15)",

    borderTop:
      "2px solid #00E6A8",

    animation:
      "spin 0.8s linear infinite",
  },

  loadingText: {
    color: COLORS.muted,

    fontSize: "11px",
  },

  errorPanel: {
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

    margin: "4px 0 0",

    color: COLORS.muted,

    fontSize: "10px",
  },

  errorHint: {
    margin: "5px 0 0",

    color: COLORS.darkMuted,

    fontSize: "9px",
  },

  emptyPanel: {
    padding: "35px",

    textAlign: "center",

    borderRadius: "14px",

    background: "rgba(255,255,255,0.02)",

    border: "1px solid rgba(255,255,255,0.06)",

    color: COLORS.muted,

    fontSize: "11px",
  },

};

export default CountryPerformance;