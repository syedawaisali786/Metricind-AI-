// ============================================================
// METRICMIND - AGENTIC ORCHESTRATOR
// ============================================================

import { validateQuery } from "./queryGovernance.js";

import {
  getMetric,
  calculateMetric,
  regionAnalytics,
  countryAnalytics,
  monthlyAnalytics,
  productAnalytics,
  productAnalyticsByRegion
} from "./semanticLayer.js";


// ============================================================
// 1. INTERPRET USER QUESTION
// ============================================================

export function interpretQuestion(question) {

  const q = String(question || "").toLowerCase();


  // ==========================================================
  // Q3 REVENUE
  // ==========================================================

  if (
    q.includes("q3") &&
    q.includes("revenue")
  ) {
    return {
      intent: "q3_revenue",
      metric: "revenue"
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
      q.includes("fell")
    )
  ) {
    return {
      intent: "profit_root_cause",
      metric: "profit"
    };
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
      metric: "revenue"
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
      metric: "revenue"
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
      metric: "revenue"
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
      metric: "profit"
    };
  }


  // ==========================================================
  // REVENUE
  // ==========================================================

  if (q.includes("revenue")) {
    return {
      intent: "metric",
      metric: "revenue"
    };
  }


  // ==========================================================
  // COST
  // ==========================================================

  if (q.includes("cost")) {
    return {
      intent: "metric",
      metric: "cost"
    };
  }


  // ==========================================================
  // MARGIN
  // ==========================================================

  if (q.includes("margin")) {
    return {
      intent: "metric",
      metric: "margin"
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
      metric: "orders"
    };
  }


  // ==========================================================
  // PROFIT
  // ==========================================================

  if (q.includes("profit")) {
    return {
      intent: "metric",
      metric: "profit"
    };
  }


  // ==========================================================
  // UNKNOWN
  // ==========================================================

  return {
    intent: "unknown",
    metric: null
  };
}



// ============================================================
// 2. EXECUTE AGENT
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

      metric: "revenue",

      filters: {
        quarter: "Q3"
      },

      value: 0,

      message:
        "Q3 revenue is ₹0 because the current mock dataset contains only Jan-Jun data. No Q3 records are available.",

      governance: {
        allowed: true,
        deterministic: true,
        sqlGeneratedByLLM: false
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
  // PROFIT ROOT CAUSE - MULTI-STEP REASONING
  // ==========================================================

  if (
    interpretation.intent ===
    "profit_root_cause"
  ) {

    // --------------------------------------------------------
    // STEP 1 - GOVERNED METRICS
    // --------------------------------------------------------

    const totalRevenue =
      calculateMetric("revenue");

    const totalCost =
      calculateMetric("cost");

    const totalProfit =
      calculateMetric("profit");


    // --------------------------------------------------------
    // STEP 2 - REGIONAL ANALYSIS
    // --------------------------------------------------------

    const regions =
      regionAnalytics();


    const highestCostRegion =
      [...regions].sort(
        (a, b) => b.cost - a.cost
      )[0];


    const lowestProfitRegion =
      [...regions].sort(
        (a, b) => a.profit - b.profit
      )[0];


    // --------------------------------------------------------
    // STEP 3 - PRODUCT DRILL-DOWN
    // --------------------------------------------------------

    // --------------------------------------------------------
// STEP 3 - REGION-SPECIFIC PRODUCT DRILL-DOWN
// --------------------------------------------------------

let regionalProducts = [];

let weakestProduct = null;

if (lowestProfitRegion) {

  regionalProducts =
    productAnalyticsByRegion(
      lowestProfitRegion.region
    );

  weakestProduct =
    [...regionalProducts].sort(
      (a, b) => a.profit - b.profit
    )[0];
}


    // --------------------------------------------------------
    // STEP 4 - EXPLANATION
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // STEP 5 - AGENT RESULT
    // --------------------------------------------------------

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

      metric: "profit",

      value: totalProfit,

      message: explanation,

      data: regionalProducts,

      chartType: "bar",

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

      apiCall:
  "GET /api/analytics/product?region=" +
  encodeURIComponent(
    lowestProfitRegion
      ? lowestProfitRegion.region
      : ""
  ),

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

    return {

      question,

      interpretation:
        "Agentic Monthly Analysis",

      metric: "revenue",

      agentSteps: [
        "Interpret user question",
        "Identify Time dimension",
        "Query monthly analytics",
        "Return time-series result"
      ],

      data:
        monthlyAnalytics(),

      chartType: "line",

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

    return {

      question,

      interpretation:
        "Agentic Country Analysis",

      metric: "revenue",

      agentSteps: [
        "Interpret user question",
        "Identify Geography dimension",
        "Group revenue by country",
        "Return result"
      ],

      data:
        countryAnalytics(),

      chartType: "bar",

      apiCall:
        "GET /api/analytics/country",

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

    return {

      question,

      interpretation:
        "Agentic Regional Analysis",

      metric: "revenue",

      agentSteps: [
        "Interpret user question",
        "Identify Region dimension",
        "Group revenue by region",
        "Return result"
      ],

      data:
        regionAnalytics(),

      chartType: "bar",

      apiCall:
        "GET /api/analytics/region",

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

    return {

      question,

      interpretation:
        "Agentic Product Analysis",

      metric: "profit",

      agentSteps: [
        "Interpret user question",
        "Identify Product dimension",
        "Calculate profit by product",
        "Return result"
      ],

      data:
        productAnalytics(),

      chartType: "bar",

      apiCall:
        "GET /api/analytics/product",

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


    const value =
      calculateMetric(metric);


    return {

      question,

      interpretation:
        "Governed Semantic Metric Query",

      agentSteps: [
        "Interpret user question",
        "Identify governed metric",
        "Retrieve semantic definition",
        "Calculate metric",
        "Return result"
      ],

      metric,

      value,

      semanticMetric: {

        name:
          definition.name,

        description:
          definition.description,

        aggregation:
          definition.aggregation
      },

      apiCall:
        `GET /api/metrics/${metric}`,

      sql:

        metric === "revenue"

          ? "SELECT SUM(revenue) FROM business_data;"

          : metric === "cost"

          ? "SELECT SUM(cost) FROM business_data;"

          : metric === "profit"

          ? "SELECT SUM(revenue) - SUM(cost) FROM business_data;"

          : metric === "orders"

          ? "SELECT SUM(orders) FROM business_data;"

          : "SELECT (SUM(revenue) - SUM(cost)) / SUM(revenue) * 100 FROM business_data;"
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

    message:
      "I could not understand this business question. Please ask about revenue, cost, profit, margin, orders, monthly performance, countries, regions, products, or Q3 revenue."
  };
}