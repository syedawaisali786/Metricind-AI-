import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useId } from "react";

type ChartItem = {
  [key: string]: string | number;
};

type BarConfig = {
  key: string;
  name: string;
  gradient?: string;
};

type PremiumBarChartProps = {
  data: ChartItem[];
  xKey: string;
  bars: BarConfig[];
  title: string;
  subtitle?: string;
  height?: number;
  currency?: boolean;
};

type TooltipProps = {
  active?: boolean;
  payload?: Array<{
    dataKey?: string;
    value?: string | number;
    name?: string;
  }>;
  label?: string | number;
};

function formatNumber(
  value: number,
  currency: boolean
): string {
  return currency
    ? `₹${value.toLocaleString("en-IN")}`
    : value.toLocaleString("en-IN");
}

function PremiumTooltip({
  active,
  payload,
  label,
  currency = false,
}: TooltipProps & { currency?: boolean }) {
  if (
    !active ||
    !payload ||
    payload.length === 0
  ) {
    return null;
  }

  return (
    <div
      style={{
        background: "#0b1220",
        border: "1px solid rgba(96, 165, 250, 0.35)",
        borderRadius: "12px",
        padding: "14px 16px",
        minWidth: "180px",
        boxShadow:
          "0 15px 35px rgba(0, 0, 0, 0.35)",
      }}
    >
      <div
        style={{
          color: "#94a3b8",
          fontSize: "12px",
          fontWeight: 600,
          marginBottom: "10px",
        }}
      >
        {String(label ?? "")}
      </div>

      {payload.map((item, index) => {
        const value = Number(item.value ?? 0);

        return (
          <div
            key={`${item.dataKey ?? "value"}-${index}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "24px",
              marginTop:
                index === 0 ? 0 : "8px",
            }}
          >
            <span
              style={{
                color: "#cbd5e1",
                fontSize: "13px",
              }}
            >
              {item.name ?? item.dataKey}
            </span>

            <strong
              style={{
                color: "#ffffff",
                fontSize: "13px",
              }}
            >
              {formatNumber(value, currency)}
            </strong>
          </div>
        );
      })}
    </div>
  );
}

function PremiumBarChart({
  data,
  xKey,
  bars,
  title,
  subtitle,
  height = 360,
  currency = false,
}: PremiumBarChartProps) {
  /*
    IMPORTANT:
    Every chart gets its own unique SVG ID.
    This prevents gradient ID collisions when
    multiple charts exist on the same page.
  */
  const uniqueId = useId().replace(
    /[^a-zA-Z0-9_-]/g,
    ""
  );

  const getGradientId = (
    index: number
  ) => `premium-gradient-${uniqueId}-${index}`;

  return (
    <div
      style={{
        width: "100%",
        background:
          "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
        border:
          "1px solid rgba(226, 232, 240, 0.9)",
        borderRadius: "20px",
        padding: "24px",
        boxSizing: "border-box",
        boxShadow:
          "0 12px 35px rgba(15, 23, 42, 0.10)",
        overflow: "hidden",
      }}
    >
      {/* ================= HEADER ================= */}

      <div
        style={{
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "15px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "#0f172a",
                fontSize: "21px",
                fontWeight: 750,
                letterSpacing: "-0.4px",
              }}
            >
              {title}
            </h2>

            {subtitle && (
              <p
                style={{
                  margin:
                    "6px 0 0",
                  color: "#64748b",
                  fontSize: "13px",
                  lineHeight: 1.5,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          <div
            style={{
              background:
                "rgba(37, 99, 235, 0.08)",
              color: "#2563eb",
              border:
                "1px solid rgba(37, 99, 235, 0.15)",
              borderRadius: "999px",
              padding:
                "6px 10px",
              fontSize: "11px",
              fontWeight: 700,
              whiteSpace:
                "nowrap",
            }}
          >
            Analytics
          </div>
        </div>
      </div>

      {/* ================= CHART ================= */}

      <div
        style={{
          width: "100%",
          height,
          minWidth: 0,
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={data}
            margin={{
              top: 25,
              right: 18,
              left: 8,
              bottom: 8,
            }}
            barCategoryGap={
              bars.length > 1
                ? "24%"
                : "35%"
            }
            barGap={8}
          >
            {/* ================= UNIQUE GRADIENTS ================= */}

            <defs>
              {bars.map(
                (_bar, index) => (
                  <linearGradient
                    key={getGradientId(index)}
                    id={getGradientId(index)}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={
                        index === 0
                          ? "#38bdf8"
                          : "#6366f1"
                      }
                    />

                    <stop
                      offset="100%"
                      stopColor={
                        index === 0
                          ? "#2563eb"
                          : "#4338ca"
                      }
                    />
                  </linearGradient>
                )
              )}
            </defs>

            {/* ================= GRID ================= */}

            <CartesianGrid
              stroke="#e2e8f0"
              strokeDasharray="3 6"
              vertical={false}
              horizontal={true}
            />

            {/* ================= X AXIS ================= */}

            <XAxis
              dataKey={xKey}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#64748b",
                fontSize: 12,
                fontWeight: 600,
              }}
              dy={10}
            />

            {/* ================= Y AXIS ================= */}

            <YAxis
              axisLine={false}
              tickLine={false}
              width={72}
              tick={{
                fill: "#94a3b8",
                fontSize: 11,
              }}
              tickFormatter={(
                value: number
              ) =>
                currency
                  ? `₹${value.toLocaleString(
                      "en-IN"
                    )}`
                  : value.toLocaleString(
                      "en-IN"
                    )
              }
            />

            {/* ================= TOOLTIP ================= */}

            <Tooltip
              cursor={{
                fill: "rgba(37, 99, 235, 0.04)",
              }}
              content={
                <PremiumTooltip
                  currency={currency}
                />
              }
            />

            {/* ================= LEGEND ================= */}

            {bars.length > 1 && (
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{
                  paddingBottom:
                    "12px",
                  fontSize: "12px",
                  color: "#64748b",
                  fontWeight: 600,
                }}
              />
            )}

            {/* ================= BARS ================= */}

            {bars.map(
              (bar, index) => (
                <Bar
                  key={bar.key}
                  dataKey={bar.key}
                  name={bar.name}
                  fill={`url(#${getGradientId(
                    index
                  )})`}
                  radius={[
                    8,
                    8,
                    2,
                    2,
                  ]}
                  maxBarSize={
                    bars.length > 1
                      ? 42
                      : 70
                  }
                  animationDuration={
                    700
                  }
                  animationEasing="ease-out"
                />
              )
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PremiumBarChart;