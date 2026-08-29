// ============================================================
// METRICMIND - AXLERO STYLE SEMANTIC BI BACKEND
// ============================================================

import express from "express";
import cors from "cors";

import { executeAgent } from "./agentOrchestrator.js";
import { connectSnowflake } from "./snowflake.js";

import {
  metrics,
  dimensions,
  getMetric,
  calculateMetric,
  filterData,
  monthlyAnalytics,
  countryAnalytics,
  regionAnalytics,
  productAnalytics,
  setBusinessData,
  getBusinessData
} from "./semanticLayer.js";

const app = express();

const PORT = 5000;

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors());
app.use(express.json());

// ============================================================
// LOAD BUSINESS DATA FROM SNOWFLAKE
// ============================================================

async function loadBusinessDataFromSnowflake() {
  const connection = await connectSnowflake();

  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        ID,
        DATE,
        COUNTRY,
        REGION,
        PRODUCT,
        ORDERS,
        REVENUE,
        COST,
        SHIPPING_COST,
        MATERIAL_COST
      FROM METRICMIND.ANALYTICS.BUSINESS_DATA
      ORDER BY DATE
    `;

    connection.execute({
      sqlText: sql,

      complete: (err, stmt, rows) => {
        if (err) {
          console.error(
            "❌ Snowflake data loading failed:"
          );

          console.error(err);

          reject(err);
          return;
        }

        console.log(
          `📥 Snowflake returned ${
            rows?.length || 0
          } rows`
        );

        if (!rows || rows.length === 0) {
          console.warn(
            "⚠️ Snowflake query returned 0 rows"
          );

          setBusinessData([]);

          resolve([]);

          return;
        }

        // ======================================================
        // NORMALIZE SNOWFLAKE DATA
        // ======================================================

        const normalizedRows = rows.map((row) => ({
          id: row.ID,

          date: row.DATE,

          country: row.COUNTRY,

          region: row.REGION,

          product: row.PRODUCT,

          orders: Number(
            row.ORDERS ?? 0
          ),

          revenue: Number(
            row.REVENUE ?? 0
          ),

          cost: Number(
            row.COST ?? 0
          ),

          shippingCost: Number(
            row.SHIPPING_COST ?? 0
          ),

          materialCost: Number(
            row.MATERIAL_COST ?? 0
          ),
        }));

        // ======================================================
        // LOAD INTO SEMANTIC LAYER
        // ======================================================

        setBusinessData(
          normalizedRows
        );

        console.log(
          `✅ Loaded ${normalizedRows.length} rows into MetricMind`
        );

        // ======================================================
        // DEBUG FIRST ROW
        // ======================================================

        console.log(
          "📊 First Snowflake row:"
        );

        console.log(
          normalizedRows[0]
        );

        resolve(
          normalizedRows
        );
      },
    });
  });
}

// ============================================================
// HELPER - BUILD FILTERS
// ============================================================

function getFiltersFromQuery(query) {
  const filters = {};

  if (query.country) {
    filters.country = String(
      query.country
    );
  }

  if (query.region) {
    filters.region = String(
      query.region
    );
  }

  if (query.product) {
    filters.product = String(
      query.product
    );
  }

  if (query.month) {
    filters.month = String(
      query.month
    );
  }

  return filters;
}

// ============================================================
// HELPER - FILTER BUSINESS DATA
// ============================================================

function getFilteredRows(filters) {
  const semanticFilters = {};

  if (filters.country) {
    semanticFilters.country =
      filters.country;
  }

  if (filters.region) {
    semanticFilters.region =
      filters.region;
  }

  if (filters.product) {
    semanticFilters.product =
      filters.product;
  }

  let rows = filterData(
    semanticFilters
  );

  // ==========================================================
  // MONTH FILTER
  // ==========================================================

  if (filters.month) {
    const selectedMonth =
      Number(filters.month);

    if (
      Number.isInteger(selectedMonth) &&
      selectedMonth >= 1 &&
      selectedMonth <= 12
    ) {
      rows = rows.filter((row) => {
        const rowDate =
          new Date(row.date);

        if (
          Number.isNaN(
            rowDate.getTime()
          )
        ) {
          return false;
        }

        return (
          rowDate.getMonth() + 1 ===
          selectedMonth
        );
      });
    }
  }

  return rows;
}

// ============================================================
// HOME
// ============================================================

app.get("/", (req, res) => {
  const rows =
    getBusinessData();

  res.json({
    project: "MetricMind",

    description:
      "Agentic Semantic BI Engine",

    status: "running",

    version: "1.3.0",

    dataSource: "Snowflake",

    rows:
      rows.length,
  });
});

// ============================================================
// DATA HEALTH CHECK
// ============================================================

app.get(
  "/api/health/data",
  (req, res) => {
    try {
      const rows =
        getBusinessData();

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
        status:
          rows.length > 0
            ? "ok"
            : "empty",

        source:
          "Snowflake",

        rowCount:
          rows.length,

        metrics: {
          revenue,
          cost,
          profit,
          orders,
          margin:
            Number(
              margin.toFixed(2)
            ),
        },

        sample:
          rows.length > 0
            ? rows[0]
            : null,
      });
    } catch (error) {
      console.error(
        "❌ Data health check failed:",
        error
      );

      res.status(500).json({
        status: "error",

        error:
          error.message,
      });
    }
  }
);

// ============================================================
// SEMANTIC LAYER
// ============================================================

app.get(
  "/api/semantic-layer",
  (req, res) => {
    res.json({
      metrics,
      dimensions,
    });
  }
);

// ============================================================
// AVAILABLE METRICS
// ============================================================

app.get(
  "/api/metrics",
  (req, res) => {
    res.json({
      revenue:
        "Total Revenue",

      cost:
        "Total Cost",

      profit:
        "Revenue - Cost",

      margin:
        "Profit Margin",

      orders:
        "Total Orders",
    });
  }
);

// ============================================================
// SINGLE GOVERNED METRIC
// ============================================================

app.get(
  "/api/metrics/:metricName",
  (req, res) => {
    try {
      const metricName =
        req.params.metricName.toLowerCase();

      const metric =
        getMetric(metricName);

      if (!metric) {
        return res.status(404).json({
          error:
            "Metric not found",

          metric:
            metricName,

          availableMetrics:
            Object.keys(metrics),
        });
      }

      const filters =
        getFiltersFromQuery(
          req.query
        );

      const rows =
        getFilteredRows(
          filters
        );

      const value =
        calculateMetric(
          metricName,
          rows
        );

      res.json({
        metric:
          metricName,

        name:
          metric.name,

        value:
          Number(
            value.toFixed(2)
          ),

        filters,

        rowCount:
          rows.length,

        source:
          "MetricMind Semantic Layer",
      });
    } catch (error) {
      console.error(
        "❌ Metric calculation error:",
        error
      );

      res.status(500).json({
        error:
          "Unable to calculate metric",
      });
    }
  }
);

// ============================================================
// MONTHLY ANALYTICS
// ============================================================

app.get(
  "/api/analytics/monthly",
  (req, res) => {
    try {
      const filters =
        getFiltersFromQuery(
          req.query
        );

      res.json({
        dimension:
          "Time",

        data:
          monthlyAnalytics(
            filters
          ),
      });
    } catch (error) {
      console.error(
        "❌ Monthly analytics error:",
        error
      );

      res.status(500).json({
        error:
          "Unable to calculate monthly analytics",
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
      const filters =
        getFiltersFromQuery(
          req.query
        );

      res.json({
        dimension:
          "Geography",

        data:
          countryAnalytics(
            filters
          ),
      });
    } catch (error) {
      console.error(
        "❌ Country analytics error:",
        error
      );

      res.status(500).json({
        error:
          "Unable to calculate country analytics",
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
      const filters =
        getFiltersFromQuery(
          req.query
        );

      res.json({
        dimension:
          "Region",

        data:
          regionAnalytics(
            filters
          ),
      });
    } catch (error) {
      console.error(
        "❌ Region analytics error:",
        error
      );

      res.status(500).json({
        error:
          "Unable to calculate region analytics",
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
      const filters =
        getFiltersFromQuery(
          req.query
        );

      res.json({
        dimension:
          "Product",

        data:
          productAnalytics(
            filters
          ),
      });
    } catch (error) {
      console.error(
        "❌ Product analytics error:",
        error
      );

      res.status(500).json({
        error:
          "Unable to calculate product analytics",
      });
    }
  }
);

// ============================================================
// FILTERED ANALYTICS
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
        getFilteredRows(
          filters
        );

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
            ),
        },

        rowCount:
          filteredRows.length,

        source:
          "MetricMind Semantic Layer",
      });
    } catch (error) {
      console.error(
        "❌ Filtered analytics error:",
        error
      );

      res.status(500).json({
        error:
          "Unable to calculate filtered analytics.",
      });
    }
  }
);

// ============================================================
// KPI SUMMARY
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
        getFilteredRows(
          filters
        );

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
          "MetricMind Semantic Layer",
      });
    } catch (error) {
      console.error(
        "❌ KPI summary error:",
        error
      );

      res.status(500).json({
        error:
          "Unable to calculate KPI summary.",
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

    if (!rawQuestion.trim()) {
      return res.status(400).json({
        error:
          "Question is required",
      });
    }

    if (rawQuestion.length > 300) {
      return res.status(400).json({
        error:
          "Query is too long",

        maxCharacters: 300,
      });
    }

    try {
      const agentResult =
        executeAgent(
          rawQuestion.trim()
        );

      if (agentResult) {
        return res.json(
          agentResult
        );
      }
    } catch (error) {
      console.error(
        "❌ Agent error:",
        error
      );
    }

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
        "Q3 Revenue",
      ],
    });
  }
);

// ============================================================
// 404
// ============================================================

app.use(
  (req, res) => {
    res.status(404).json({
      error:
        "Endpoint not found",

      path:
        req.originalUrl,
    });
  }
);

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================

app.use(
  (error, req, res, next) => {
    console.error(
      "❌ Server error:",
      error
    );

    res.status(500).json({
      error:
        "Internal server error",
    });
  }
);

// ============================================================
// START SERVER
// ============================================================

async function startServer() {
  try {
    console.log(
      "🔄 Connecting to Snowflake..."
    );

    const rows =
      await loadBusinessDataFromSnowflake();

    console.log(
      `📊 Business data available: ${rows.length} rows`
    );

    // ========================================================
    // IMPORTANT DATA VALIDATION
    // ========================================================

    if (rows.length === 0) {
      console.warn(
        "⚠️ WARNING: Snowflake returned ZERO BUSINESS DATA."
      );

      console.warn(
        "⚠️ The API will start, but dashboard values will be empty."
      );
    } else {
      console.log(
        "✅ Snowflake data successfully loaded."
      );
    }

    // ========================================================
    // START EXPRESS ONCE
    // ========================================================

    app.listen(
      PORT,
      () => {
        const loadedRows =
          getBusinessData();

        console.log("");

        console.log(
          "🚀 ============================================"
        );

        console.log(
          "🚀 MetricMind AI Backend"
        );

        console.log(
          `🚀 http://localhost:${PORT}`
        );

        console.log(
          "🚀 Data Source: Snowflake"
        );

        console.log(
          `🚀 Rows Loaded: ${loadedRows.length}`
        );

        console.log(
          "🚀 ============================================"
        );

        console.log("");
      }
    );
  } catch (error) {
    console.error(
      "❌ MetricMind backend startup failed:"
    );

    console.error(
      error
    );

    process.exit(1);
  }
}

startServer();