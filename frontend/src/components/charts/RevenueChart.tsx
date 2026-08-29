import { useEffect, useId, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API_URL = "http://localhost:5000";

type RevenueChartProps = {
  country?: string;
  region?: string;
  product?: string;
  month?: string;
};

type RevenueData = {
  month: string;
  revenue: number;
  profit: number;
};

/* =========================================================
   COLORS
========================================================= */

const COLORS = {
  emerald: "#00E6A8",
  emeraldBright: "#00F5B5",
  emeraldSoft: "#00C98F",

  text: "#F5F7F6",
  textSecondary: "#A7B0AD",
  textMuted: "#69736F",

  grid: "rgba(255,255,255,0.055)",
  border: "rgba(0,230,168,0.18)",
};

/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (value: number) =>
  `₹${Math.round(value).toLocaleString("en-IN")}`;

/* =========================================================
   FORMAT MONTH
========================================================= */

function formatMonth(value: string): string {
  if (!value) {
    return "Unknown";
  }

  const match = value.match(/^(\d{4})-(\d{1,2})$/);

  if (!match) {
    return value;
  }

  const monthNumber = Number(match[2]);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return months[monthNumber - 1] || value;
}

/* =========================================================
   CUSTOM TOOLTIP
========================================================= */

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div
      style={{
        minWidth: "190px",
        padding: "14px 16px",
        background:
          "linear-gradient(145deg, #141917 0%, #090D0C 100%)",
        border: "1px solid rgba(0,230,168,0.28)",
        borderRadius: "11px",
        boxShadow:
          "0 18px 45px rgba(0,0,0,0.65), 0 0 25px rgba(0,230,168,0.06)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          color: COLORS.emeraldBright,
          fontSize: "11px",
          fontWeight: 800,
          marginBottom: "11px",
          letterSpacing: "0.03em",
        }}
      >
        {label}
      </div>

      {payload.map((item, index) => (
        <div
          key={`${item.dataKey}-${index}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
            marginTop: index === 0 ? 0 : "9px",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              color: COLORS.textSecondary,
              fontSize: "11px",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: COLORS.emerald,
                boxShadow:
                  "0 0 9px rgba(0,230,168,0.75)",
              }}
            />

            {item.name}
          </span>

          <strong
            style={{
              color: COLORS.emeraldBright,
              fontSize: "12px",
              fontWeight: 800,
            }}
          >
            {formatCurrency(Number(item.value))}
          </strong>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   REVENUE CHART
========================================================= */

function RevenueChart({
  country = "",
  region = "",
  product = "",
  month = "",
}: RevenueChartProps) {
  const [data, setData] =
    useState<RevenueData[]>([]);

  const [loading, setLoading] =
    useState(true);

  const id = useId().replace(
    /[^a-zA-Z0-9_-]/g,
    ""
  );

  const revenueGradient =
    `revenue-emerald-gradient-${id}`;

  const profitGradient =
    `profit-emerald-gradient-${id}`;

  const revenueGlow =
    `revenue-emerald-glow-${id}`;

  const profitGlow =
    `profit-emerald-glow-${id}`;

  /* =========================================================
     FETCH MONTHLY DATA
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    async function fetchMonthlyData() {
      try {
        setLoading(true);

        /* =====================================================
           BUILD QUERY PARAMETERS
        ===================================================== */

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

        const url =
          `${API_URL}/api/analytics/monthly` +
          (queryString
            ? `?${queryString}`
            : "");

        console.log(
          "📊 Revenue chart request:",
          url
        );

        const response =
          await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Unable to load monthly analytics: ${response.status}`
          );
        }

        const result =
          await response.json();

        if (cancelled) {
          return;
        }

        const monthlyData: RevenueData[] =
          (result.data || []).map(
            (item: {
              month: string;
              revenue: number;
              profit: number;
            }) => ({
              month:
                formatMonth(
                  item.month
                ),

              revenue:
                Number(
                  item.revenue || 0
                ),

              profit:
                Number(
                  item.profit || 0
                ),
            })
          );

        console.log(
          "📈 Monthly analytics:",
          monthlyData
        );

        setData(monthlyData);
      } catch (error) {
        if (!cancelled) {
          console.error(
            "❌ Failed to load monthly data:",
            error
          );

          setData([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchMonthlyData();

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
     LATEST DATA
  ========================================================= */

  const latest =
    data.length > 0
      ? data[data.length - 1]
      : {
          month: "—",
          revenue: 0,
          profit: 0,
        };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div
        className="premium-chart"
        style={{
          background:
            "linear-gradient(145deg, #111615 0%, #0A0F0D 100%)",

          border:
            "1px solid rgba(0,230,168,0.18)",

          borderRadius: "18px",

          boxShadow:
            "0 18px 55px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.025)",

          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 360,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: COLORS.textSecondary,
            fontSize: "13px",
          }}
        >
          Loading monthly business intelligence...
        </div>
      </div>
    );
  }

  /* =========================================================
     CHART
  ========================================================= */

  return (
    <div
      className="premium-chart"
      style={{
        background:
          "linear-gradient(145deg, #111615 0%, #0A0F0D 100%)",

        border:
          "1px solid rgba(0,230,168,0.18)",

        borderRadius: "18px",

        boxShadow:
          "0 18px 55px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.025)",

        overflow: "hidden",
      }}
    >
      {/* =================================================
          CHART
      ================================================= */}

      <div
        className="premium-chart-container"
        style={{
          height: 360,
          marginTop: "0px",
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart
            data={data}
            margin={{
              top: 20,
              right: 18,
              left: 5,
              bottom: 5,
            }}
          >
            <defs>

              {/* REVENUE AREA */}

              <linearGradient
                id={revenueGradient}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={COLORS.emerald}
                  stopOpacity={0.16}
                />

                <stop
                  offset="45%"
                  stopColor={COLORS.emerald}
                  stopOpacity={0.055}
                />

                <stop
                  offset="100%"
                  stopColor={COLORS.emerald}
                  stopOpacity={0}
                />
              </linearGradient>

              {/* PROFIT AREA */}

              <linearGradient
                id={profitGradient}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={COLORS.emeraldBright}
                  stopOpacity={0.09}
                />

                <stop
                  offset="50%"
                  stopColor={COLORS.emerald}
                  stopOpacity={0.035}
                />

                <stop
                  offset="100%"
                  stopColor={COLORS.emerald}
                  stopOpacity={0}
                />
              </linearGradient>

              {/* REVENUE GLOW */}

              <filter
                id={revenueGlow}
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feGaussianBlur
                  stdDeviation="5"
                  result="blur"
                />

                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* PROFIT GLOW */}

              <filter
                id={profitGlow}
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feGaussianBlur
                  stdDeviation="4"
                  result="blur"
                />

                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

            </defs>

            {/* GRID */}

            <CartesianGrid
              vertical={true}
              horizontal={true}
              stroke={COLORS.grid}
              strokeDasharray="0"
            />

            {/* X AXIS */}

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#69736F",
                fontSize: 10,
              }}
              dy={10}
            />

            {/* Y AXIS */}

            <YAxis
              axisLine={false}
              tickLine={false}
              width={55}
              tick={{
                fill: "#69736F",
                fontSize: 10,
              }}
              tickFormatter={(value) =>
                value >= 1000
                  ? `₹${value / 1000}k`
                  : `₹${value}`
              }
            />

            {/* TOOLTIP */}

            <Tooltip
              content={
                <CustomTooltip />
              }
              cursor={{
                stroke:
                  "rgba(0,230,168,0.25)",
                strokeWidth: 1,
                strokeDasharray:
                  "4 5",
              }}
            />

            {/* LEGEND */}

            <Legend
              verticalAlign="bottom"
              height={30}
              iconType="circle"
              wrapperStyle={{
                color:
                  COLORS.textSecondary,
                fontSize: "10px",
                paddingTop: "8px",
              }}
            />

            {/* REVENUE */}

            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke={COLORS.emerald}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={`url(#${revenueGradient})`}
              filter={`url(#${revenueGlow})`}
              dot={false}
              activeDot={{
                r: 5,
                fill:
                  COLORS.emeraldBright,
                stroke: "#0A0F0D",
                strokeWidth: 2,
                style: {
                  filter:
                    "drop-shadow(0 0 7px rgba(0,230,168,0.8))",
                },
              }}
              animationDuration={1000}
            />

            {/* PROFIT */}

            <Area
              type="monotone"
              dataKey="profit"
              name="Profit"
              stroke={COLORS.emeraldSoft}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={`url(#${profitGradient})`}
              filter={`url(#${profitGlow})`}
              dot={false}
              activeDot={{
                r: 4,
                fill: COLORS.emerald,
                stroke: "#0A0F0D",
                strokeWidth: 2,
                style: {
                  filter:
                    "drop-shadow(0 0 7px rgba(0,230,168,0.7))",
                },
              }}
              animationDuration={1200}
            />

          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="chart-summary">

        {/* LATEST REVENUE */}

        <div className="chart-summary-item">

          <span
            className="summary-label"
            style={{
              color: COLORS.textMuted,
            }}
          >
            LATEST REVENUE
          </span>

          <strong
            style={{
              color: COLORS.text,
            }}
          >
            {formatCurrency(
              latest.revenue
            )}
          </strong>

          <span
            className="summary-positive"
            style={{
              color: COLORS.emerald,
            }}
          >
            ● Current period
          </span>

        </div>

        {/* DIVIDER */}

        <div
          className="chart-summary-divider"
          style={{
            background:
              "rgba(255,255,255,0.07)",
          }}
        />

        {/* LATEST PROFIT */}

        <div className="chart-summary-item">

          <span
            className="summary-label"
            style={{
              color: COLORS.textMuted,
            }}
          >
            LATEST PROFIT
          </span>

          <strong
            style={{
              color: COLORS.text,
            }}
          >
            {formatCurrency(
              latest.profit
            )}
          </strong>

          <span
            className="summary-positive"
            style={{
              color: COLORS.emerald,
            }}
          >
            ● Current period
          </span>

        </div>

      </div>
    </div>
  );
}

export default RevenueChart;