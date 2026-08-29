/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/* =========================================================
   TYPES
========================================================= */

type KPIData = {
  revenue: number;
  cost: number;
  profit: number;
  orders: number;
  margin: number;
};

/* =========================================================
   MONTHLY DATA
========================================================= */

const monthlyData = [
  { month: "Jan", revenue: 19000, profit: 6500 },
  { month: "Feb", revenue: 18000, profit: 6700 },
  { month: "Mar", revenue: 20000, profit: 6800 },
  { month: "Apr", revenue: 12500, profit: 5000 },
  { month: "May", revenue: 16500, profit: 6000 },
  { month: "Jun", revenue: 23500, profit: 8800 },
];

/* =========================================================
   PRODUCT DATA
========================================================= */

const productData = [
  { product: "Laptop", profit: 23000 },
  { product: "Monitor", profit: 10500 },
  { product: "Keyboard", profit: 3200 },
];

/* =========================================================
   REGION DATA
========================================================= */

const regionData = [
  { region: "North", revenue: 28500 },
  { region: "South", revenue: 22000 },
  { region: "East", revenue: 17500 },
  { region: "West", revenue: 31500 },
];

/* =========================================================
   COLORS
========================================================= */

const COLORS = {
  orange: "#00E5A0",
  orangeLight: "#00F5A0",
  orangeDark: "#087F5B",

  background: "#080808",
  card: "#101010",

  text: "#f5f5f5",
  secondary: "#a3a3a3",
  muted: "#737373",

  grid: "rgba(255,255,255,0.07)",
};

/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (value: number) => {
  return `₹${value.toLocaleString("en-IN")}`;
};

/* =========================================================
   CHART TOOLTIP
========================================================= */

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        background: "linear-gradient(145deg, #171717, #0b0b0b)",
        border: "1px solid rgba(249,115,22,0.35)",
        borderRadius: "10px",
        padding: "12px 14px",
        boxShadow: "0 15px 35px rgba(0,0,0,0.55)",
        minWidth: "145px",
      }}
    >
      <div
        style={{
          color: COLORS.orangeLight,
          fontSize: "11px",
          fontWeight: 700,
          marginBottom: "8px",
        }}
      >
        {label}
      </div>

      {payload.map((item, index) => (
        <div
          key={`${item.dataKey}-${index}`}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            marginTop: "6px",
          }}
        >
          <span
            style={{
              color: COLORS.secondary,
              fontSize: "11px",
            }}
          >
            {item.name}
          </span>

          <span
            style={{
              color: COLORS.orangeLight,
              fontSize: "12px",
              fontWeight: 750,
            }}
          >
            {formatCurrency(Number(item.value))}
          </span>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   SINGLE VALUE TOOLTIP
========================================================= */

function SingleValueTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        background: "linear-gradient(145deg, #171717, #0b0b0b)",
        border: "1px solid rgba(249,115,22,0.35)",
        borderRadius: "10px",
        padding: "12px 14px",
        boxShadow: "0 15px 35px rgba(0,0,0,0.55)",
      }}
    >
      <div
        style={{
          color: COLORS.secondary,
          fontSize: "11px",
          marginBottom: "6px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: COLORS.orangeLight,
          fontSize: "15px",
          fontWeight: 800,
        }}
      >
        {formatCurrency(Number(payload[0].value))}
      </div>
    </div>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function ChartSectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          color: COLORS.orange,
          fontSize: "9px",
          fontWeight: 800,
          letterSpacing: "2px",
          textTransform: "uppercase",
          marginBottom: "7px",
        }}
      >
        {eyebrow}
      </div>

      <h2
        style={{
          margin: 0,
          color: COLORS.text,
          fontSize: "20px",
          fontWeight: 750,
          letterSpacing: "-0.4px",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          margin: "6px 0 0",
          color: COLORS.muted,
          fontSize: "12px",
        }}
      >
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   CHART CARD
========================================================= */

function ChartCard({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      style={{
        background:
          "linear-gradient(145deg, #121212 0%, #090909 100%)",

        border: "1px solid rgba(255,255,255,0.07)",

        borderRadius: "14px",

        padding: "22px",

        boxShadow:
          "0 15px 40px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.025)",

        position: "relative",

        overflow: "hidden",

        minWidth: 0,
      }}
    >
      {/* ORANGE TOP LINE */}

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background:
            "linear-gradient(90deg, #087F5B, #00E5A0, #00F5A0)",
          boxShadow:
            "0 0 14px rgba(249,115,22,0.20)",
        }}
      />

      {children}
    </div>
  );
}

/* =========================================================
   ANALYTICS PAGE
========================================================= */

function Analytics() {
  const [kpi, setKpi] = useState<KPIData | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/analytics/summary")
      .then((response) => response.json())
      .then((data: KPIData) => {
        setKpi(data);
      })
      .catch((error: unknown) => {
        console.error("KPI error:", error);
      });
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",

        background:
          "radial-gradient(circle at top right, rgba(249,115,22,0.055), transparent 30%), #080808",

        color: "#ffffff",

        padding: "38px 34px",

        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1450px",
          margin: "0 auto",
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div style={{ marginBottom: "30px" }}>
          <div
            style={{
              color: COLORS.orange,
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Analytics
          </div>

          <h1
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: "32px",
              fontWeight: 750,
              letterSpacing: "-1px",
            }}
          >
            Business Analytics
          </h1>

          <p
            style={{
              color: "#737373",
              marginTop: "8px",
              fontSize: "13px",
            }}
          >
            Monitor revenue, profitability and product performance.
          </p>
        </div>

        {/* =================================================
            KPI CARDS
        ================================================= */}

        {kpi && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, minmax(0, 1fr))",
              gap: "12px",
              marginBottom: "30px",
            }}
          >

            {/* REVENUE */}

            <div style={kpiCardStyle}>
              <KpiTopLine />

              <span style={kpiLabelStyle}>
                TOTAL REVENUE
              </span>

              <h2 style={kpiValueStyle}>
                {formatCurrency(kpi.revenue)}
              </h2>
            </div>

            {/* COST */}

            <div style={kpiCardStyle}>
              <KpiTopLine />

              <span style={kpiLabelStyle}>
                TOTAL COST
              </span>

              <h2 style={kpiValueStyle}>
                {formatCurrency(kpi.cost)}
              </h2>
            </div>

            {/* PROFIT */}

            <div style={kpiCardStyle}>
              <KpiTopLine />

              <span style={kpiLabelStyle}>
                TOTAL PROFIT
              </span>

              <h2 style={kpiValueStyle}>
                {formatCurrency(kpi.profit)}
              </h2>
            </div>

            {/* MARGIN */}

            <div style={kpiCardStyle}>
              <KpiTopLine />

              <span style={kpiLabelStyle}>
                PROFIT MARGIN
              </span>

              <h2 style={kpiValueStyle}>
                {kpi.margin}%
              </h2>
            </div>
          </div>
        )}

        {/* =================================================
            MONTHLY REVENUE & PROFIT
            FIRST ROW
        ================================================= */}

        <ChartCard>
          <ChartSectionHeader
            eyebrow="Revenue Analytics"
            title="Monthly Revenue & Profit"
            description="Revenue and profit trend across the selected period."
          />

          <div
            style={{
              width: "100%",
              height: 340,
            }}
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={monthlyData}
                margin={{
                  top: 10,
                  right: 15,
                  left: 0,
                  bottom: 5,
                }}
              >
                <defs>

                  <linearGradient
                    id="monthlyRevenueOrange"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#00E5A0"
                      stopOpacity={0.32}
                    />

                    <stop
                      offset="100%"
                      stopColor="#00E5A0"
                      stopOpacity={0.01}
                    />
                  </linearGradient>

                  <linearGradient
                    id="monthlyProfitOrange"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#00F5A0"
                      stopOpacity={0.22}
                    />

                    <stop
                      offset="100%"
                      stopColor="#00F5A0"
                      stopOpacity={0.01}
                    />
                  </linearGradient>

                </defs>

                <CartesianGrid
                  vertical={false}
                  stroke={COLORS.grid}
                  strokeDasharray="3 6"
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#737373",
                    fontSize: 11,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={55}
                  tick={{
                    fill: "#737373",
                    fontSize: 10,
                  }}
                  tickFormatter={(value) =>
                    `₹${Number(value) / 1000}k`
                  }
                />

                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{
                    stroke:
                      "rgba(249,115,22,0.30)",
                    strokeWidth: 1,
                  }}
                />

                <Legend
                  wrapperStyle={{
                    paddingTop: "12px",
                    fontSize: "11px",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#00E5A0"
                  strokeWidth={3}
                  fill="url(#monthlyRevenueOrange)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    stroke: "#00F5A0",
                    fill: "#0b0b0b",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="profit"
                  name="Profit"
                  stroke="#00F5A0"
                  strokeWidth={2.5}
                  fill="url(#monthlyProfitOrange)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    stroke: "#00E5A0",
                    fill: "#0b0b0b",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* =================================================
            SECOND ROW
            PROFIT BY PRODUCT + REVENUE BY REGION
        ================================================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2, minmax(0, 1fr))",
            gap: "16px",
            marginTop: "16px",
          }}
        >

          {/* =================================================
              PROFIT BY PRODUCT
          ================================================= */}

          <ChartCard>

            <ChartSectionHeader
              eyebrow="Product Performance"
              title="Profit by Product"
              description="Profit contribution across your product portfolio."
            />

            <div
              style={{
                width: "100%",
                height: 320,
              }}
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={productData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                  barCategoryGap="30%"
                >

                  <defs>
                    <linearGradient
                      id="productOrangeGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#00F5A0"
                      />

                      <stop
                        offset="55%"
                        stopColor="#00E5A0"
                      />

                      <stop
                        offset="100%"
                        stopColor="#c2410c"
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    vertical={false}
                    stroke={COLORS.grid}
                    strokeDasharray="3 6"
                  />

                  <XAxis
                    dataKey="product"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#737373",
                      fontSize: 11,
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    width={50}
                    tick={{
                      fill: "#737373",
                      fontSize: 10,
                    }}
                    tickFormatter={(value) =>
                      `₹${Number(value) / 1000}k`
                    }
                  />

                  <Tooltip
                    content={<SingleValueTooltip />}
                    cursor={{
                      fill:
                        "rgba(249,115,22,0.035)",
                    }}
                  />

                  <Bar
                    dataKey="profit"
                    name="Profit"
                    fill="url(#productOrangeGradient)"
                    radius={[7, 7, 2, 2]}
                    maxBarSize={58}
                  />

                </BarChart>
              </ResponsiveContainer>
            </div>

          </ChartCard>

                    {/* =================================================
              REVENUE BY REGION
          ================================================= */}

          <ChartCard>

            <ChartSectionHeader
              eyebrow="Regional Performance"
              title="Revenue by Region"
              description="Revenue distribution across business regions."
            />

            <div
              style={{
                width: "100%",
                height: 320,
              }}
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={regionData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                  barCategoryGap="30%"
                >

                  <defs>
                    <linearGradient
                      id="regionOrangeGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#00F5A0"
                      />

                      <stop
                        offset="55%"
                        stopColor="#00E5A0"
                      />

                      <stop
                        offset="100%"
                        stopColor="#c2410c"
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    vertical={false}
                    stroke={COLORS.grid}
                    strokeDasharray="3 6"
                  />

                  <XAxis
                    dataKey="region"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#737373",
                      fontSize: 11,
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    width={50}
                    tick={{
                      fill: "#737373",
                      fontSize: 10,
                    }}
                    tickFormatter={(value) =>
                      `₹${Number(value) / 1000}k`
                    }
                  />

                  <Tooltip
                    content={<SingleValueTooltip />}
                    cursor={{
                      fill:
                        "rgba(249,115,22,0.035)",
                    }}
                  />

                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill="url(#regionOrangeGradient)"
                    radius={[7, 7, 2, 2]}
                    maxBarSize={58}
                  />

                </BarChart>
              </ResponsiveContainer>
            </div>

          </ChartCard>

        </div>

      </div>
    </div>
  );
}

/* =========================================================
   KPI CARD STYLES
========================================================= */

const kpiCardStyle = {
  position: "relative" as const,

  background:
    "linear-gradient(145deg, #151515, #0b0b0b)",

  border:
    "1px solid rgba(249,115,22,0.16)",

  borderRadius: "12px",

  padding: "17px",

  boxShadow:
    "0 12px 30px rgba(0,0,0,0.38)",

  overflow: "hidden" as const,
};

const kpiLabelStyle = {
  color: "#8f8f8f",
  fontSize: "9px",
  fontWeight: 700,
  letterSpacing: "1.2px",
};

const kpiValueStyle = {
  margin: "9px 0 0",
  color: COLORS.orangeLight,
  fontSize: "23px",
  fontWeight: 800,
};

function KpiTopLine() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        background:
          "linear-gradient(90deg,#087F5B,#00F5A0)",
      }}
    />
  );
}

export default Analytics;