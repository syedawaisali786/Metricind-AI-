import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type RegionChartProps = {
  country: string;
  region: string;
  product: string;
  month: string;
};

type RegionData = {
  region: string;
  revenue: number;
};

type TooltipPayload = {
  name?: string;
  value?: number | string;
};

const API_URL = "http://localhost:5000";

const formatCurrency = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

const PIE_COLORS = [
  "#00E6A8",
  "#087F5B",
  "#202827",
  "#0BBF8A",
  "#145C49",
];

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const item = payload[0];

  return (
    <div
      style={{
        minWidth: "180px",
        padding: "14px 16px",
        background:
          "linear-gradient(145deg, #141917 0%, #090D0C 100%)",
        border:
          "1px solid rgba(0,230,168,0.28)",
        borderRadius: "11px",
        boxShadow:
          "0 18px 45px rgba(0,0,0,0.65), 0 0 25px rgba(0,230,168,0.06)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          color: "#A7B0AD",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "1px",
          textTransform: "uppercase",
          marginBottom: "7px",
        }}
      >
        {item.name}
      </div>

      <div
        style={{
          color: "#00F5B5",
          fontSize: "19px",
          fontWeight: 800,
        }}
      >
        {typeof item.value === "number"
          ? formatCurrency(item.value)
          : item.value}
      </div>
    </div>
  );
}

function RegionChart({
  country,
  region,
  product,
  month,
}: RegionChartProps) {
  const [data, setData] =
    useState<RegionData[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  /* =========================================================
     FETCH REGION DATA
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    async function fetchRegionData() {
      try {
        setLoading(true);
        setError(false);

        const params =
          new URLSearchParams();

        if (country) {
          params.append(
            "country",
            country
          );
        }

        if (region) {
          params.append(
            "region",
            region
          );
        }

        if (product) {
          params.append(
            "product",
            product
          );
        }

        if (month) {
          params.append(
            "month",
            month
          );
        }

        const query =
          params.toString();

        const url =
          query.length > 0
            ? `${API_URL}/api/analytics/region?${query}`
            : `${API_URL}/api/analytics/region`;

        const response =
          await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Unable to load regional analytics: ${response.status}`
          );
        }

        const result =
          await response.json();

        if (cancelled) {
          return;
        }

        const regionData =
          Array.isArray(result)
            ? result
            : result.data ?? [];

        const normalizedData =
          regionData
            .map(
              (item: {
                region?: string;
                revenue?: number;
              }) => ({
                region:
                  String(
                    item.region ||
                      "Unknown"
                  ),

                revenue:
                  Number(
                    item.revenue || 0
                  ),
              })
            )
            .filter(
              (item: RegionData) =>
                Number.isFinite(
                  item.revenue
                )
            );

        setData(normalizedData);
      } catch (err) {
        console.error(
          "Error loading region data:",
          err
        );

        if (!cancelled) {
          setError(true);
          setData([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchRegionData();

    return () => {
      cancelled = true;
    };
  }, [
    country,
    region,
    product,
    month,
  ]);

  /* =========================================================
     SUMMARY CALCULATIONS
  ========================================================= */

  const totalRevenue =
    data.reduce(
      (total, item) =>
        total +
        Number(item.revenue || 0),
      0
    );

  const topRegion =
    data.length > 0
      ? data.reduce(
          (top, item) =>
            Number(item.revenue) >
            Number(top.revenue)
              ? item
              : top
        )
      : null;

  const averageRevenue =
    data.length > 0
      ? totalRevenue / data.length
      : 0;

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <div
      className="premium-chart premium-region-chart"
      style={{
        background:
          "linear-gradient(145deg, #0B110F 0%, #070B0A 100%)",
        border:
          "1px solid rgba(0,230,168,0.18)",
        borderRadius: "18px",
        boxShadow:
          "0 18px 55px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.025)",
        overflow: "hidden",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="premium-chart-header">
        <div>
          <div
            className="premium-chart-eyebrow"
            style={{
              color: "#00E6A8",
              fontWeight: 800,
              letterSpacing: "0.15em",
              fontSize: "9px",
            }}
          >
            REGIONAL ANALYTICS
          </div>

          <h2
            style={{
              color: "#F5F7F6",
            }}
          >
            Revenue by Region
          </h2>

          <p
            style={{
              color: "#A7B0AD",
            }}
          >
            Compare revenue performance
            across business regions
          </p>
        </div>

        <div
          className="chart-status"
          style={{
            color: "#00E6A8",
            background:
              "rgba(0,230,168,0.055)",
            border:
              "1px solid rgba(0,230,168,0.16)",
            boxShadow:
              "0 0 18px rgba(0,230,168,0.04)",
          }}
        >
          <span
            className="chart-status-dot"
            style={{
              background: "#00E6A8",
              boxShadow:
                "0 0 10px rgba(0,230,168,0.75)",
            }}
          />

          Live Snowflake Data
        </div>
      </div>

      {/* =====================================================
          DONUT CHART
      ===================================================== */}

      <div
        className="premium-chart-container"
        style={{
          height: 380,
          position: "relative",
        }}
      >
        {loading ? (
          <div className="chart-loading">
            <div className="chart-loading-spinner" />

            <span>
              Loading regional analytics...
            </span>
          </div>
        ) : error ? (
          <div className="chart-empty">
            <div
              className="chart-empty-icon"
              style={{
                color: "#00E6A8",
              }}
            >
              !
            </div>

            <strong>
              Unable to load regional data
            </strong>

            <span>
              Check that the backend is
              running.
            </span>
          </div>
        ) : data.length === 0 ? (
          <div className="chart-empty">
            <div
              className="chart-empty-icon"
              style={{
                color: "#00E6A8",
              }}
            >
              ◇
            </div>

            <strong>
              No regional data available
            </strong>

            <span>
              There is currently no data
              to display.
            </span>
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={data}
                dataKey="revenue"
                nameKey="region"
                cx="50%"
                cy="47%"
                innerRadius={92}
                outerRadius={145}
                paddingAngle={2}
                startAngle={90}
                endAngle={-270}
                stroke="none"
                animationDuration={1100}
                animationEasing="ease-out"
              >
                {data.map(
                  (item, index) => (
                    <Cell
                      key={`region-${item.region}`}
                      fill={
                        PIE_COLORS[
                          index %
                            PIE_COLORS.length
                        ]
                      }
                      style={{
                        filter:
                          item.region ===
                          topRegion?.region
                            ? "drop-shadow(0 0 10px rgba(0,230,168,0.48))"
                            : "none",
                      }}
                    />
                  )
                )}
              </Pie>

              <Tooltip
                content={
                  <CustomTooltip />
                }
              />
            </PieChart>
          </ResponsiveContainer>
        )}

        {/* CENTER TOTAL */}

        {!loading &&
          !error &&
          data.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "47%",
                left: "50%",
                transform:
                  "translate(-50%, -50%)",
                textAlign: "center",
                pointerEvents: "none",
                width: "180px",
              }}
            >
              <div
                style={{
                  color: "#00F5B5",
                  fontSize: "25px",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: "-0.5px",
                  textShadow:
                    "0 0 18px rgba(0,230,168,0.22)",
                }}
              >
                {formatCurrency(
                  totalRevenue
                )}
              </div>

              <div
                style={{
                  color: "#69736F",
                  fontSize: "11px",
                  marginTop: "7px",
                  fontWeight: 500,
                }}
              >
                Total Revenue
              </div>
            </div>
          )}
      </div>

      {/* =====================================================
          REGIONAL BREAKDOWN
      ===================================================== */}

      {!loading &&
        !error &&
        data.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                `repeat(${Math.min(
                  data.length,
                  3
                )}, 1fr)`,
              borderTop:
                "1px solid rgba(255,255,255,0.055)",
              padding:
                "18px 22px 20px",
            }}
          >
            {data.map(
              (item, index) => {
                const revenue =
                  Number(
                    item.revenue || 0
                  );

                const percentage =
                  totalRevenue > 0
                    ? (revenue /
                        totalRevenue) *
                      100
                    : 0;

                return (
                  <div
                    key={item.region}
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: "11px",
                      padding:
                        "0 18px",
                      borderRight:
                        index !==
                        data.length - 1
                          ? "1px solid rgba(255,255,255,0.07)"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        width: "7px",
                        height: "38px",
                        borderRadius: "3px",
                        background:
                          PIE_COLORS[
                            index %
                              PIE_COLORS.length
                          ],
                        boxShadow:
                          item.region ===
                          topRegion?.region
                            ? "0 0 10px rgba(0,230,168,0.45)"
                            : "none",
                        flexShrink: 0,
                      }}
                    />

                    <div>
                      <div
                        style={{
                          color:
                            "#F5F7F6",
                          fontSize:
                            "20px",
                          fontWeight:
                            800,
                          lineHeight: 1,
                        }}
                      >
                        {Math.round(
                          percentage
                        )}
                        %
                      </div>

                      <div
                        style={{
                          color:
                            "#A7B0AD",
                          fontSize:
                            "11px",
                          marginTop:
                            "6px",
                        }}
                      >
                        {item.region}
                      </div>

                      <div
                        style={{
                          color:
                            "#00E6A8",
                          fontSize:
                            "11px",
                          fontWeight:
                            700,
                          marginTop:
                            "4px",
                        }}
                      >
                        {formatCurrency(
                          revenue
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}

      {/* =====================================================
          REGIONAL SUMMARY
      ===================================================== */}

      {!loading &&
        !error &&
        data.length > 0 && (
          <div className="chart-summary">
            <div className="chart-summary-item">
              <span
                className="summary-label"
                style={{
                  color: "#69736F",
                }}
              >
                TOTAL REVENUE
              </span>

              <strong
                style={{
                  color: "#F5F7F6",
                }}
              >
                {formatCurrency(
                  totalRevenue
                )}
              </strong>

              <span
                className="summary-positive"
                style={{
                  color: "#00E6A8",
                }}
              >
                ● All regions
              </span>
            </div>

            <div
              className="chart-summary-divider"
              style={{
                background:
                  "rgba(255,255,255,0.07)",
              }}
            />

            <div className="chart-summary-item">
              <span
                className="summary-label"
                style={{
                  color: "#69736F",
                }}
              >
                TOP REGION
              </span>

              <strong
                style={{
                  color: "#00E6A8",
                }}
              >
                {topRegion?.region ??
                  "-"}
              </strong>

              <span
                className="summary-positive"
                style={{
                  color: "#00E6A8",
                }}
              >
                {topRegion
                  ? formatCurrency(
                      Number(
                        topRegion.revenue
                      )
                    )
                  : "-"}
              </span>
            </div>

            <div
              className="chart-summary-divider"
              style={{
                background:
                  "rgba(255,255,255,0.07)",
              }}
            />

            <div className="chart-summary-item">
              <span
                className="summary-label"
                style={{
                  color: "#69736F",
                }}
              >
                AVG. REVENUE
              </span>

              <strong
                style={{
                  color: "#F5F7F6",
                }}
              >
                {formatCurrency(
                  averageRevenue
                )}
              </strong>

              <span
                className="summary-neutral"
                style={{
                  color: "#69736F",
                }}
              >
                Per region
              </span>
            </div>
          </div>
        )}
    </div>
  );
}

export default RegionChart;