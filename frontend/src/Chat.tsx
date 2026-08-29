import { useState } from "react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const API_URL = "http://localhost:5000";

// ============================================================
// TYPES
// ============================================================

type Governance = {
  allowed?: boolean;
  reason?: string;
  deterministic?: boolean;
  sqlGeneratedByLLM?: boolean;
};

type DrillDown = {
  highestCostRegion?: string | null;
  highestCostValue?: number | null;

  lowestProfitRegion?: string | null;
  lowestProfitValue?: number | null;

  weakestProduct?: string | null;
  weakestProductProfit?: number | null;

  shippingCost?: number | null;
  materialCost?: number | null;
};

type QueryResponse = {
  question?: string;
  interpretation?: string;
  agentSteps?: string[];

  metric?: string;
  value?: number;
  message?: string;

  data?: Record<string, unknown>[];

  chartType?: "line" | "bar" | "card";

  apiCall?: string;
  sql?: string;

  filters?: Record<string, unknown>;

  semanticMetric?: {
    name?: string;
    formula?: string;
    description?: string;
    aggregation?: string;
  };

  governance?: Governance;

  drillDown?: DrillDown;
};

// ============================================================
// CHAT COMPONENT
// ============================================================

function Chat() {
  const [question, setQuestion] = useState("");
  const [responseData, setResponseData] =
    useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // ==========================================================
  // ASK QUESTION
  // ==========================================================

  const askQuestion = async () => {
    if (!question.trim() || loading) return;

    setLoading(true);
    setResponseData(null);

    try {
      const response = await fetch(`${API_URL}/api/query`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          question: question.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Backend returned ${response.status}`
        );
      }

      const data: QueryResponse =
        await response.json();

      console.log("FULL API RESPONSE:", data);
      console.log("CHART TYPE:", data.chartType);
      console.log("CHART DATA:", data.data);
      console.log("DRILL DOWN:", data.drillDown);

      setResponseData(data);
    } catch (error) {
      console.error("MetricMind error:", error);

      setResponseData({
        interpretation: "Backend Connection Error",

        message:
          "Unable to connect to MetricMind backend. Make sure the backend is running on port 5000.",

        governance: {
          allowed: false,
          reason: "Backend connection failed.",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // CHART DATA
  // ==========================================================

  const chartData: Record<string, unknown>[] =
    Array.isArray(responseData?.data)
      ? responseData.data
      : [];

  // ==========================================================
  // FIND X AXIS
  // ==========================================================

  const getXAxisKey = () => {
    if (!chartData.length) return "";

    const firstRow = chartData[0];

    if ("month" in firstRow) return "month";
    if ("product" in firstRow) return "product";
    if ("country" in firstRow) return "country";
    if ("region" in firstRow) return "region";

    const possibleKeys = Object.keys(firstRow);

    return possibleKeys.length > 0
      ? possibleKeys[0]
      : "";
  };

  const xAxisKey = getXAxisKey();

  // ==========================================================
  // CHECK CHART FIELDS
  // ==========================================================

  const hasRevenue =
    chartData.length > 0 &&
    chartData.some(
      (item) =>
        typeof item.revenue === "number"
    );

  const hasCost =
    chartData.length > 0 &&
    chartData.some(
      (item) =>
        typeof item.cost === "number"
    );

  const hasProfit =
    chartData.length > 0 &&
    chartData.some(
      (item) =>
        typeof item.profit === "number"
    );
    const hasShippingCost =
  chartData.length > 0 &&
  chartData.some(
    (item) =>
      typeof item.shippingCost === "number"
  );

const hasMaterialCost =
  chartData.length > 0 &&
  chartData.some(
    (item) =>
      typeof item.materialCost === "number"
  );

  // ==========================================================
  // FORMAT CURRENCY
  // ==========================================================

  const formatCurrency = (
    value: number | null | undefined
  ) => {
    if (
      value === null ||
      value === undefined ||
      Number.isNaN(Number(value))
    ) {
      return "N/A";
    }

    return `₹${Number(value).toLocaleString(
      "en-IN"
    )}`;
  };

  // ==========================================================
  // SAFE NUMBER FORMATTER
  // ==========================================================

  const formatChartValue = (
    value: number
  ) => {
    if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }

    if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }

    return value.toLocaleString("en-IN");
  };

  // ==========================================================
  // CHART KEY
  // ==========================================================

  const chartKey = [
    responseData?.chartType ?? "none",
    xAxisKey,
    chartData.length,
    chartData
      .map((item) =>
        String(item[xAxisKey] ?? "")
      )
      .join("-"),
  ].join("|");

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #080B0A, #111614)",
        padding: "25px",
        borderRadius: "16px",
        marginTop: "25px",
        color: "white",
        boxShadow:
          "0 10px 30px rgba(0,0,0,0.25)",
      }}
    >
      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <h2
        style={{
          marginBottom: "5px",
        }}
      >
        🤖 MetricMind AI
      </h2>

      <p
        style={{
          color: "#8F9B96",
        }}
      >
        Ask questions about your business data.
      </p>

      {/* ====================================================== */}
      {/* QUESTION INPUT */}
      {/* ====================================================== */}

      <input
        type="text"
        placeholder="Ask a business question..."
        value={question}
        onChange={(e) =>
          setQuestion(e.target.value)
        }
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            !loading
          ) {
            askQuestion();
          }
        }}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "10px",
          border:
            "1px solid rgba(0,230,168,0.35)",
          background: "#0B100E",
          color: "#F5F7F6",
          marginTop: "15px",
          boxSizing: "border-box",
          fontSize: "15px",
          outline: "none",
        }}
      />

      {/* ====================================================== */}
      {/* ASK BUTTON */}
      {/* ====================================================== */}

      <button
        onClick={askQuestion}
        disabled={loading}
        style={{
          marginTop: "15px",
          padding: "11px 24px",
          background: loading
            ? "#37423E"
            : "#00E6A8",
          color: "#03100B",
          border: "none",
          borderRadius: "9px",
          cursor: loading
            ? "not-allowed"
            : "pointer",
          fontWeight: "bold",
        }}
      >
        {loading
          ? "Thinking..."
          : "Ask AI"}
      </button>

      {/* ====================================================== */}
      {/* RESPONSE */}
      {/* ====================================================== */}

      {responseData && (
        <div
          style={{
            marginTop: "25px",
            background: "#0B100E",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          {/* ================================================== */}
          {/* INTERPRETATION */}
          {/* ================================================== */}

          {responseData.interpretation && (
            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "#3a5548",
                  marginBottom: "5px",
                }}
              >
                INTERPRETATION
              </div>

              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                🧠 {responseData.interpretation}
              </div>
            </div>
          )}

          {/* ================================================== */}
          {/* AI ANSWER */}
          {/* ================================================== */}

          {responseData.message && (
            <div
              style={{
                background: "#0B100E",
                padding: "16px",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            >
              <strong
                style={{
                  fontSize: "16px",
                }}
              >
                🤖 AI Answer
              </strong>

              <p
                style={{
                  lineHeight: "1.6",
                  color: "#e2e8f0",
                }}
              >
                {responseData.message}
              </p>
            </div>
          )}

          {/* ================================================== */}
          {/* ROOT CAUSE DRILL-DOWN */}
          {/* ================================================== */}

          {responseData.drillDown && (
            <div
              style={{
                background:
                  "linear-gradient(135deg, #0B1712, #10241B)",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "20px",
                border:
                  "1px solid rgba(0,230,168,0.30)",
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
              >
                🔎 Root Cause Drill-Down
              </div>

              <p
                style={{
                  color: "#9BAFA7",
                  marginTop: "5px",
                  marginBottom: "20px",
                }}
              >
                MetricMind identified the main
                contributors to the profit result.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(210px, 1fr))",
                  gap: "15px",
                }}
              >
                {/* HIGHEST COST REGION */}

                {responseData.drillDown
                  .highestCostRegion && (
                  <div
                    style={{
                      background: "#080D0B",
                      padding: "16px",
                      borderRadius: "10px",
                    }}
                  >
                    <div
                      style={{
                        color: "#94a3b8",
                        fontSize: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      HIGHEST COST REGION
                    </div>

                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      {
                        responseData.drillDown
                          .highestCostRegion
                      }
                    </div>

                    <div
                      style={{
                        color: "#f59e0b",
                        marginTop: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      {formatCurrency(
                        responseData.drillDown
                          .highestCostValue
                      )}
                    </div>
                  </div>
                )}

                {/* LOWEST PROFIT REGION */}

                {responseData.drillDown
                  .lowestProfitRegion && (
                  <div
                    style={{
                      background: "#080D0B",
                      padding: "16px",
                      borderRadius: "10px",
                    }}
                  >
                    <div
                      style={{
                        color: "#94a3b8",
                        fontSize: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      LOWEST PROFIT REGION
                    </div>

                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      {
                        responseData.drillDown
                          .lowestProfitRegion
                      }
                    </div>

                    <div
                      style={{
                        color: "#ef4444",
                        marginTop: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      {formatCurrency(
                        responseData.drillDown
                          .lowestProfitValue
                      )}
                    </div>
                  </div>
                )}

                {/* WEAKEST PRODUCT */}

                {responseData.drillDown
                  .weakestProduct && (
                  <div
                    style={{
                      background: "#0D1210",
                      padding: "16px",
                      borderRadius: "10px",
                    }}
                  >
                    <div
                      style={{
                        color: "#94a3b8",
                        fontSize: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      WEAKEST PRODUCT
                    </div>

                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      {
                        responseData.drillDown
                          .weakestProduct
                      }
                    </div>

                    <div
                      style={{
                        color: "#ef4444",
                        marginTop: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      {formatCurrency(
                        responseData.drillDown
                          .weakestProductProfit
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* COST BREAKDOWN */}

              <div
                style={{
                  marginTop: "20px",
                  background: "#0D1210",
                  padding: "18px",
                  borderRadius: "10px",
                }}
              >
                <h3
                  style={{
                    color: "#ffffff",
                    marginBottom: "14px",
                  }}
                >
                  💰 Cost Breakdown
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(2, minmax(0, 1fr))",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      background: "#0D1210",
                      padding: "14px",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        color: "#94a3b8",
                        fontSize: "12px",
                        marginBottom: "6px",
                      }}
                    >
                      SHIPPING COST
                    </div>

                    <strong
                      style={{
                        fontSize: "18px",
                        color: "#f59e0b",
                      }}
                    >
                      {responseData.drillDown
                        .shippingCost != null
                        ? formatCurrency(
                            responseData.drillDown
                              .shippingCost
                          )
                        : "N/A"}
                    </strong>
                  </div>

                  <div
                    style={{
                      background: "#0d171413",
                      padding: "14px",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        color: "#9eaabc",
                        fontSize: "12px",
                        marginBottom: "6px",
                      }}
                    >
                      MATERIAL COST
                    </div>

                    <strong
                      style={{
                        fontSize: "18px",
                        color: "#00E6A8",
                      }}
                    >
                      {responseData.drillDown
                        .materialCost != null
                        ? formatCurrency(
                            responseData.drillDown
                              .materialCost
                          )
                        : "N/A"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================== */}
          {/* METRIC CARD */}
          {/* ================================================== */}

          {responseData.metric && (
            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                marginBottom: "20px",
              }}
            >
              <div
               style={{
  background: "#111614",
  padding: "15px",
  borderRadius: "10px",
  minWidth: "180px",
  border: "1px solid rgba(0, 230, 168, 0.25)",
  boxShadow: "0 0 18px rgba(0, 230, 168, 0.08)",
}}
              >
                <div
                  style={{
                    color: "#111614",
                    fontSize: "13px",
                  }}
                >
                  METRIC
                </div>

                <strong
                  style={{
                    fontSize: "18px",
                  }}
                >
                  {responseData.metric}
                </strong>
              </div>

              {responseData.value !==
                undefined && (
                <div
                  style={{
  background: "#111614",
  padding: "15px",
  borderRadius: "10px",
  minWidth: "180px",
  border: "1px solid rgba(0, 230, 168, 0.25)",
  boxShadow: "0 0 18px rgba(0, 230, 168, 0.08)",
}}
                >
                  <div
                    style={{
                      color:
                        "#111614",

                      fontSize:
                        "13px",
                    }}
                  >
                    VALUE
                  </div>

                  <strong
                    style={{
                      fontSize:
                        "18px",
                    }}
                  >
                    {formatCurrency(
                      responseData.value
                    )}
                  </strong>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ====================================================== */}
      {/* FILTERS */}
      {/* ====================================================== */}

      {responseData?.filters && (
        <details
          style={{
            marginBottom:
              "15px",
          }}
        >
          <summary
            style={{
              cursor:
                "pointer",

              fontWeight:
                "bold",
            }}
          >
            🎯 Applied Filters
          </summary>

          <pre
            style={{
              background:
                "#111614",

              padding:
                "12px",

              borderRadius:
                "8px",

              overflowX:
                "auto",
            }}
          >
            {JSON.stringify(
              responseData.filters,
              null,
              2
            )}
          </pre>
        </details>
      )}

      {/* ====================================================== */}
      {/* AGENT STEPS */}
      {/* ====================================================== */}

      {responseData?.agentSteps &&
        responseData.agentSteps
          .length > 0 && (
          <div
            style={{
              background:
                "#083523",

              padding:
                "16px",

              borderRadius:
                "10px",

              marginBottom:
                "20px",
            }}
          >
            <strong>
              🧠 Agent Execution
              Steps
            </strong>

            <div
              style={{
                marginTop:
                  "12px",
              }}
            >
              {responseData.agentSteps.map(
                (
                  step,
                  index
                ) => (
                  <div
                    key={`${step}-${index}`}
                    style={{
                      padding:
                        "8px 0",

                      color:
                        "#e2e8f0",
                    }}
                  >
                    <span
                      style={{
                        color:
                          "#22c55e",

                        fontWeight:
                          "bold",

                        marginRight:
                          "8px",
                      }}
                    >
                      ✓
                    </span>

                    {step}
                  </div>
                )
              )}
            </div>
          </div>
        )}

      {/* ====================================================== */}
      {/* GOVERNANCE */}
      {/* ====================================================== */}

      {responseData?.governance && (
        <div
          style={{
            background:
              "#0c0e0d",

            padding:
              "16px",

            borderRadius:
              "10px",

            marginBottom:
              "20px",
          }}
        >
          <strong>
            🔐 Query Governance
          </strong>

          <div
            style={{
              marginTop:
                "12px",

              lineHeight:
                "1.8",
            }}
          >
            <div>
              {responseData
                .governance
                .allowed ? (
                <span
                  style={{
                    color:
                      "#22c55e",

                    fontWeight:
                      "bold",
                  }}
                >
                  ✓ Query Approved
                </span>
              ) : (
                <span
                  style={{
                    color:
                      "#ef4444",

                    fontWeight:
                      "bold",
                  }}
                >
                  ✕ Query Rejected
                </span>
              )}
            </div>

            {responseData
              .governance
              .reason && (
              <div
                style={{
                  color:
                    "#a8d7d7",

                  marginTop:
                    "6px",
                }}
              >
                <strong>
                  Reason:
                </strong>{" "}
                {
                  responseData
                    .governance
                    .reason
                }
              </div>
            )}

            {responseData
              .governance
              .deterministic !==
              undefined && (
              <div
                style={{
                  marginTop:
                    "8px",

                  color:
                    responseData
                      .governance
                      .deterministic
                      ? "#22c55e"
                      : "#f59e0b",
                }}
              >
                {responseData
                  .governance
                  .deterministic
                  ? "✓ Deterministic execution"
                  : "⚠ Non-deterministic execution"}
              </div>
            )}

            {responseData
              .governance
              .sqlGeneratedByLLM !==
              undefined && (
              <div
                style={{
                  marginTop:
                    "8px",

                  color:
                    responseData
                      .governance
                      .sqlGeneratedByLLM
                      ? "#f59e0b"
                      : "#22c55e",
                }}
              >
                {responseData
                  .governance
                  .sqlGeneratedByLLM
                  ? "⚠ SQL generated by LLM"
                  : "✓ SQL not generated by LLM"}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================== */}
      {/* SEMANTIC METRIC */}
      {/* ====================================================== */}

      {responseData?.semanticMetric && (
        <details
          style={{
            marginBottom:
              "15px",
          }}
        >
          <summary
            style={{
              cursor:
                "pointer",

              fontWeight:
                "bold",
            }}
          >
            📐 Semantic Metric
            Definition
          </summary>

          <div
            style={{
              background:
                "#0D1210",

              padding:
                "12px",

              borderRadius:
                "8px",

              marginTop:
                "10px",
            }}
          >
            <div>
              <strong>
                Name:
              </strong>{" "}
              {
                responseData
                  .semanticMetric
                  .name
              }
            </div>

            {responseData
              .semanticMetric
              .description && (
              <div
                style={{
                  marginTop:
                    "8px",
                }}
              >
                <strong>
                  Description:
                </strong>{" "}
                {
                  responseData
                    .semanticMetric
                    .description
                }
              </div>
            )}

            {responseData
              .semanticMetric
              .formula && (
              <div
                style={{
                  marginTop:
                    "8px",
                }}
              >
                <strong>
                  Formula:
                </strong>{" "}
                {
                  responseData
                    .semanticMetric
                    .formula
                }
              </div>
            )}

            {responseData
              .semanticMetric
              .aggregation && (
              <div
                style={{
                  marginTop:
                    "8px",
                }}
              >
                <strong>
                  Aggregation:
                </strong>{" "}
                {
                  responseData
                    .semanticMetric
                    .aggregation
                }
              </div>
            )}
          </div>
        </details>
      )}
      {/* ====================================================== */}
      {/* AI GENERATED CHARTS */}
      {/* ====================================================== */}

      {chartData.length > 0 &&
        (responseData?.chartType === "line" ||
          responseData?.chartType === "bar") && (
          <div
            style={{
              marginTop: "24px",
              background: "#0D1210",
              borderRadius: "16px",
              padding: "24px",
              width: "100%",
              boxSizing: "border-box",
              overflow: "hidden",
              border: "1px solid rgba(0,230,168,0.18)",
              boxShadow:
                "0 10px 30px rgba(0,230,168,0.08)",
            }}
          >
            {/* CHART HEADER */}

            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  color: "#00E6A8",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: "5px",
                }}
              >
                AI ANALYSIS
              </div>

              <h3
                style={{
                  margin: 0,
                  color: "#F5F7F6",
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                {responseData.chartType === "bar"
                  ? "Business Performance"
                  : "Business Trend"}
              </h3>

              <p
                style={{
                  margin: "5px 0 0",
                  color: "#7F8C87",
                  fontSize: "13px",
                }}
              >
                Visual representation of the
                requested business data.
              </p>
            </div>

            {/* CHART CONTAINER */}

            <div
              style={{
                width: "100%",
                height: "360px",
                minWidth: 0,
                position: "relative",
              }}
            >
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                {responseData.chartType === "line" ? (
                  <LineChart
                    key={`ai-line-${chartKey}`}
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 25,
                      left: 10,
                      bottom: 20,
                    }}
                  >
                    <CartesianGrid
                      horizontal={true}
                      vertical={false}
                      stroke="rgba(255, 255, 255, 0.07)"
                      strokeDasharray="4 6"
                    />

                    <XAxis
                      dataKey={xAxisKey}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#F5F7F6",
                        fontSize: 12,
                      }}
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      width={65}
                      tick={{
                        fill: "#7F8C87",
                        fontSize: 11,
                      }}
                      tickFormatter={
                        formatChartValue
                      }
                    />

                    <Tooltip
                      contentStyle={{
                        background: "#080D0B",
                        border:
                          "1px solid rgba(0,230,168,0.25)",
                        borderRadius: "10px",
                        color: "#ffffff",
                        boxShadow:
                          "0 10px 25px rgba(0,0,0,0.2)",
                      }}
                      formatter={(value) =>
                        formatCurrency(
                          Number(value)
                        )
                      }
                    />

                    {(hasRevenue ||
                      hasProfit) && (
                      <Legend
                        wrapperStyle={{
                          paddingTop: "10px",
                          fontSize: "12px",
                        }}
                      />
                    )}

                    {hasRevenue && (
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
                        stroke="#00E6A8"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          fill: "#00E6A8",
                          strokeWidth: 0,
                        }}
                        activeDot={{
                          r: 6,
                        }}
                        isAnimationActive={false}
                        connectNulls
                      />
                    )}

                    {hasProfit && (
                      <Line
                        type="monotone"
                        dataKey="profit"
                        name="Profit"
                        stroke="#00E6A8"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          fill: "#00E6A8",
                          strokeWidth: 0,
                        }}
                        activeDot={{
                          r: 6,
                        }}
                        isAnimationActive={false}
                        connectNulls
                      />
                    )}
                  </LineChart>
                ) : (
                  <BarChart
                    key={`ai-bar-${chartKey}`}
                    data={chartData}
                    margin={{
                      top: 20,
                      right: 25,
                      left: 10,
                      bottom: 20,
                    }}
                    barCategoryGap="28%"
                    barGap={8}
                  >
                    <CartesianGrid
                      horizontal={true}
                      vertical={false}
                      stroke="rgba(255, 255, 255, 0.07)"
                      strokeDasharray="4 6"
                    />

                    <XAxis
                      dataKey={xAxisKey}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#F5F7F6",
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                      dy={8}
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      width={65}
                      tick={{
                        fill: "#7F8C87",
                        fontSize: 11,
                      }}
                      tickFormatter={
                        formatChartValue
                      }
                    />

                    <Tooltip
                      cursor={{
                        fill:
                          "rgba(0,230,168,0.05)",
                      }}
                      contentStyle={{
                        background: "#080D0B",
                        border:
                          "1px solid rgba(0,230,168,0.25)",
                        borderRadius: "10px",
                        color: "#ffffff",
                        boxShadow:
                          "0 10px 25px rgba(0,0,0,0.2)",
                      }}
                      formatter={(value) =>
                        formatCurrency(
                          Number(value)
                        )
                      }
                    />

                    <Legend
                      wrapperStyle={{
                        paddingTop: "10px",
                        fontSize: "12px",
                      }}
                    />

                    {hasRevenue && (
                      <Bar
                        dataKey="revenue"
                        name="Revenue"
                        fill="#00E6A8"
                        radius={[
                          8,
                          8,
                          2,
                          2,
                        ]}
                        maxBarSize={55}
                        isAnimationActive={false}
                      />
                    )}

                    {hasCost && (
                      <Bar
                        dataKey="cost"
                        name="Cost"
                        fill="#f59e0b"
                        radius={[
                          8,
                          8,
                          2,
                          2,
                        ]}
                        maxBarSize={55}
                        isAnimationActive={false}
                      />
                    )}

                    {hasShippingCost && (
  <Bar
    dataKey="shippingCost"
    name="Shipping Cost"
    fill="#22c55e"
    radius={[
      8,
      8,
      2,
      2,
    ]}
    maxBarSize={55}
    isAnimationActive={false}
  />
)}

{hasMaterialCost && (
  <Bar
    dataKey="materialCost"
    name="Material Cost"
    fill="#00E6A8"
    radius={[
      8,
      8,
      2,
      2,
    ]}
    maxBarSize={55}
    isAnimationActive={false}
  />
)}


                    {hasProfit && (
                      <Bar
                        dataKey="profit"
                        name="Profit"
                        fill="#00E6A8"
                        radius={[
                          8,
                          8,
                          2,
                          2,
                        ]}
                        maxBarSize={55}
                        isAnimationActive={false}
                      />
                    )}
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        )}

      {/* ====================================================== */}
      {/* API CALL */}
      {/* ====================================================== */}

      {responseData?.apiCall && (
        <details
          style={{
            marginTop: "20px",
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🔌 View API Call
          </summary>

          <div
            style={{
              marginTop: "10px",
              background: "#080D0B",
              padding: "12px",
              borderRadius: "8px",
              fontFamily: "monospace",
              overflowX: "auto",
              color: "#e2e8f0",
            }}
          >
            {responseData.apiCall}
          </div>
        </details>
      )}

      {/* ====================================================== */}
      {/* SQL */}
      {/* ====================================================== */}

      {responseData?.sql && (
        <details
          style={{
            marginTop: "10px",
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🗄️ View Generated SQL
          </summary>

          <pre
            style={{
              marginTop: "10px",
              background: "#080D0B",
              padding: "12px",
              borderRadius: "8px",
              overflowX: "auto",
              whiteSpace: "pre-wrap",
              color: "#e2e8f0",
            }}
          >
            <code>
              {responseData.sql}
            </code>
          </pre>
        </details>
      )}

    </div>
  );
}

export default Chat;