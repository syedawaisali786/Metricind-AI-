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
    if (!question.trim()) return;

    setLoading(true);
    setResponseData(null);

    try {
      const response = await fetch(
        `${API_URL}/api/query`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            question: question.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Backend returned ${response.status}`
        );
      }

      const data: QueryResponse =
        await response.json();
        console.log("FULL API RESPONSE:", data);
console.log("DRILL DOWN:", data?.drillDown);
console.log("SHIPPING:", data?.drillDown?.shippingCost);
console.log("MATERIAL:", data?.drillDown?.materialCost);

      setResponseData(data);

    } catch (error) {
      console.error(error);

      setResponseData({
        interpretation:
          "Backend Connection Error",

        message:
          "Unable to connect to MetricMind backend. Make sure the backend is running on port 5000.",

        governance: {
          allowed: false,
          reason:
            "Backend connection failed.",
        },
      });

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // CHART DATA
  // ============================================================

  const chartData =
    responseData?.data || [];

  // ============================================================
  // FIND X AXIS
  // ============================================================

  const getXAxisKey = () => {
    if (!chartData.length) return "";

    if ("month" in chartData[0]) {
      return "month";
    }

    if ("product" in chartData[0]) {
      return "product";
    }

    if ("country" in chartData[0]) {
      return "country";
    }

    if ("region" in chartData[0]) {
      return "region";
    }

    return Object.keys(chartData[0])[0];
  };

  const xAxisKey = getXAxisKey();

  // ============================================================
  // CHECK CHART FIELDS
  // ============================================================

  const hasRevenue =
    chartData.length > 0 &&
    "revenue" in chartData[0];

  const hasCost =
    chartData.length > 0 &&
    "cost" in chartData[0];

  const hasProfit =
    chartData.length > 0 &&
    "profit" in chartData[0];

  // ============================================================
  // FORMAT CURRENCY
  // ============================================================

  const formatCurrency = (
    value: number | null | undefined
  ) => {
    if (
      value === null ||
      value === undefined
    ) {
      return "N/A";
    }

    return `₹${Number(value).toLocaleString(
      "en-IN"
    )}`;
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #0f172a, #1e293b)",
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
          color: "#cbd5e1",
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
          if (e.key === "Enter") {
            askQuestion();
          }
        }}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "10px",
          border:
            "1px solid #475569",
          background: "#f8fafc",
          color: "#111827",
          marginTop: "15px",
          boxSizing: "border-box",
          fontSize: "15px",
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
            ? "#64748b"
            : "#2563eb",
          color: "white",
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
            background: "#334155",
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
                  color: "#94a3b8",
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
                background: "#1e293b",
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
                  "linear-gradient(135deg, #172554, #1e3a8a)",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "20px",
                border:
                  "1px solid #3b82f6",
              }}
            >

              {/* ROOT CAUSE TITLE */}

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
                  color: "#bfdbfe",
                  marginTop: "5px",
                  marginBottom: "20px",
                }}
              >
                MetricMind identified the main
                contributors to the profit result.
              </p>

              {/* ============================================== */}
              {/* DRILL-DOWN CARDS */}
              {/* ============================================== */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(210px, 1fr))",
                  gap: "15px",
                }}
              >

                {/* ========================================== */}
                {/* HIGHEST COST REGION */}
                {/* ========================================== */}

                {responseData.drillDown
                  .highestCostRegion && (
                  <div
                    style={{
                      background: "#0f172a",
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

                {/* ========================================== */}
                {/* LOWEST PROFIT REGION */}
                {/* ========================================== */}

                {responseData.drillDown
                  .lowestProfitRegion && (
                  <div
                    style={{
                      background: "#0f172a",
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

                {/* ========================================== */}
                {/* WEAKEST PRODUCT */}
                {/* ========================================== */}

                {responseData.drillDown
                  .weakestProduct && (
                  <div
                    style={{
                      background: "#0f172a",
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

              {/* ============================================== */}
              {/* STEP 4 - COST BREAKDOWN */}
              {/* ============================================== */}

              {responseData.drillDown && (
  <div
    style={{
      marginTop: "20px",
      background: "#0f172a",
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
        gridTemplateColumns: "1fr 1fr",
        gap: "14px",
      }}
    >
      {/* SHIPPING COST */}
      <div
        style={{
          background: "#1e293b",
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
          {responseData.drillDown.shippingCost != null
            ? `₹${Number(
                responseData.drillDown.shippingCost
              ).toLocaleString("en-IN")}`
            : "N/A"}
        </strong>
      </div>

      {/* MATERIAL COST */}
      <div
        style={{
          background: "#1e293b",
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
          MATERIAL COST
        </div>

        <strong
          style={{
            fontSize: "18px",
            color: "#ef4444",
          }}
        >
          {responseData.drillDown.materialCost != null
            ? `₹${Number(
                responseData.drillDown.materialCost
              ).toLocaleString("en-IN")}`
            : "N/A"}
        </strong>
      </div>
    </div>
  </div>
)}
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

              {/* METRIC */}

              <div
                style={{
                  background: "#0f172a",
                  padding: "15px",
                  borderRadius: "10px",
                  minWidth: "180px",
                }}
              >
                <div
                  style={{
                    color: "#94a3b8",
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

              {/* ================================================== */}
          {/* VALUE */}
          {/* ================================================== */}

          {responseData.value !== undefined && (
            <div
              style={{
                background: "#0f172a",
                padding: "15px",
                borderRadius: "10px",
                minWidth: "180px",
              }}
            >
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "13px",
                }}
              >
                VALUE
              </div>

              <strong
                style={{
                  fontSize: "18px",
                }}
              >
                {formatCurrency(responseData.value)}
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
            marginBottom: "15px",
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🎯 Applied Filters
          </summary>

          <pre
            style={{
              background: "#0f172a",
              padding: "12px",
              borderRadius: "8px",
              overflowX: "auto",
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
      {/* AGENT EXECUTION STEPS */}
      {/* ====================================================== */}

      {responseData?.agentSteps &&
        responseData.agentSteps.length > 0 && (
          <div
            style={{
              background: "#1e293b",
              padding: "16px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            <strong>
              🧠 Agent Execution Steps
            </strong>

            <div
              style={{
                marginTop: "12px",
              }}
            >
              {responseData.agentSteps.map(
                (step, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "8px 0",
                      color: "#e2e8f0",
                    }}
                  >
                    <span
                      style={{
                        color: "#22c55e",
                        fontWeight: "bold",
                        marginRight: "8px",
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
            background: "#1e293b",
            padding: "16px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          <strong>
            🔐 Query Governance
          </strong>

          <div
            style={{
              marginTop: "12px",
              lineHeight: "1.8",
            }}
          >

            {/* QUERY STATUS */}

            <div>
              {responseData.governance.allowed ? (
                <span
                  style={{
                    color: "#22c55e",
                    fontWeight: "bold",
                  }}
                >
                  ✓ Query Approved
                </span>
              ) : (
                <span
                  style={{
                    color: "#ef4444",
                    fontWeight: "bold",
                  }}
                >
                  ✕ Query Rejected
                </span>
              )}
            </div>

            {/* REASON */}

            {responseData.governance.reason && (
              <div
                style={{
                  color: "#cbd5e1",
                  marginTop: "6px",
                }}
              >
                <strong>
                  Reason:
                </strong>{" "}
                {responseData.governance.reason}
              </div>
            )}

            {/* DETERMINISTIC */}

            {responseData.governance
              .deterministic !== undefined && (
              <div
                style={{
                  marginTop: "8px",
                  color:
                    responseData.governance
                      .deterministic
                      ? "#22c55e"
                      : "#f59e0b",
                }}
              >
                {responseData.governance
                  .deterministic
                  ? "✓ Deterministic execution"
                  : "⚠ Non-deterministic execution"}
              </div>
            )}

            {/* SQL GENERATED BY LLM */}

            {responseData.governance
              .sqlGeneratedByLLM !== undefined && (
              <div
                style={{
                  marginTop: "8px",
                  color:
                    responseData.governance
                      .sqlGeneratedByLLM
                      ? "#f59e0b"
                      : "#22c55e",
                }}
              >
                {responseData.governance
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
            marginBottom: "15px",
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            📐 Semantic Metric Definition
          </summary>

          <div
            style={{
              background: "#0f172a",
              padding: "12px",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          >
            <div>
              <strong>
                Name:
              </strong>{" "}
              {responseData.semanticMetric.name}
            </div>

            {responseData.semanticMetric
              .description && (
              <div
                style={{
                  marginTop: "8px",
                }}
              >
                <strong>
                  Description:
                </strong>{" "}
                {
                  responseData.semanticMetric
                    .description
                }
              </div>
            )}

            {responseData.semanticMetric
              .formula && (
              <div
                style={{
                  marginTop: "8px",
                }}
              >
                <strong>
                  Formula:
                </strong>{" "}
                {
                  responseData.semanticMetric
                    .formula
                }
              </div>
            )}

            {responseData.semanticMetric
              .aggregation && (
              <div
                style={{
                  marginTop: "8px",
                }}
              >
                <strong>
                  Aggregation:
                </strong>{" "}
                {
                  responseData.semanticMetric
                    .aggregation
                }
              </div>
            )}
          </div>
        </details>
      )}

      {/* ====================================================== */}
      {/* LINE CHART */}
      {/* ====================================================== */}

      {chartData.length > 0 &&
        responseData?.chartType === "line" && (
          <div
            style={{
              background: "white",
              padding: "15px",
              borderRadius: "10px",
              marginTop: "20px",
            }}
          >
            <h3
              style={{
                color: "#111827",
                textAlign: "center",
              }}
            >
              Monthly Revenue & Profit
            </h3>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <LineChart
                data={chartData}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey={xAxisKey}
                />

                <YAxis />

                <Tooltip />

                {hasRevenue && (
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    strokeWidth={3}
                  />
                )}

                {hasProfit && (
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#ef4444"
                    strokeWidth={3}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

      {/* ====================================================== */}
      {/* BAR CHART */}
      {/* ====================================================== */}

      {chartData.length > 0 &&
        responseData?.chartType === "bar" && (
          <div
            style={{
              background: "white",
              padding: "15px",
              borderRadius: "10px",
              marginTop: "20px",
            }}
          >
            <h3
              style={{
                color: "#111827",
                textAlign: "center",
              }}
            >
              Business Performance
            </h3>

            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart
                data={chartData}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey={xAxisKey}
                />

                <YAxis />

                <Tooltip />

                {hasRevenue && (
                  <Bar
                    dataKey="revenue"
                    fill="#2563eb"
                  />
                )}

                {hasCost && (
                  <Bar
                    dataKey="cost"
                    fill="#f59e0b"
                  />
                )}

                {hasProfit && (
                  <Bar
                    dataKey="profit"
                    fill="#22c55e"
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
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
              background: "#0f172a",
              padding: "12px",
              borderRadius: "8px",
              fontFamily: "monospace",
              overflowX: "auto",
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
              background: "#0f172a",
              padding: "12px",
              borderRadius: "8px",
              overflowX: "auto",
              whiteSpace: "pre-wrap",
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