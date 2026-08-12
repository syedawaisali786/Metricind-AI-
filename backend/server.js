// ============================================================
// METRICMIND - AXLERO STYLE SEMANTIC BI BACKEND
// ============================================================

import express from "express";
import cors from "cors";

import { executeAgent } from "./agentOrchestrator.js";

import businessData from "./data.js";

import {
  metrics,
  dimensions,
  getMetric,
  calculateMetric,
  filterData,
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
// HELPER - BUILD FILTERS FROM QUERY PARAMETERS
// ============================================================

function getFiltersFromQuery(query) {
  const filters = {};

  if (query.country) {
    filters.country = String(query.country);
  }

  if (query.region) {
    filters.region = String(query.region);
  }

  if (query.product) {
    filters.product = String(query.product);
  }

  if (query.month) {
    filters.month = String(query.month);
  }

  return filters;
}

// ============================================================
// HELPER - APPLY ALL BUSINESS FILTERS
// ============================================================
//
// Country, Region and Product are handled by the
// semantic layer.
//
// Month is handled here using the transaction date.
//
// Example:
// month=1  -> January
// month=2  -> February
// month=3  -> March
// ...
// month=12 -> December
//
// ============================================================

function getFilteredRows(filters) {
  // ----------------------------------------------------------
  // STEP 1 - Apply semantic-layer filters
  // ----------------------------------------------------------

  const semanticFilters = {};

  if (filters.country) {
    semanticFilters.country = filters.country;
  }

  if (filters.region) {
    semanticFilters.region = filters.region;
  }

  if (filters.product) {
    semanticFilters.product = filters.product;
  }

  let rows = filterData(semanticFilters);

  // ----------------------------------------------------------
  // STEP 2 - Apply month filter
  // ----------------------------------------------------------

  if (filters.month) {
    const selectedMonth = Number(filters.month);

    if (
      Number.isInteger(selectedMonth) &&
      selectedMonth >= 1 &&
      selectedMonth <= 12
    ) {
      rows = rows.filter((row) => {
        const rowMonth =
          new Date(row.date).getMonth() + 1;

        return rowMonth === selectedMonth;
      });
    }
  }

  return rows;
}

// ============================================================
// HOME
// ============================================================

app.get("/", (req, res) => {
  res.json({
    project: "MetricMind",
    description: "Agentic Semantic BI Engine",
    status: "running",
    version: "1.2.0"
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
// SUPPORTS BUSINESS FILTERS
// ============================================================
//
// Examples:
//
// /api/metrics/revenue
//
// /api/metrics/revenue?country=India
//
// /api/metrics/revenue?region=Asia
//
// /api/metrics/revenue?product=Monitor
//
// /api/metrics/revenue?month=2
//
// /api/metrics/revenue?country=India&region=Asia&product=Monitor&month=2
//
// ============================================================

app.get("/api/metrics/:metricName", (req, res) => {
  try {
    const metricName =
      req.params.metricName.toLowerCase();

    const metric =
      getMetric(metricName);

    if (!metric) {
      return res.status(404).json({
        error: "Metric not found",
        metric: metricName,
        availableMetrics:
          Object.keys(metrics)
      });
    }

    const filters =
      getFiltersFromQuery(req.query);

    const rows =
      getFilteredRows(filters);

    const value =
      calculateMetric(
        metricName,
        rows
      );

    res.json({
      metric: metricName,

      name: metric.name,

      value: Number(
        value.toFixed(2)
      ),

      filters,

      rowCount: rows.length,

      source:
        "MetricMind Semantic Layer"
    });

  } catch (error) {
    console.error(
      "Metric calculation error:",
      error
    );

    res.status(500).json({
      error:
        "Unable to calculate metric"
    });
  }
});

// ============================================================
// MONTHLY ANALYTICS
// ============================================================

app.get(
  "/api/analytics/monthly",
  (req, res) => {
    try {
      res.json({
        dimension: "Time",

        data:
          monthlyAnalytics()
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "Unable to calculate monthly analytics"
      });
    }
  }
);

// ============================================================
// COUNTRY ANALYTICS
// ============================================================

app.get(
  "/api/analytics/country",
  (req, res) => {
    try {
      res.json({
        dimension:
          "Geography",

        data:
          countryAnalytics()
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "Unable to calculate country analytics"
      });
    }
  }
);

// ============================================================
// REGION ANALYTICS
// ============================================================

app.get(
  "/api/analytics/region",
  (req, res) => {
    try {
      res.json({
        dimension:
          "Region",

        data:
          regionAnalytics()
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "Unable to calculate region analytics"
      });
    }
  }
);

// ============================================================
// PRODUCT ANALYTICS
// ============================================================

app.get(
  "/api/analytics/product",
  (req, res) => {
    try {
      res.json({
        dimension:
          "Product",

        data:
          productAnalytics()
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        error:
          "Unable to calculate product analytics"
      });
    }
  }
);

// ============================================================
// FILTERED DASHBOARD ANALYTICS
// ============================================================
//
// Supports:
//
// Country
// Region
// Product
// Month
//
// Example:
//
// /api/analytics/filtered?country=India
//
// /api/analytics/filtered?country=India&region=Asia
//
// /api/analytics/filtered?country=India&region=Asia&product=Monitor
//
// /api/analytics/filtered?country=India&region=Asia&product=Monitor&month=2
//
// ============================================================

app.get(
  "/api/analytics/filtered",
  (req, res) => {
    try {

      const filters =
        getFiltersFromQuery(
          req.query
        );

      const filteredRows =
        getFilteredRows(filters);

      const revenue =
        calculateMetric(
          "revenue",
          filteredRows
        );

      const cost =
        calculateMetric(
          "cost",
          filteredRows
        );

      const profit =
        calculateMetric(
          "profit",
          filteredRows
        );

      const orders =
        calculateMetric(
          "orders",
          filteredRows
        );

      const margin =
        calculateMetric(
          "margin",
          filteredRows
        );

      res.json({

        filters,

        data: {

          revenue,

          cost,

          profit,

          orders,

          margin:
            Number(
              margin.toFixed(2)
            )
        },

        rowCount:
          filteredRows.length,

        source:
          "MetricMind Semantic Layer"

      });

    } catch (error) {

      console.error(
        "Filtered analytics error:",
        error
      );

      res.status(500).json({
        error:
          "Unable to calculate filtered analytics."
      });
    }
  }
);

// ============================================================
// KPI SUMMARY
// SUPPORTS BUSINESS FILTERS
// ============================================================
//
// Examples:
//
// /api/analytics/summary
//
// /api/analytics/summary?country=India
//
// /api/analytics/summary?country=India&region=Asia
//
// /api/analytics/summary?country=India&region=Asia&product=Monitor&month=2
//
// ============================================================

app.get(
  "/api/analytics/summary",
  (req, res) => {

    try {

      const filters =
        getFiltersFromQuery(
          req.query
        );

      const rows =
        getFilteredRows(filters);

      const revenue =
        calculateMetric(
          "revenue",
          rows
        );

      const cost =
        calculateMetric(
          "cost",
          rows
        );

      const profit =
        calculateMetric(
          "profit",
          rows
        );

      const orders =
        calculateMetric(
          "orders",
          rows
        );

      const margin =
        calculateMetric(
          "margin",
          rows
        );

      res.json({

        revenue,

        cost,

        profit,

        orders,

        margin:
          Number(
            margin.toFixed(2)
          ),

        filters,

        rowCount:
          rows.length,

        source:
          "MetricMind Semantic Layer"

      });

    } catch (error) {

      console.error(
        "KPI summary error:",
        error
      );

      res.status(500).json({
        error:
          "Unable to calculate KPI summary."
      });
    }
  }
);

// ============================================================
// NATURAL LANGUAGE QUERY
// ============================================================

app.post(
  "/api/query",
  (req, res) => {

    const rawQuestion =
      String(
        req.body.question || ""
      );

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!rawQuestion.trim()) {
      return res.status(400).json({
        error:
          "Question is required"
      });
    }

    if (rawQuestion.length > 300) {
      return res.status(400).json({
        error:
          "Query is too long",

        maxCharacters: 300
      });
    }

    // --------------------------------------------------------
    // AGENT ORCHESTRATOR
    // --------------------------------------------------------

    const agentResult =
      executeAgent(
        rawQuestion.trim()
      );

    if (agentResult) {
      return res.json(
        agentResult
      );
    }

    // --------------------------------------------------------
    // FALLBACK
    // --------------------------------------------------------

    const question =
      rawQuestion
        .trim()
        .toLowerCase();

    console.log(
      "Fallback query:",
      question
    );

    // --------------------------------------------------------
    // UNKNOWN QUERY
    // --------------------------------------------------------

    return res.status(400).json({

      error:
        "Query not understood",

      supportedQueries: [

        "Total Revenue",

        "Total Cost",

        "Total Profit",

        "Profit Margin",

        "Total Orders",

        "Monthly Revenue",

        "Country Performance",

        "Regional Performance",

        "European Sales",

        "Profit by Product",

        "Q3 Revenue"

      ]

    });
  }
);

// ============================================================
// 404 HANDLER
// ============================================================

app.use(
  (req, res) => {

    res.status(404).json({

      error:
        "Endpoint not found",

      path:
        req.originalUrl

    });

  }
);

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================

app.use(
  (error, req, res, next) => {

    console.error(
      "Server error:",
      error
    );

    res.status(500).json({

      error:
        "Internal server error"

    });

  }
);

// ============================================================
// START SERVER
// ============================================================

app.listen(
  PORT,
  () => {

    console.log(
      `MetricMind AI Backend running on http://localhost:${PORT}`
    );

  }
);