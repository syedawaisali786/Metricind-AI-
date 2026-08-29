import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type SalesChartProps = {
  country: string;
  region: string;
  product: string;
  month: string;
};

type ProductData = {
  product: string;
  sales: number;
};

const API_URL = "http://localhost:5000";

const formatCurrency = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const COLORS = [
  "#00E6A8",
  "#087F5B",
  "#202827",
  "#00B884",
  "#145C47",
];

/* =========================================================
   CUSTOM TOOLTIP
========================================================= */

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0];

  return (
    <div
      style={{
        minWidth: "170px",
        padding: "13px 15px",
        background:
          "linear-gradient(145deg, #141917 0%, #090D0C 100%)",
        border: "1px solid rgba(0,230,168,0.28)",
        borderRadius: "10px",
        boxShadow: "0 18px 45px rgba(0,0,0,0.65)",
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
          marginBottom: "6px",
        }}
      >
        {item.name}
      </div>

      <div
        style={{
          color: "#00F5B5",
          fontSize: "18px",
          fontWeight: 800,
        }}
      >
        {formatCurrency(Number(item.value))}
      </div>
    </div>
  );
}

/* =========================================================
   SALES / PRODUCT DONUT CHART
========================================================= */

function SalesChart({
  country,
  region,
  product,
  month,
}: SalesChartProps) {
  const [data, setData] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD PRODUCT DATA
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadProductData() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (country) {
          params.append("country", country);
        }

        if (region) {
          params.append("region", region);
        }

        if (product) {
          params.append("product", product);
        }

        if (month) {
          params.append("month", month);
        }

        const queryString =
          params.toString();

        const url =
          queryString.length > 0
            ? `${API_URL}/api/analytics/product?${queryString}`
            : `${API_URL}/api/analytics/product`;

        const response =
          await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Request failed with status ${response.status}`
          );
        }

        const result =
          await response.json();

        if (
          !result ||
          !Array.isArray(result.data)
        ) {
          throw new Error(
            "Invalid product analytics response"
          );
        }

        const productData: ProductData[] =
          result.data
            .map(
              (item: {
                product?: string;
                profit?: number;
              }) => ({
                product:
                  String(
                    item.product ||
                      "Unknown"
                  ),

                sales:
                  Number(
                    item.profit || 0
                  ),
              })
            )
            .filter(
              (item: ProductData) =>
                Number.isFinite(
                  item.sales
                )
            );

        if (!cancelled) {
          setData(productData);
        }
      } catch (err) {
        console.error(
          "Error loading product analytics:",
          err
        );

        if (!cancelled) {
          setData([]);

          setError(
            "Unable to load product performance."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProductData();

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
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div
        className="premium-chart"
        style={{
          background:
            "linear-gradient(145deg, #0B110F 0%, #070B0A 100%)",
          border:
            "1px solid rgba(0,230,168,0.18)",
          borderRadius: "18px",
          boxShadow:
            "0 18px 55px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.025)",
          overflow: "hidden",
          minHeight: "350px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#69736F",
          fontSize: "11px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              border:
                "2px solid rgba(0,230,168,0.15)",
              borderTop:
                "2px solid #00E6A8",
              animation:
                "spin 0.8s linear infinite",
            }}
          />

          Loading product performance...
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div
        className="premium-chart"
        style={{
          background:
            "linear-gradient(145deg, #0B110F 0%, #070B0A 100%)",
          border:
            "1px solid rgba(239,68,68,0.18)",
          borderRadius: "18px",
          padding: "30px",
          color: "#EF4444",
          fontSize: "11px",
          textAlign: "center",
        }}
      >
        {error}
      </div>
    );
  }

  /* =========================================================
     EMPTY DATA
  ========================================================= */

  if (data.length === 0) {
    return (
      <div
        className="premium-chart"
        style={{
          background:
            "linear-gradient(145deg, #0B110F 0%, #070B0A 100%)",
          border:
            "1px solid rgba(0,230,168,0.18)",
          borderRadius: "18px",
          padding: "50px",
          color: "#69736F",
          fontSize: "11px",
          textAlign: "center",
        }}
      >
        No product performance data available.
      </div>
    );
  }

  /* =========================================================
     CALCULATIONS
  ========================================================= */

  const total = data.reduce(
    (sum, item) =>
      sum + Number(item.sales || 0),
    0
  );

  const topProduct = data.reduce(
    (top, item) =>
      item.sales > top.sales
        ? item
        : top,
    data[0]
  );

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <div
      className="premium-chart"
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
      {/* =================================================
          HEADER
      ================================================= */}

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
            PRODUCT PERFORMANCE
          </div>

          <h2
            style={{
              color: "#F5F7F6",
            }}
          >
            Profit by Product
          </h2>

          <p
            style={{
              color: "#A7B0AD",
            }}
          >
            Product-level contribution to business
            performance
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

      {/* =================================================
          DONUT CHART
      ================================================= */}

      <div
        className="premium-chart-container"
        style={{
          height: 350,
          position: "relative",
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="sales"
              nameKey="product"
              cx="50%"
              cy="48%"
              innerRadius={92}
              outerRadius={145}
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              animationDuration={1000}
            >
              {data.map(
                (entry, index) => (
                  <Cell
                    key={`cell-${entry.product}`}
                    fill={
                      COLORS[
                        index %
                          COLORS.length
                      ]
                    }
                    style={{
                      filter:
                        index === 0
                          ? "drop-shadow(0 0 10px rgba(0,230,168,0.45))"
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

        {/* =================================================
            CENTER TOTAL
        ================================================= */}

        <div
          style={{
            position: "absolute",
            top: "48%",
            left: "50%",
            transform:
              "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none",
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
            {formatCurrency(total)}
          </div>

          <div
            style={{
              color: "#69736F",
              fontSize: "11px",
              marginTop: "7px",
              fontWeight: 500,
            }}
          >
            Total Profit
          </div>
        </div>
      </div>

      {/* =================================================
          PRODUCT BREAKDOWN
      ================================================= */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(
            data.length,
            4
          )}, 1fr)`,
          borderTop:
            "1px solid rgba(255,255,255,0.055)",
          padding:
            "18px 22px 20px",
        }}
      >
        {data.map(
          (item, index) => {
            const percentage =
              total !== 0
                ? (item.sales /
                    total) *
                  100
                : 0;

            return (
              <div
                key={item.product}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "11px",
                  padding: "0 18px",
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
                      COLORS[
                        index %
                          COLORS.length
                      ],
                    boxShadow:
                      index === 0
                        ? "0 0 10px rgba(0,230,168,0.45)"
                        : "none",
                    flexShrink: 0,
                  }}
                />

                <div>
                  <div
                    style={{
                      color: "#F5F7F6",
                      fontSize: "20px",
                      fontWeight: 800,
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
                      color: "#A7B0AD",
                      fontSize: "11px",
                      marginTop: "6px",
                    }}
                  >
                    {item.product}
                  </div>

                  <div
                    style={{
                      color: "#00E6A8",
                      fontSize: "11px",
                      fontWeight: 700,
                      marginTop: "4px",
                    }}
                  >
                    {formatCurrency(
                      item.sales
                    )}
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="chart-summary">
        <div className="chart-summary-item">
          <span
            className="summary-label"
            style={{
              color: "#69736F",
            }}
          >
            TOP PRODUCT
          </span>

          <strong
            style={{
              color: "#F5F7F6",
            }}
          >
            {topProduct.product}
          </strong>

          <span
            className="summary-positive"
            style={{
              color: "#00E6A8",
            }}
          >
            {formatCurrency(
              topProduct.sales
            )}
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
            PRODUCTS TRACKED
          </span>

          <strong
            style={{
              color: "#F5F7F6",
            }}
          >
            {data.length}
          </strong>

          <span
            className="summary-neutral"
            style={{
              color: "#69736F",
            }}
          >
            Active categories
          </span>
        </div>
      </div>
    </div>
  );
}

export default SalesChart;