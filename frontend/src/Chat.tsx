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

type QueryResponse = {
  metric?: string;
  value?: number;
  message?: string;
  data?: Record<string, unknown>[];
  apiCall?: string;
  sql?: string;
  chartType?: "line" | "bar";
};

function Chat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [apiCall, setApiCall] = useState("");
  const [sql, setSql] = useState("");
  const [chartData, setChartData] = useState<
    Record<string, unknown>[]
  >([]);
  const [chartType, setChartType] = useState<
    "line" | "bar" | ""
  >("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");
    setApiCall("");
    setSql("");
    setChartData([]);
    setChartType("");

    try {
      const response = await fetch(`${API_URL}/api/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
        }),
      });

      const data: QueryResponse = await response.json();

      // ============================================================
      // HANDLE BACKEND RESPONSE
      // ============================================================

      if (!response.ok) {
        setAnswer(
          data.message || "Query was not understood."
        );
      } else if (data.message) {
        // Detailed AI explanation
        setAnswer(data.message);

        // Display chart if backend returned chart data
        if (Array.isArray(data.data)) {
          setChartData(data.data);
          setChartType(data.chartType || "");
        }
      } else if (data.value !== undefined) {
        // Simple metric response
        setAnswer(
          `${data.metric || "Result"}: ${data.value}`
        );
      } else if (Array.isArray(data.data)) {
        // Analytics response
        setAnswer(
          data.chartType
            ? "Here is the requested business analysis:"
            : JSON.stringify(data.data, null, 2)
        );

        setChartData(data.data);
        setChartType(data.chartType || "");
      } else {
        setAnswer(
          JSON.stringify(data, null, 2)
        );
      }

      // API CALL
      setApiCall(data.apiCall || "");

      // SQL
      setSql(data.sql || "");
    } catch (error) {
      console.error(error);

      setAnswer(
        "Unable to connect to MetricMind backend. Make sure the backend is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FIND X-AXIS
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
  // UI
  // ============================================================

  return (
    <div
      style={{
        background: "#1e293b",
        padding: "25px",
        borderRadius: "12px",
        marginTop: "25px",
        color: "white",
      }}
    >
      <h2>🤖 MetricMind AI Chat</h2>

      <p>
        Ask questions about your business data.
      </p>

      {/* QUESTION INPUT */}

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
          padding: "12px",
          borderRadius: "8px",
          border: "none",
          marginTop: "10px",
          boxSizing: "border-box",
        }}
      />

      {/* ASK BUTTON */}

      <button
        onClick={askQuestion}
        disabled={loading}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {/* ANSWER */}

      {answer && (
        <div
          style={{
            marginTop: "20px",
            background: "#334155",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          <strong>AI:</strong>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: "Arial, sans-serif",
              marginTop: "10px",
            }}
          >
            {answer}
          </pre>

          {/* ================================================== */}
          {/* LINE CHART */}
          {/* ================================================== */}

          {chartData.length > 0 &&
            chartType === "line" && (
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
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                      dataKey={xAxisKey}
                    />

                    <YAxis />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2563eb"
                      strokeWidth={3}
                    />

                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="#ef4444"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

          {/* ================================================== */}
          {/* BAR CHART */}
          {/* ================================================== */}

          {chartData.length > 0 &&
            chartType === "bar" && (
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
                  {question
                    .toLowerCase()
                    .includes("region")
                    ? "Regional Performance"
                    : question
                        .toLowerCase()
                        .includes("country")
                    ? "Country Performance"
                    : question
                        .toLowerCase()
                        .includes("product")
                    ? "Product Performance"
                    : "Business Performance"}
                </h3>

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                      dataKey={xAxisKey}
                    />

                    <YAxis />

                    <Tooltip />

                    <Bar
                      dataKey="profit"
                      fill="#2563eb"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

          {/* ================================================== */}
          {/* API CALL */}
          {/* ================================================== */}

          {apiCall && (
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
                🔍 View API Call
              </summary>

              <div
                style={{
                  marginTop: "10px",
                  background: "#0f172a",
                  padding: "12px",
                  borderRadius: "8px",
                }}
              >
                {apiCall}
              </div>
            </details>
          )}

          {/* ================================================== */}
          {/* SQL */}
          {/* ================================================== */}

          {sql && (
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
                🗄️ View SQL
              </summary>

              <div
                style={{
                  marginTop: "10px",
                  background: "#0f172a",
                  padding: "12px",
                  borderRadius: "8px",
                  overflowX: "auto",
                }}
              >
                <code>{sql}</code>
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

export default Chat;