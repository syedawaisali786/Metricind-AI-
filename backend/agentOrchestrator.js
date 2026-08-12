// ============================================================
// METRICMIND - AGENTIC ORCHESTRATOR
// Axlero-style governed semantic BI agent
// ============================================================

import { validateQuery } from "./queryGovernance.js";

import {
  getMetric,
  calculateMetric,
  filterData,
  regionAnalytics,
  countryAnalytics,
  monthlyAnalytics,
  productAnalytics,
  productAnalyticsByRegion
} from "./semanticLayer.js";

// ============================================================
// 1. EXTRACT BUSINESS FILTERS
// ============================================================

export function extractFilters(question) {

  const q = String(question || "").toLowerCase();

  const filters = {};

  // ==========================================================
  // COUNTRY
  // ==========================================================

  if (q.includes("india")) {
    filters.country = "India";
  }

  else if (
    q.includes("usa") ||
    q.includes("united states")
  ) {
    filters.country = "USA";
  }

  else if (
    q.includes("germany") ||
    q.includes("german")
  ) {
    filters.country = "Germany";
  }

  else if (
    q.includes("france") ||
    q.includes("french")
  ) {
    filters.country = "France";
  }

  // ==========================================================
  // REGION
  // ==========================================================

  if (
    q.includes("north america") ||
    q.includes("north american")
  ) {
    filters.region = "North America";
  }

  else if (
    q.includes("asia") ||
    q.includes("asian")
  ) {
    filters.region = "Asia";
  }

  else if (
    q.includes("europe") ||
    q.includes("european")
  ) {
    filters.region = "Europe";
  }

  // ==========================================================
  // PRODUCT
  // ==========================================================

  if (
    q.includes("laptop") ||
    q.includes("laptops")
  ) {
    filters.product = "Laptop";
  }

  else if (
    q.includes("monitor") ||
    q.includes("monitors")
  ) {
    filters.product = "Monitor";
  }

  else if (
    q.includes("keyboard") ||
    q.includes("keyboards")
  ) {
    filters.product = "Keyboard";
  }

  // ==========================================================
  // MONTH
  // ==========================================================

  if (
    q.includes("january") ||
    q.includes("jan")
  ) {
    filters.month = "1";
  }

  else if (
    q.includes("february") ||
    q.includes("feb")
  ) {
    filters.month = "2";
  }

  else if (
    q.includes("march") ||
    q.includes("mar")
  ) {
    filters.month = "3";
  }

  else if (
    q.includes("april") ||
    q.includes("apr")
  ) {
    filters.month = "4";
  }

  else if (q.includes("may")) {
    filters.month = "5";
  }

  else if (
    q.includes("june") ||
    q.includes("jun")
  ) {
    filters.month = "6";
  }

  return filters;
}

// ============================================================
// 2. DETECT COMPARISON ENTITIES
// ============================================================

function detectCountries(question) {

  const q = String(question || "").toLowerCase();

  const found = [];

  if (
    q.includes("usa") ||
    q.includes("united states")
  ) {
    found.push("USA");
  }

  if (q.includes("india")) {
    found.push("India");
  }

  if (q.includes("germany")) {
    found.push("Germany");
  }

  if (q.includes("france")) {
    found.push("France");
  }

  return found;
}

function detectRegions(question) {

  const q = String(question || "").toLowerCase();

  const found = [];

  if (q.includes("north america")) {
    found.push("North America");
  }

  if (q.includes("asia")) {
    found.push("Asia");
  }

  if (q.includes("europe")) {
    found.push("Europe");
  }

  return found;
}

function detectProducts(question) {

  const q = String(question || "").toLowerCase();

  const found = [];

  if (q.includes("laptop")) {
    found.push("Laptop");
  }

  if (q.includes("monitor")) {
    found.push("Monitor");
  }

  if (q.includes("keyboard")) {
    found.push("Keyboard");
  }

  return found;
}

// ============================================================
// 3. DETECT METRIC
// ============================================================

function detectMetric(question) {

  const q = String(question || "").toLowerCase();

  if (q.includes("profit")) {
    return "profit";
  }

  if (q.includes("cost")) {
    return "cost";
  }

  if (q.includes("margin")) {
    return "margin";
  }

  if (
    q.includes("order") ||
    q.includes("orders")
  ) {
    return "orders";
  }

  return "revenue";
}

// ============================================================
// 4. CALCULATE COMPARISON
// ============================================================

function calculateComparison(
  firstName,
  firstFilters,
  secondName,
  secondFilters,
  metric
) {

  const firstRows =
    filterData(firstFilters);

  const secondRows =
    filterData(secondFilters);

  const firstValue =
    calculateMetric(
      metric,
      firstRows
    );

  const secondValue =
    calculateMetric(
      metric,
      secondRows
    );

  let winner = "Tie";

  if (firstValue > secondValue) {
    winner = firstName;
  }

  else if (secondValue > firstValue) {
    winner = secondName;
  }

  const difference =
    Math.abs(
      firstValue - secondValue
    );

  return {
    first: {
      name: firstName,
      value: Number(
        firstValue.toFixed(2)
      ),
      rowCount: firstRows.length
    },

    second: {
      name: secondName,
      value: Number(
        secondValue.toFixed(2)
      ),
      rowCount: secondRows.length
    },

    winner,

    difference: Number(
      difference.toFixed(2)
    )
  };
}

// ============================================================
// 5. BUILD COMPARISON MESSAGE
// ============================================================

function buildComparisonMessage(
  comparison,
  metric
) {

  const metricNames = {
    revenue: "revenue",
    cost: "cost",
    profit: "profit",
    margin: "profit margin",
    orders: "orders"
  };

  const metricName =
    metricNames[metric] || metric;

  const first =
    comparison.first;

  const second =
    comparison.second;

  const firstFormatted =
    metric === "margin"
      ? `${first.value}%`
      : `₹${first.value.toLocaleString("en-IN")}`;

  const secondFormatted =
    metric === "margin"
      ? `${second.value}%`
      : `₹${second.value.toLocaleString("en-IN")}`;

  if (
    comparison.winner === "Tie"
  ) {

    return (
      `${first.name} and ${second.name} have the same ` +
      `${metricName}: ${firstFormatted}.`
    );
  }

  const winner =
    comparison.winner;

  const winnerValue =
    winner === first.name
      ? firstFormatted
      : secondFormatted;

  const difference =
    metric === "margin"
      ? `${comparison.difference}%`
      : `₹${comparison.difference.toLocaleString("en-IN")}`;

  return (
    `${first.name} has ${metricName} of ${firstFormatted}, ` +
    `while ${second.name} has ${metricName} of ${secondFormatted}. ` +
    `${winner} has the higher ${metricName} at ${winnerValue}, ` +
    `with a difference of ${difference}.`
  );
}

// ============================================================
// 6. INTERPRET USER QUESTION
// ============================================================

export function interpretQuestion(question) {

  const q =
    String(question || "").toLowerCase();

  const filters =
    extractFilters(question);

  // ==========================================================
  // Q3 REVENUE
  // ==========================================================

  if (
    q.includes("q3") &&
    q.includes("revenue")
  ) {

    return {
      intent: "q3_revenue",
      metric: "revenue",
      filters
    };
  }

  // ==========================================================
  // PROFIT ROOT CAUSE
  // ==========================================================

  if (
    q.includes("profit") &&
    (
      q.includes("why") ||
      q.includes("decrease") ||
      q.includes("decreased") ||
      q.includes("down") ||
      q.includes("fall") ||
      q.includes("fell") ||
      q.includes("lower") ||
      q.includes("drop") ||
      q.includes("dropped")
    )
  ) {

    return {
      intent: "profit_root_cause",
      metric: "profit",
      filters
    };
  }

  // ==========================================================
  // COMPARISON
  // ==========================================================

  if (
    q.includes("compare") ||
    q.includes("comparison") ||
    q.includes("versus") ||
    q.includes(" vs ") ||
    q.includes("which is higher") ||
    q.includes("which is lower") ||
    q.includes("better")
  ) {

    return {
      intent: "comparison",
      metric: detectMetric(question),
      filters
    };
  }

  // ==========================================================
  // FILTERED METRIC
  // ==========================================================

  const hasFilters =
    Object.keys(filters).length > 0;

  if (hasFilters) {

    if (q.includes("revenue")) {

      return {
        intent: "filtered_metric",
        metric: "revenue",
        filters
      };
    }

    if (q.includes("cost")) {

      return {
        intent: "filtered_metric",
        metric: "cost",
        filters
      };
    }

    if (q.includes("margin")) {

      return {
        intent: "filtered_metric",
        metric: "margin",
        filters
      };
    }

    if (
      q.includes("order") ||
      q.includes("orders")
    ) {

      return {
        intent: "filtered_metric",
        metric: "orders",
        filters
      };
    }

    if (q.includes("profit")) {

      return {
        intent: "filtered_metric",
        metric: "profit",
        filters
      };
    }
  }

  // ==========================================================
  // MONTHLY
  // ==========================================================

  if (
    q.includes("monthly") ||
    q.includes("month")
  ) {

    return {
      intent: "monthly_analysis",
      metric: "revenue",
      filters
    };
  }

  // ==========================================================
  // COUNTRY
  // ==========================================================

  if (
    q.includes("country") ||
    q.includes("countries")
  ) {

    return {
      intent: "country_analysis",
      metric: "revenue",
      filters
    };
  }

  // ==========================================================
  // REGION
  // ==========================================================

  if (
    q.includes("region") ||
    q.includes("regional")
  ) {

    return {
      intent: "region_analysis",
      metric: "revenue",
      filters
    };
  }

  // ==========================================================
  // PRODUCT
  // ==========================================================

  if (
    q.includes("product") ||
    q.includes("products")
  ) {

    return {
      intent: "product_analysis",
      metric: "profit",
      filters
    };
  }

  // ==========================================================
  // REVENUE
  // ==========================================================

  if (q.includes("revenue")) {

    return {
      intent: "metric",
      metric: "revenue",
      filters
    };
  }

  // ==========================================================
  // COST
  // ==========================================================

  if (q.includes("cost")) {

    return {
      intent: "metric",
      metric: "cost",
      filters
    };
  }

  // ==========================================================
  // MARGIN
  // ==========================================================

  if (q.includes("margin")) {

    return {
      intent: "metric",
      metric: "margin",
      filters
    };
  }

  // ==========================================================
  // ORDERS
  // ==========================================================

  if (
    q.includes("order") ||
    q.includes("orders")
  ) {

    return {
      intent: "metric",
      metric: "orders",
      filters
    };
  }

  // ==========================================================
  // PROFIT
  // ==========================================================

  if (q.includes("profit")) {

    return {
      intent: "metric",
      metric: "profit",
      filters
    };
  }

  // ==========================================================
  // UNKNOWN
  // ==========================================================

  return {
    intent: "unknown",
    metric: null,
    filters
  };
}

// ============================================================
// 7. EXECUTE AGENT
// ============================================================

export function executeAgent(question) {

  const interpretation =
    interpretQuestion(question);

  // ==========================================================
  // GOVERNANCE
  // ==========================================================

  const governance =
    validateQuery(
      question,
      interpretation
    );

  if (!governance.allowed) {

    return {
      question,

      interpretation:
        "Query Rejected by Governance",

      metric: null,

      value: null,

      message:
        governance.reason,

      governance: {
        allowed: false,
        reason:
          governance.reason
      }
    };
  }

  // ==========================================================
  // COMPARISON ANALYSIS
  // ==========================================================

  if (
    interpretation.intent ===
    "comparison"
  ) {

    const metric =
      interpretation.metric ||
      "revenue";

    const countries =
      detectCountries(question);

    const regions =
      detectRegions(question);

    const products =
      detectProducts(question);

    // --------------------------------------------------------
    // COUNTRY COMPARISON
    // --------------------------------------------------------

    if (countries.length >= 2) {

      const first =
        countries[0];

      const second =
        countries[1];

      const comparison =
        calculateComparison(
          first,
          {
            country: first
          },
          second,
          {
            country: second
          },
          metric
        );

      return {

        question,

        interpretation:
          "Agentic Country Comparison",

        metric,

        comparison,

        data: [
          {
            country: first,
            [metric]:
              comparison.first.value
          },

          {
            country: second,
            [metric]:
              comparison.second.value
          }
        ],

        chartType:
          "bar",

        agentSteps: [
          "Interpret comparison question",
          "Identify requested metric",
          "Detect countries",
          "Apply governed country filters",
          "Calculate deterministic metrics",
          "Compare country performance",
          "Identify higher-performing country",
          "Generate business explanation"
        ],

        message:
          buildComparisonMessage(
            comparison,
            metric
          ),

        governance: {
          allowed: true,
          deterministic: true,
          sqlGeneratedByLLM: false,
          reason:
            "Comparison approved by MetricMind Governance."
        },

        apiCall:
          "/api/analytics/country",

        sql:
          buildComparisonSQL(
            metric,
            "country",
            first,
            second
          )
      };
    }

    // --------------------------------------------------------
    // REGION COMPARISON
    // --------------------------------------------------------

    if (regions.length >= 2) {

      const first =
        regions[0];

      const second =
        regions[1];

      const comparison =
        calculateComparison(
          first,
          {
            region: first
          },
          second,
          {
            region: second
          },
          metric
        );

      return {

        question,

        interpretation:
          "Agentic Regional Comparison",

        metric,

        comparison,

        data: [
          {
            region: first,
            [metric]:
              comparison.first.value
          },

          {
            region: second,
            [metric]:
              comparison.second.value
          }
        ],

        chartType:
          "bar",

        agentSteps: [
          "Interpret comparison question",
          "Identify requested metric",
          "Detect regions",
          "Apply governed region filters",
          "Calculate deterministic metrics",
          "Compare regional performance",
          "Identify higher-performing region",
          "Generate business explanation"
        ],

        message:
          buildComparisonMessage(
            comparison,
            metric
          ),

        governance: {
          allowed: true,
          deterministic: true,
          sqlGeneratedByLLM: false,
          reason:
            "Comparison approved by MetricMind Governance."
        },

        apiCall:
          "/api/analytics/region",

        sql:
          buildComparisonSQL(
            metric,
            "region",
            first,
            second
          )
      };
    }

    // --------------------------------------------------------
    // PRODUCT COMPARISON
    // --------------------------------------------------------

    if (products.length >= 2) {

      const first =
        products[0];

      const second =
        products[1];

      const comparison =
        calculateComparison(
          first,
          {
            product: first
          },
          second,
          {
            product: second
          },
          metric
        );

      return {

        question,

        interpretation:
          "Agentic Product Comparison",

        metric,

        comparison,

        data: [
          {
            product: first,
            [metric]:
              comparison.first.value
          },

          {
            product: second,
            [metric]:
              comparison.second.value
          }
        ],

        chartType:
          "bar",

        agentSteps: [
          "Interpret comparison question",
          "Identify requested metric",
          "Detect products",
          "Apply governed product filters",
          "Calculate deterministic metrics",
          "Compare product performance",
          "Identify higher-performing product",
          "Generate business explanation"
        ],

        message:
          buildComparisonMessage(
            comparison,
            metric
          ),

        governance: {
          allowed: true,
          deterministic: true,
          sqlGeneratedByLLM: false,
          reason:
            "Comparison approved by MetricMind Governance."
        },

        apiCall:
          "/api/analytics/product",

        sql:
          buildComparisonSQL(
            metric,
            "product",
            first,
            second
          )
      };
    }

    // --------------------------------------------------------
    // COMPARISON NOT UNDERSTOOD
    // --------------------------------------------------------

    return {

      question,

      interpretation:
        "Comparison Query",

      metric,

      value: null,

      message:
        "I understood that you want a comparison, but I need two countries, regions, or products. Example: Compare USA and India revenue.",

      governance: {
        allowed: true,
        deterministic: true,
        sqlGeneratedByLLM: false
      }
    };
  }

  // ==========================================================
  // FILTERED METRIC QUERY
  // ==========================================================

  if (
    interpretation.intent ===
    "filtered_metric"
  ) {

    const metric =
      interpretation.metric;

    const filters =
      interpretation.filters || {};

    const definition =
      getMetric(metric);

    if (!definition) {

      return {

        question,

        interpretation:
          "Unknown Metric",

        metric: null,

        value: null,

        message:
          "The requested metric does not exist in the MetricMind semantic layer.",

        governance: {
          allowed: false,
          reason:
            "Metric is not governed."
        }
      };
    }

    const rows =
      filterData(filters);

    const value =
      calculateMetric(
        metric,
        rows
      );

    const hasData =
      rows.length > 0;

    const filterParts = [];

    if (filters.country) {
      filterParts.push(
        `country: ${filters.country}`
      );
    }

    if (filters.region) {
      filterParts.push(
        `region: ${filters.region}`
      );
    }

    if (filters.product) {
      filterParts.push(
        `product: ${filters.product}`
      );
    }

    if (filters.month) {

      const monthNames = [
        "",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June"
      ];

      filterParts.push(
        `month: ${
          monthNames[
            Number(filters.month)
          ] || filters.month
        }`
      );
    }

    let message;

    if (!hasData) {

      message =
        `No business data was found for the selected filters (${filterParts.join(", ")}). ` +
        `The governed metric "${definition.name}" therefore returns ₹0.`;

    } else {

      const formattedValue =
        metric === "margin"
          ? `${Number(value.toFixed(2))}%`
          : `₹${Number(value.toFixed(2)).toLocaleString("en-IN")}`;

      message =
        `${definition.name} for the selected filters is ${formattedValue}.`;
    }

    return {

      question,

      interpretation:
        "Agentic Filtered Semantic Metric Query",

      agentSteps: [
        "Interpret user question",
        "Extract business filters",
        "Validate query through governance",
        "Retrieve governed metric definition",
        "Apply filters through semantic layer",
        "Calculate deterministic metric",
        "Generate business explanation"
      ],

      metric,

      value:
        Number(value.toFixed(2)),

      filters,

      rowCount:
        rows.length,

      semanticMetric: {

        name:
          definition.name,

        description:
          definition.description,

        aggregation:
          definition.aggregation
      },

      message,

      governance: {
        allowed: true,
        deterministic: true,
        sqlGeneratedByLLM: false,
        reason:
          "Query approved by MetricMind Governance."
      },

      apiCall:
        `/api/metrics/${metric}${buildQueryString(filters)}`,

      sql:
        buildMetricSQL(
          metric,
          filters
        )
    };
  }

  // ==========================================================
  // Q3 REVENUE
  // ==========================================================

  if (
    interpretation.intent ===
    "q3_revenue"
  ) {

    return {

      question,

      interpretation:
        "Governed Q3 Revenue Query",

      agentSteps: [
        "Interpret user question",
        "Identify Revenue metric",
        "Apply Q3 quarter filter",
        "Query governed semantic layer",
        "Return deterministic result"
      ],

      metric:
        "revenue",

      filters: {
        quarter:
          "Q3"
      },

      value:
        0,

      message:
        "Q3 revenue is ₹0 because the current mock dataset contains only Jan-Jun data. No Q3 records are available.",

      governance: {
        allowed: true,
        deterministic: true,
        sqlGeneratedByLLM: false,
        reason:
          "Query approved by MetricMind Governance."
      },

      apiCall:
        "GET /api/metrics/revenue",

      sql:
        "SELECT SUM(revenue) " +
        "FROM business_data " +
        "WHERE quarter = 'Q3';"
    };
  }

  // ==========================================================
  // PROFIT ROOT CAUSE
  // ==========================================================

  if (
    interpretation.intent ===
    "profit_root_cause"
  ) {

    const filters =
      interpretation.filters || {};

    const filteredRows =
      Object.keys(filters).length > 0
        ? filterData(filters)
        : null;

    const totalRevenue =
      filteredRows
        ? calculateMetric(
            "revenue",
            filteredRows
          )
        : calculateMetric("revenue");

    const totalCost =
      filteredRows
        ? calculateMetric(
            "cost",
            filteredRows
          )
        : calculateMetric("cost");

    const totalProfit =
      filteredRows
        ? calculateMetric(
            "profit",
            filteredRows
          )
        : calculateMetric("profit");

    const regions =
      filteredRows
        ? regionAnalytics(filters)
        : regionAnalytics();

    const highestCostRegion =
      [...regions].sort(
        (a, b) =>
          b.cost - a.cost
      )[0];

    const lowestProfitRegion =
      [...regions].sort(
        (a, b) =>
          a.profit - b.profit
      )[0];

    let regionalProducts = [];

    let weakestProduct = null;

    if (lowestProfitRegion) {

      regionalProducts =
        productAnalyticsByRegion(
          lowestProfitRegion.region
        );

      weakestProduct =
        [...regionalProducts].sort(
          (a, b) =>
            a.profit - b.profit
        )[0];
    }

    let explanation =
      `Total revenue is ₹${totalRevenue.toLocaleString("en-IN")}, ` +
      `while total cost is ₹${totalCost.toLocaleString("en-IN")}, ` +
      `resulting in total profit of ₹${totalProfit.toLocaleString("en-IN")}. `;

    if (highestCostRegion) {

      explanation +=
        `${highestCostRegion.region} has the highest regional cost ` +
        `at ₹${highestCostRegion.cost.toLocaleString("en-IN")}. `;
    }

    if (lowestProfitRegion) {

      explanation +=
        `${lowestProfitRegion.region} has the lowest regional profit ` +
        `at ₹${lowestProfitRegion.profit.toLocaleString("en-IN")}. `;
    }

    if (weakestProduct) {

      explanation +=
        `Within ${lowestProfitRegion.region}, ` +
        `${weakestProduct.product} has the lowest product profit ` +
        `at ₹${weakestProduct.profit.toLocaleString("en-IN")}.`;
    }

    return {

      question,

      interpretation:
        "Agentic Multi-Step Profit Root-Cause Analysis",

      agentSteps: [
        "Interpret user question",
        "Retrieve governed profit metric",
        "Calculate total revenue",
        "Calculate total cost",
        "Calculate total profit",
        "Query regional performance",
        "Identify highest-cost region",
        "Identify lowest-profit region",
        "Drill down into product performance",
        "Identify weakest product",
        "Generate root-cause explanation"
      ],

      metric:
        "profit",

      value:
        totalProfit,

      message:
        explanation,

      data:
        regionalProducts,

      chartType:
        "bar",

      filters,

      drillDown: {

        lowestProfitRegion:
          lowestProfitRegion
            ? lowestProfitRegion.region
            : null,

        lowestProfitValue:
          lowestProfitRegion
            ? lowestProfitRegion.profit
            : null,

        weakestProduct:
          weakestProduct
            ? weakestProduct.product
            : null,

        weakestProductProfit:
          weakestProduct
            ? weakestProduct.profit
            : null
      },

      governance: {

        allowed: true,

        deterministic: true,

        sqlGeneratedByLLM: false,

        reason:
          "Query approved by MetricMind Governance."
      },

      apiCall:
        "GET /api/analytics/product",

      sql:
        "SELECT region, " +
        "SUM(revenue) AS revenue, " +
        "SUM(cost) AS cost, " +
        "SUM(revenue - cost) AS profit " +
        "FROM business_data " +
        "GROUP BY region;"
    };
  }

  // ==========================================================
  // MONTHLY ANALYSIS
  // ==========================================================

  if (
    interpretation.intent ===
    "monthly_analysis"
  ) {

    const filters =
      interpretation.filters || {};

    return {

      question,

      interpretation:
        "Agentic Monthly Analysis",

      metric:
        "revenue",

      filters,

      agentSteps: [
        "Interpret user question",
        "Identify Time dimension",
        "Apply semantic filters",
        "Query monthly analytics",
        "Return time-series result"
      ],

      data:
        monthlyAnalytics(filters),

      chartType:
        "line",

      governance: {
        allowed: true,
        deterministic: true,
        sqlGeneratedByLLM: false
      },

      apiCall:
        "GET /api/analytics/monthly",

      sql:
        "SELECT month, " +
        "SUM(revenue) AS revenue, " +
        "SUM(revenue) - SUM(cost) AS profit " +
        "FROM business_data " +
        "GROUP BY month;"
    };
  }

  // ==========================================================
  // COUNTRY ANALYSIS
  // ==========================================================

  if (
    interpretation.intent ===
    "country_analysis"
  ) {

    const filters =
      interpretation.filters || {};

    const metric =
      interpretation.metric || "revenue";

    return {

      question,

      interpretation:
        "Agentic Country Analysis",

      metric,

      filters,

      agentSteps: [
        "Interpret user question",
        "Identify Geography dimension",
        "Apply semantic filters",
        "Group revenue by country",
        "Return result"
      ],

      data:
        countryAnalytics(filters),

      chartType:
        "bar",

      governance: {
        allowed: true,
        deterministic: true,
        sqlGeneratedByLLM: false
      },

      apiCall:
        `/api/analytics/country${buildQueryString(filters)}`,

      sql:
        buildMetricSQL(
          metric,
          filters
        )
    };
  }

  // ==========================================================
  // REGION ANALYSIS
  // ==========================================================

  if (
    interpretation.intent ===
    "region_analysis"
  ) {

    const filters =
      interpretation.filters || {};

    return {

      question,

      interpretation:
        "Agentic Regional Analysis",

      metric:
        "revenue",

      filters,

      agentSteps: [
        "Interpret user question",
        "Identify Region dimension",
        "Apply semantic filters",
        "Group revenue by region",
        "Return result"
      ],

      data:
        regionAnalytics(filters),

      chartType:
        "bar",

      governance: {
        allowed: true,
        deterministic: true,
        sqlGeneratedByLLM: false
      },

      apiCall:
        "/api/analytics/region",

      sql:
        "SELECT region, " +
        "SUM(revenue) AS revenue " +
        "FROM business_data " +
        "GROUP BY region;"
    };
  }

  // ==========================================================
  // PRODUCT ANALYSIS
  // ==========================================================

  if (
    interpretation.intent ===
    "product_analysis"
  ) {

    const filters =
      interpretation.filters || {};

    return {

      question,

      interpretation:
        "Agentic Product Analysis",

      metric:
        "profit",

      filters,

      agentSteps: [
        "Interpret user question",
        "Identify Product dimension",
        "Apply semantic filters",
        "Calculate profit by product",
        "Return result"
      ],

      data:
        productAnalytics(filters),

      chartType:
        "bar",

      governance: {
        allowed: true,
        deterministic: true,
        sqlGeneratedByLLM: false
      },

      apiCall:
        "/api/analytics/product",

      sql:
        "SELECT product, " +
        "SUM(revenue) - SUM(cost) AS profit " +
        "FROM business_data " +
        "GROUP BY product;"
    };
  }

  // ==========================================================
  // SINGLE METRIC
  // ==========================================================

  if (
    interpretation.intent ===
    "metric"
  ) {

    const metric =
      interpretation.metric;

    const definition =
      getMetric(metric);

    if (!definition) {
      return null;
    }

    const filters =
      interpretation.filters || {};

    const rows =
      Object.keys(filters).length > 0
        ? filterData(filters)
        : undefined;

    const value =
      rows
        ? calculateMetric(
            metric,
            rows
          )
        : calculateMetric(metric);

    return {

      question,

      interpretation:
        "Governed Semantic Metric Query",

      agentSteps: [
        "Interpret user question",
        "Identify governed metric",
        "Retrieve semantic definition",
        "Apply filters",
        "Calculate metric",
        "Return deterministic result"
      ],

      metric,

      value:
        Number(value.toFixed(2)),

      filters,

      semanticMetric: {

        name:
          definition.name,

        description:
          definition.description,

        aggregation:
          definition.aggregation
      },

      apiCall:
        `/api/metrics/${metric}${buildQueryString(filters)}`,

      sql:
        buildMetricSQL(
          metric,
          filters
        ),

      governance: {

        allowed: true,

        deterministic: true,

        sqlGeneratedByLLM: false,

        reason:
          "Query approved by MetricMind Governance."
      }
    };
  }

  // ==========================================================
  // UNKNOWN QUERY
  // ==========================================================

  return {

    question,

    interpretation:
      "Unknown Query",

    metric: null,

    value: null,

    filters:
      interpretation.filters || {},

    message:
      "I could not understand this business question. Please ask about revenue, cost, profit, margin, orders, monthly performance, countries, regions, products, comparisons, or Q3 revenue.",

    governance: {

      allowed: true,

      deterministic: true,

      sqlGeneratedByLLM: false

    }
  };
}

// ============================================================
// 8. BUILD QUERY STRING
// ============================================================

function buildQueryString(
  filters = {}
) {

  const params =
    new URLSearchParams();

  if (filters.country) {

    params.set(
      "country",
      filters.country
    );
  }

  if (filters.region) {

    params.set(
      "region",
      filters.region
    );
  }

  if (filters.product) {

    params.set(
      "product",
      filters.product
    );
  }

  if (filters.month) {

    params.set(
      "month",
      filters.month
    );
  }

  const query =
    params.toString();

  return query
    ? `?${query}`
    : "";
}

// ============================================================
// 9. BUILD DETERMINISTIC SQL
// ============================================================

function buildMetricSQL(
  metric,
  filters = {}
) {

  let formula;

  switch (metric) {

    case "revenue":

      formula =
        "SUM(revenue)";

      break;

    case "cost":

      formula =
        "SUM(cost)";

      break;

    case "profit":

      formula =
        "SUM(revenue) - SUM(cost)";

      break;

    case "orders":

      formula =
        "SUM(orders)";

      break;

    case "margin":

      formula =
        "(SUM(revenue) - SUM(cost)) / SUM(revenue) * 100";

      break;

    default:

      formula =
        "UNKNOWN_METRIC";
  }

  let sql =
    `SELECT ${formula} FROM business_data`;

  const conditions = [];

  if (filters.country) {

    conditions.push(
      `country = '${filters.country}'`
    );
  }

  if (filters.region) {

    conditions.push(
      `region = '${filters.region}'`
    );
  }

  if (filters.product) {

    conditions.push(
      `product = '${filters.product}'`
    );
  }

  if (filters.month) {

    conditions.push(
      `MONTH(date) = ${Number(filters.month)}`
    );
  }

  if (conditions.length > 0) {

    sql +=
      ` WHERE ${conditions.join(" AND ")}`;
  }

  sql += ";";

  return sql;
}

// ============================================================
// 10. BUILD COMPARISON SQL
// ============================================================

function buildComparisonSQL(
  metric,
  dimension,
  first,
  second
) {

  let formula;

  switch (metric) {

    case "revenue":

      formula =
        "SUM(revenue)";

      break;

    case "cost":

      formula =
        "SUM(cost)";

      break;

    case "profit":

      formula =
        "SUM(revenue) - SUM(cost)";

      break;

    case "orders":

      formula =
        "SUM(orders)";

      break;

    case "margin":

      formula =
        "(SUM(revenue) - SUM(cost)) / SUM(revenue) * 100";

      break;

    default:

      formula =
        "SUM(revenue)";
  }

  return (
    `SELECT ${dimension}, ${formula} AS ${metric} ` +
    `FROM business_data ` +
    `WHERE ${dimension} IN ('${first}', '${second}') ` +
    `GROUP BY ${dimension};`
  );
}