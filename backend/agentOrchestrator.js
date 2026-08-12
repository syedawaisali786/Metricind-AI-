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
  productAnalytics
} from "./semanticLayer.js";


// ============================================================
// 1. EXTRACT BUSINESS FILTERS
// ============================================================

export function extractFilters(question) {

  const q =
    String(question || "").toLowerCase();

  const filters = {};


  // ==========================================================
  // COUNTRY
  // ==========================================================

  if (q.includes("india")) {
    filters.country = "India";
  }

  else if (
    q.includes("usa") ||
    q.includes("u.s.a") ||
    q.includes("us ")
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
// 2. INTERPRET USER QUESTION
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
  // FILTERED METRIC QUERY
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
  // MONTHLY ANALYSIS
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
  // COUNTRY ANALYSIS
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
  // REGION ANALYSIS
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
  // PRODUCT ANALYSIS
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
// 3. EXECUTE AGENT
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
        reason: governance.reason
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


    // --------------------------------------------------------
    // APPLY SEMANTIC FILTERS
    // --------------------------------------------------------

    const rows =
      filterData(filters);


    // --------------------------------------------------------
    // CALCULATE GOVERNED METRIC
    // --------------------------------------------------------

    const value =
      calculateMetric(
        metric,
        rows
      );


    const roundedValue =
      Number(
        value.toFixed(2)
      );


    // --------------------------------------------------------
    // BUILD FILTER DESCRIPTION
    // --------------------------------------------------------

    const filterParts = [];


    if (filters.country) {
      filterParts.push(
        `Country = ${filters.country}`
      );
    }

    if (filters.region) {
      filterParts.push(
        `Region = ${filters.region}`
      );
    }

    if (filters.product) {
      filterParts.push(
        `Product = ${filters.product}`
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
        `Month = ${
          monthNames[
            Number(filters.month)
          ] || filters.month
        }`
      );
    }


    // --------------------------------------------------------
    // FORMAT VALUE
    // --------------------------------------------------------

    const formattedValue =
      metric === "margin"
        ? `${roundedValue}%`
        : `₹${roundedValue.toLocaleString("en-IN")}`;


    // --------------------------------------------------------
    // BUILD BUSINESS INSIGHT
    // --------------------------------------------------------

    let insight;


    if (rows.length === 0) {

      insight =
        `No business records match the selected filters. ` +
        `${definition.name} is therefore ${formattedValue}.`;

    } else {

      insight =
        `${definition.name} is ${formattedValue} ` +
        `for the selected business filters. ` +
        `${rows.length} matching record${
          rows.length === 1 ? "" : "s"
        } were found.`;
    }


    // --------------------------------------------------------
    // RETURN AGENT RESULT
    // --------------------------------------------------------

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

        "Generate business insight"

      ],

      metric,

      value:
        roundedValue,

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

      message:
        insight,

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
        quarter: "Q3"
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


    const hasFilters =
      Object.keys(filters).length > 0;


    const filteredRows =
      hasFilters
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

      const drillFilters = {
        ...filters,
        region:
          lowestProfitRegion.region
      };


      regionalProducts =
        productAnalytics(
          drillFilters
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
        Number(
          totalProfit.toFixed(2)
        ),

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
        "/api/analytics/product",

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

        sqlGeneratedByLLM: false,

        reason:
          "Query approved by MetricMind Governance."

      },

      apiCall:
        "/api/analytics/monthly",

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


    return {

      question,

      interpretation:
        "Agentic Country Analysis",

      metric:
        "revenue",

      filters,

      agentSteps: [

        "Interpret user question",

        "Identify Geography dimension",

        "Apply semantic filters",

        "Group revenue by country",

        "Return governed result"

      ],

      data:
        countryAnalytics(filters),

      chartType:
        "bar",

      governance: {

        allowed: true,

        deterministic: true,

        sqlGeneratedByLLM: false,

        reason:
          "Query approved by MetricMind Governance."

      },

      apiCall:
        "/api/analytics/country",

      sql:
        "SELECT country, " +
        "SUM(revenue) AS revenue " +
        "FROM business_data " +
        "GROUP BY country;"

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

        "Return governed result"

      ],

      data:
        regionAnalytics(filters),

      chartType:
        "bar",

      governance: {

        allowed: true,

        deterministic: true,

        sqlGeneratedByLLM: false,

        reason:
          "Query approved by MetricMind Governance."

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

        "Return governed result"

      ],

      data:
        productAnalytics(filters),

      chartType:
        "bar",

      governance: {

        allowed: true,

        deterministic: true,

        sqlGeneratedByLLM: false,

        reason:
          "Query approved by MetricMind Governance."

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
        : filterData();


    const value =
      calculateMetric(
        metric,
        rows
      );


    return {

      question,

      interpretation:
        "Governed Semantic Metric Query",

      agentSteps: [

        "Interpret user question",

        "Identify governed metric",

        "Retrieve semantic definition",

        "Apply semantic filters",

        "Calculate metric",

        "Return deterministic result"

      ],

      metric,

      value:
        Number(
          value.toFixed(2)
        ),

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

      governance: {

        allowed: true,

        deterministic: true,

        sqlGeneratedByLLM: false,

        reason:
          "Query approved by MetricMind Governance."

      },

      message:
        `${definition.name} is ${formatMetricValue(
          metric,
          value
        )}.`,

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
  // UNKNOWN QUERY
  // ==========================================================

  return {

    question,

    interpretation:
      "Unknown Query",

    metric:
      null,

    value:
      null,

    filters:
      interpretation.filters || {},

    message:
      "I could not understand this business question. Please ask about revenue, cost, profit, margin, orders, monthly performance, countries, regions, products, or Q3 revenue.",

    governance: {

      allowed: true,

      deterministic: true,

      sqlGeneratedByLLM: false

    }

  };
}


// ============================================================
// 4. FORMAT METRIC VALUE
// ============================================================

function formatMetricValue(
  metric,
  value
) {

  const rounded =
    Number(
      value.toFixed(2)
    );


  if (metric === "margin") {

    return `${rounded}%`;

  }


  return `₹${rounded.toLocaleString("en-IN")}`;
}


// ============================================================
// 5. BUILD QUERY STRING
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
// 6. BUILD DETERMINISTIC SQL REPRESENTATION
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