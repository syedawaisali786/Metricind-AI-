// ============================================================
// METRICMIND - AXlero STYLE SEMANTIC BI BACKEND
// ============================================================

import express from "express";
import cors from "cors";

import businessData from "./data.js";

import {
  metrics,
  dimensions,
  getMetric,
  calculateMetric,
  monthlyAnalytics,
  countryAnalytics,
  regionAnalytics,
  productAnalytics
} from "./semanticLayer.js";

const app = express();

const PORT = 5000;

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors());
app.use(express.json());

// ============================================================
// HOME
// ============================================================

app.get("/", (req, res) => {
  res.json({
    project: "MetricMind",
    description: "Agentic Semantic BI Engine",
    status: "running",
    version: "1.0.0"
  });
});

// ============================================================
// SEMANTIC LAYER INFORMATION
// ============================================================

app.get("/api/semantic-layer", (req, res) => {
  res.json({
    metrics,
    dimensions
  });
});

// ============================================================
// AVAILABLE METRICS
// ============================================================

app.get("/api/metrics", (req, res) => {
  res.json({
    revenue: "Total Revenue",
    cost: "Total Cost",
    profit: "Revenue - Cost",
    margin: "Profit Margin",
    orders: "Total Orders"
  });
});

// ============================================================
// SINGLE GOVERNED METRIC
// ============================================================

app.get("/api/metrics/:metricName", (req, res) => {
  const metricName = req.params.metricName.toLowerCase();

  const metric = getMetric(metricName);

  if (!metric) {
    return res.status(404).json({
      error: "Metric not found",
      metric: metricName,
      availableMetrics: Object.keys(metrics)
    });
  }

  const value = calculateMetric(metricName, businessData);

  res.json({
    metric: metricName,
    name: metric.name,
    value: Number(value.toFixed(2)),
    source: "MetricMind Semantic Layer"
  });
});

// ============================================================
// MONTHLY ANALYTICS
// ============================================================

app.get("/api/analytics/monthly", (req, res) => {
  res.json({
    dimension: "Time",
    data: monthlyAnalytics()
  });
});

// ============================================================
// COUNTRY ANALYTICS
// ============================================================

app.get("/api/analytics/country", (req, res) => {
  res.json({
    dimension: "Geography",
    data: countryAnalytics()
  });
});

// ============================================================
// REGION ANALYTICS
// ============================================================

app.get("/api/analytics/region", (req, res) => {
  res.json({
    dimension: "Region",
    data: regionAnalytics()
  });
});

// ============================================================
// PRODUCT ANALYTICS
// ============================================================

app.get("/api/analytics/product", (req, res) => {
  res.json({
    dimension: "Product",
    data: productAnalytics()
  });
});

// ============================================================
// NATURAL LANGUAGE QUERY
// ============================================================

app.post("/api/query", (req, res) => {
  const question = String(req.body.question || "").toLowerCase();

  if (!question) {
    return res.status(400).json({
      error: "Question is required"
    });
  }

  // ----------------------------------------------------------
  // Q3 REVENUE
  // ----------------------------------------------------------

  if (
    question.includes("q3") &&
    question.includes("revenue")
  ) {
    return res.json({
      question: req.body.question,
      interpretation: "Q3 Revenue",
      metric: "revenue",
      filters: {
        quarter: "Q3"
      },
      value: 0,
      message:
        "Q3 data is not available in the current Jan-Jun mock dataset.",
      apiCall: "GET /api/metrics/revenue",
      sql:
        "SELECT SUM(revenue) FROM business_data WHERE quarter = 'Q3';"
    });
  }

  // ----------------------------------------------------------
  // EUROPEAN SALES
  // ----------------------------------------------------------

  if (
    question.includes("europe") ||
    question.includes("european")
  ) {
    const data = regionAnalytics().find(
      (item) => item.region === "Europe"
    );

    return res.json({
      question: req.body.question,
      interpretation: "European Sales",
      metric: "revenue",
      filters: {
        region: "Europe"
      },
      data,
      apiCall: "GET /api/analytics/region",
      sql:
        "SELECT region, SUM(revenue) FROM business_data WHERE region = 'Europe' GROUP BY region;"
    });
  }

  // ----------------------------------------------------------
  // REVENUE
  // ----------------------------------------------------------
// ----------------------------------------------------------
// MONTHLY ANALYTICS
// ----------------------------------------------------------

if (
  question.includes("monthly") ||
  question.includes("month")
) {
  const data = monthlyAnalytics();

  return res.json({
    question: req.body.question,
    interpretation: "Monthly Revenue and Profit",
    metric: "revenue",
    data,
    chartType: "line",
    apiCall: "GET /api/analytics/monthly",
    sql:
      "SELECT month, SUM(revenue) AS revenue, SUM(revenue) - SUM(cost) AS profit FROM business_data GROUP BY month;"
  });
}
  if (question.includes("revenue")) {
    const value = calculateMetric("revenue");

    return res.json({
      question: req.body.question,
      metric: "revenue",
      value,
      apiCall: "GET /api/metrics/revenue",
      sql: "SELECT SUM(revenue) FROM business_data;"
    });
  }

  // ----------------------------------------------------------
  // COST
  // ----------------------------------------------------------

  if (question.includes("cost")) {
    const value = calculateMetric("cost");

    return res.json({
      question: req.body.question,
      metric: "cost",
      value,
      apiCall: "GET /api/metrics/cost",
      sql: "SELECT SUM(cost) FROM business_data;"
    });
  }

  // ----------------------------------------------------------
  // PROFIT
  // ----------------------------------------------------------

  if (question.includes("profit")) {
    const value = calculateMetric("profit");

    return res.json({
      question: req.body.question,
      metric: "profit",
      value,
      apiCall: "GET /api/metrics/profit",
      sql:
        "SELECT SUM(revenue) - SUM(cost) FROM business_data;"
    });
  }

  // ----------------------------------------------------------
  // MARGIN
  // ----------------------------------------------------------

  if (question.includes("margin")) {
    const value = calculateMetric("margin");

    return res.json({
      question: req.body.question,
      metric: "margin",
      value: Number(value.toFixed(2)),
      unit: "%",
      apiCall: "GET /api/metrics/margin",
      sql:
        "SELECT (SUM(revenue) - SUM(cost)) / SUM(revenue) * 100 FROM business_data;"
    });
  }

   // MONTHLY ANALYTICS
  // ----------------------------------------------------------

  if (
    question.includes("monthly") ||
    question.includes("month") ||
    question.includes("monthly revenue") ||
    question.includes("monthly profit")
  ) {
    const data = monthlyAnalytics();

    return res.json({
      question: req.body.question,
      interpretation: "Monthly Revenue and Profit",
      metric: "revenue",
      data,
      chartType: "line",
      apiCall: "GET /api/analytics/monthly",
      sql:
        "SELECT month, SUM(revenue) AS revenue, SUM(revenue) - SUM(cost) AS profit FROM business_data GROUP BY month;"
    });
  }
  // ----------------------------------------------------------
  // UNKNOWN QUERY
  // ----------------------------------------------------------
// ----------------------------------------------------------
  // ----------------------------------------------------------
// COUNTRY PERFORMANCE
// ----------------------------------------------------------

if (
  question.includes("country") ||
  question.includes("countries")
) {
  const data = countryAnalytics();

  return res.json({
    question: req.body.question,
    interpretation: "Country Performance",
    metric: "revenue",
    filters: {
      dimension: "country"
    },
    data,
    chartType: "bar",
    apiCall: "GET /api/analytics/country",
    sql:
      "SELECT country, SUM(revenue) FROM business_data GROUP BY country;"
  });
}

  // ----------------------------------------------------------
  // PRODUCT ANALYTICS
  // ----------------------------------------------------------

  if (
    question.includes("product") ||
    question.includes("products") ||
    question.includes("profit by product")
  ) {
    const data = productAnalytics();

    return res.json({
      question: req.body.question,
      interpretation: "Profit by Product",
      metric: "profit",
      data,
      chartType: "bar",
      apiCall: "GET /api/analytics/product",
      sql:
        "SELECT product, SUM(revenue) - SUM(cost) AS profit FROM business_data GROUP BY product;"
    });
  }
  res.status(400).json({
    error: "Query not understood",
    supportedQueries: [
      "Total Revenue",
      "Total Cost",
      "Total Profit",
      "Profit Margin",
      "European Sales",
      "Q3 Revenue"
    ]
  });
});

// ============================================================
// 404 HANDLER
// ============================================================

app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    path: req.originalUrl
  });
});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log(
    `MetricMind AI Backend running on http://localhost:${PORT}`
  );
});