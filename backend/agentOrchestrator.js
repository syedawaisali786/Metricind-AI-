// ============================================================
// METRICMIND - AGENTIC ORCHESTRATOR
// Axlero-style governed natural-language BI
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
// 1. EXTRACT FILTERS
// ============================================================

function extractFilters(question) {
  const q = String(question || "").toLowerCase();

  const filters = {};

  // COUNTRY
  const countries = [
    {
      keywords: ["usa", "united states"],
      value: "USA"
    },
    {
      keywords: ["india", "indian"],
      value: "India"
    },
    {
      keywords: ["germany", "german"],
      value: "Germany"
    },
    {
      keywords: ["france", "french"],
      value: "France"
    }
  ];

  for (const item of countries) {
    if (item.keywords.some((k) => q.includes(k))) {
      filters.country = item.value;
      break;
    }
  }

  // REGION
  const regions = [
    {
      keywords: ["north america", "north american"],
      value: "North America"
    },
    {
      keywords: ["asia", "asian"],
      value: "Asia"
    },
    {
      keywords: ["europe", "european"],
      value: "Europe"
    }
  ];

  for (const item of regions) {
    if (item.keywords.some((k) => q.includes(k))) {
      filters.region = item.value;
      break;
    }
  }

  // PRODUCT
  const products = [
    {
      keywords: ["laptop", "laptops"],
      value: "Laptop"
    },
    {
      keywords: ["monitor", "monitors"],
      value: "Monitor"
    },
    {
      keywords: ["keyboard", "keyboards"],
      value: "Keyboard"
    }
  ];

  for (const item of products) {
    if (item.keywords.some((k) => q.includes(k))) {
      filters.product = item.value;
      break;
    }
  }
return filters;
}

// ============================================================
// 2. EXTRACT METRIC
// ============================================================

function extractMetric(question) {
  const q = String(question || "").toLowerCase();

  // IMPORTANT:
  // Check margin before profit because "profit margin"
  // contains the word profit.
  if (
    q.includes("margin") ||
    q.includes("profit margin")
  ) {
    return "margin";
  }

  if (
    q.includes("revenue") ||
    q.includes("sales")
  ) {
    return "revenue";
  }

  if (
    q.includes("cost") ||
    q.includes("expense")
  ) {
    return "cost";
  }

  if (
    q.includes("order") ||
    q.includes("orders")
  ) {
    return "orders";
  }

  if (
    q.includes("profit") ||
    q.includes("earnings")
  ) {
    return "profit";
  }

  return null;
}

// ============================================================
// 3. DETECT COMPARISON
// ============================================================

function detectComparison(question) {
  const q = String(question || "").toLowerCase();

  const highestWords = [
    "highest",
    "maximum",
    "max",
    "best",
    "most",
    "top"
  ];

  const lowestWords = [
    "lowest",
    "minimum",
    "min",
    "worst",
    "least"
  ];

  const isHighest =
    highestWords.some((word) =>
      q.includes(word)
    );

  const isLowest =
    lowestWords.some((word) =>
      q.includes(word)
    );

  if (!isHighest && !isLowest) {
    return null;
  }

  let dimension = null;

  if (
    q.includes("country") ||
    q.includes("countries")
  ) {
    dimension = "country";
  }

  else if (
    q.includes("region") ||
    q.includes("regional")
  ) {
    dimension = "region";
  }

  else if (
    q.includes("product") ||
    q.includes("products")
  ) {
    dimension = "product";
  }

  else if (
    q.includes("month") ||
    q.includes("monthly")
  ) {
    dimension = "month";
  }

  if (!dimension) {
    return null;
  }

  return {
    type: isHighest ? "highest" : "lowest",
    dimension
  };
}

// ============================================================
// 4. INTERPRET QUESTION
// ============================================================

export function interpretQuestion(question) {
  const q =
    String(question || "")
      .trim()
      .toLowerCase();

  const filters =
    extractFilters(question);

  const metric =
    extractMetric(question);

  const comparison =
    detectComparison(question);

  const directComparison =
    detectDirectComparison(question);

function detectDirectComparison(question) {
  const q = String(question || "").toLowerCase();

  const isComparison =
    q.includes("compare") ||
    q.includes(" vs ") ||
    q.includes(" versus ");

  if (!isComparison) {
    return null;
  }

  const entities = [];

  // COUNTRIES
  const countries = [
    { names: ["usa", "united states"], value: "USA" },
    { names: ["india", "indian"], value: "India" },
    { names: ["germany", "german"], value: "Germany" },
    { names: ["france", "french"], value: "France" }
  ];

  for (const country of countries) {
    if (
      country.names.some((name) =>
        q.includes(name)
      )
    ) {
      if (!entities.includes(country.value)) {
        entities.push(country.value);
      }
    }
  }

  // REGIONS
  const regions = [
    {
      names: ["north america", "north american"],
      value: "North America"
    },
    {
      names: ["asia", "asian"],
      value: "Asia"
    },
    {
      names: ["europe", "european"],
      value: "Europe"
    }
  ];

  for (const region of regions) {
    if (
      region.names.some((name) =>
        q.includes(name)
      )
    ) {
      if (!entities.includes(region.value)) {
        entities.push(region.value);
      }
    }
  }

  // PRODUCTS
  const products = [
    {
      names: ["laptop", "laptops"],
      value: "Laptop"
    },
    {
      names: ["monitor", "monitors"],
      value: "Monitor"
    },
    {
      names: ["keyboard", "keyboards"],
      value: "Keyboard"
    }
  ];

  for (const product of products) {
    if (
      product.names.some((name) =>
        q.includes(name)
      )
    ) {
      if (!entities.includes(product.value)) {
        entities.push(product.value);
      }
    }
  }

  if (entities.length < 2) {
    return null;
  }

  let dimension = null;

  if (
    entities.some((e) =>
      countries.some((c) => c.value === e)
    )
  ) {
    dimension = "country";
  }

  else if (
    entities.some((e) =>
      regions.some((r) => r.value === e)
    )
  ) {
    dimension = "region";
  }

  else if (
    entities.some((e) =>
      products.some((p) => p.value === e)
    )
  ) {
    dimension = "product";
  }

  return {
    dimension,
    entities: entities.slice(0, 2)
  };
}

  // ----------------------------------------------------------
  // Q3 REVENUE
  // ----------------------------------------------------------

  if (
    q.includes("q3") &&
    q.includes("revenue")
  ) {
    return {
      intent: "q3_revenue",
      metric: "revenue",
      filters: {
        quarter: "Q3"
      }
    };
  }

// ----------------------------------------------------------
// ROOT-CAUSE ANALYSIS
// ----------------------------------------------------------

const rootCauseWords = [
  "why",
  "decrease",
  "decreased",
  "down",
  "fall",
  "fell",
  "drop",
  "dropped",
  "decline",
  "declined",
  "reduced",
  "reduction",
  "worsened"
];

const isRootCauseQuestion =
  rootCauseWords.some((word) =>
    q.includes(word)
  );

// PROFIT ROOT CAUSE
if (
  q.includes("profit") &&
  isRootCauseQuestion
) {
  return {
    intent: "profit_root_cause",
    metric: "profit",
    filters
  };
}

// MARGIN ROOT CAUSE
if (
  q.includes("margin") &&
  isRootCauseQuestion
) {
  return {
    intent: "margin_root_cause",
    metric: "margin",
    filters
  };
}

  // ----------------------------------------------------------
// DIRECT ENTITY COMPARISON
// ----------------------------------------------------------

if (directComparison && metric) {
  return {
    intent: "comparison",
    metric,
    comparison: {
      type: "direct",
      dimension:
        directComparison.dimension,
      entities:
        directComparison.entities
    },
    filters
  };
}
  // ----------------------------------------------------------
  // COMPARISON
  // ----------------------------------------------------------

  if (
    comparison &&
    metric
  ) {
    return {
      intent: "comparison",
      metric,
      comparison,
      filters
    };
  }

  // ----------------------------------------------------------
  // FILTERED METRIC
  // ----------------------------------------------------------

  if (
    metric &&
    Object.keys(filters).length > 0
  ) {
    return {
      intent: "filtered_metric",
      metric,
      filters
    };
  }

  // ----------------------------------------------------------
  // MONTHLY ANALYSIS
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // COUNTRY ANALYSIS
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // REGION ANALYSIS
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // PRODUCT ANALYSIS
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // SINGLE METRIC
  // ----------------------------------------------------------

  if (metric) {
    return {
      intent: "metric",
      metric,
      filters
    };
  }

  // ----------------------------------------------------------
  // UNKNOWN
  // ----------------------------------------------------------

  return {
    intent: "unknown",
    metric: null,
    filters: {}
  };
}

// ============================================================
// 5. FILTER DESCRIPTION
// ============================================================

function buildFilterDescription(filters = {}) {
  const parts = [];

  if (filters.country) {
    parts.push(
      `country = ${filters.country}`
    );
  }

  if (filters.region) {
    parts.push(
      `region = ${filters.region}`
    );
  }

  if (filters.product) {
    parts.push(
      `product = ${filters.product}`
    );
  }

  if (filters.month) {
    parts.push(
      `month = ${filters.month}`
    );
  }

  if (filters.quarter) {
    parts.push(
      `quarter = ${filters.quarter}`
    );
  }

  return parts.length
    ? parts.join(", ")
    : "No filters";
}

// ============================================================
// 6. SQL BUILDER
// ============================================================

function buildFilteredSQL(
  metric,
  filters = {}
) {
  let expression;

  if (metric === "revenue") {
    expression = "SUM(revenue)";
  }

  else if (metric === "cost") {
    expression = "SUM(cost)";
  }
  else if (metric === "profit") {
    expression =
      "SUM(revenue) - SUM(cost)";
  }

  else if (metric === "orders") {
    expression = "SUM(orders)";
  }

  else if (metric === "margin") {
    expression =
      "((SUM(revenue) - SUM(cost)) / SUM(revenue)) * 100";
  }

  else {
    expression = "UNKNOWN_METRIC";
  }

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

  const whereClause =
    conditions.length > 0
      ? ` WHERE ${conditions.join(" AND ")}`
      : "";

  return (
    `SELECT ${expression} AS ${metric} ` +
    `FROM business_data${whereClause};`
  );
}

// ============================================================
// 7. SQL METRIC HELPER
// ============================================================

function getSQLMetric(metric) {
  if (metric === "revenue") {
    return "SUM(revenue) AS revenue";
  }

  if (metric === "cost") {
    return "SUM(cost) AS cost";
  }

  if (metric === "profit") {
    return (
      "SUM(revenue) - SUM(cost) AS profit"
    );
  }

  if (metric === "orders") {
    return "SUM(orders) AS orders";
  }

  if (metric === "margin") {
    return (
      "((SUM(revenue) - SUM(cost)) / " +
      "SUM(revenue)) * 100 AS margin"
    );
  }

  return "*";
}

// ============================================================
// 8. Q3 REVENUE
// ============================================================

function executeQ3Revenue(question) {
  return {
    question,

    interpretation:
      "Governed Q3 Revenue Query",

    agentSteps: [
      "Interpret user question",
      "Identify Revenue metric",
      "Apply Q3 quarter filter",
      "Query governed Semantic Layer",
      "Return deterministic result"
    ],

    metric: "revenue",

    filters: {
      quarter: "Q3"
    },

    value: 0,

    message:
      "Q3 revenue is ₹0 because the current mock dataset contains only January-June data. No Q3 records are available.",

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

// ============================================================
// 9. PROFIT ROOT-CAUSE ANALYSIS
// ============================================================

function executeProfitRootCause(
  question,
  filters = {},
  requestedMetric = "profit"
) {
  console.log("🔥 EXECUTE PROFIT ROOT CAUSE CALLED");
  const rootCauseFilters = { ...filters };

if (
  !question.match(
    /\b(january|february|march|april|may|june|july|august|september|october|november|december|month)\b/i
  )
) {
  delete rootCauseFilters.month;
}

const totalRows =
  filterData(rootCauseFilters);
  console.log("DEBUG FIRST ROW:", totalRows[0]);

  const totalShippingCost = totalRows.reduce(
  (sum, row) => sum + Number(row.shippingCost || 0),
  0
);

const totalMaterialCost = totalRows.reduce(
  (sum, row) => sum + Number(row.materialCost || 0),
  0
);

console.log("TOTAL SHIPPING COST:", totalShippingCost);
console.log("TOTAL MATERIAL COST:", totalMaterialCost);

console.log(
  "ROOT CAUSE ROWS:",
  totalRows.length
);

  const totalRevenue =
    calculateMetric(
      "revenue",
      totalRows
    );

  const totalCost =
    calculateMetric(
      "cost",
      totalRows
    );

  const totalProfit =
    calculateMetric(
      "profit",
      totalRows
    );

    const totalMargin =
  calculateMetric(
    "margin",
    totalRows
  );

  const regions =
    regionAnalytics(filters);

  const highestCostRegion =
    [...regions].sort(
      (a, b) => b.cost - a.cost
    )[0];

  const lowestProfitRegion =
    [...regions].sort(
      (a, b) => a.profit - b.profit
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
        (a, b) => a.profit - b.profit
      )[0];
  }

  let rootCause = null;

  if (
    weakestProduct &&
    lowestProfitRegion
  ) {
    const rows =
      filterData({
        region:
          lowestProfitRegion.region,

        product:
          weakestProduct.product
      });

    const shippingCost = totalRows.reduce(
  (sum, row) => sum + Number(row.shippingCost || 0),
  0
);

const materialCost = totalRows.reduce(
  (sum, row) => sum + Number(row.materialCost || 0),
  0
);

    rootCause = {
      shippingCost,
      materialCost,
      totalCost:
        shippingCost +
        materialCost
    };
console.log("DEBUG SHIPPING COST:", shippingCost);
console.log("DEBUG MATERIAL COST:", materialCost);
console.log("DEBUG ROOT CAUSE:", rootCause);
  }
let message =
  `Total revenue is ₹${totalRevenue.toLocaleString("en-IN")}, ` +
  `while total cost is ₹${totalCost.toLocaleString("en-IN")}, ` +
  `resulting in profit of ₹${totalProfit.toLocaleString("en-IN")} ` +
  `and a margin of ${totalMargin.toFixed(2)}%. `;

  if (highestCostRegion) {
    message +=
      `${highestCostRegion.region} has the highest regional cost ` +
      `at ₹${highestCostRegion.cost.toLocaleString("en-IN")}. `;
  }

  if (lowestProfitRegion) {
    message +=
      `${lowestProfitRegion.region} has the lowest regional profit ` +
      `at ₹${lowestProfitRegion.profit.toLocaleString("en-IN")}. `;
  }

  if (weakestProduct) {
    message +=
      `Within ${lowestProfitRegion.region}, ` +
      `${weakestProduct.product} has the lowest product profit ` +
      `at ₹${weakestProduct.profit.toLocaleString("en-IN")}. `;
  }

  if (rootCause) {
    message +=
      `Its shipping cost is ₹${totalShippingCost.toLocaleString("en-IN")} ` +
      `and material cost is ₹${totalMaterialCost.toLocaleString("en-IN")}.`;
  }
console.log("FINAL SHIPPING:", totalShippingCost);
console.log("FINAL MATERIAL:", totalMaterialCost);

  return {
    question,

    interpretation:
  requestedMetric === "margin"
    ? "Agentic Multi-Step Margin Root-Cause Analysis"
    : "Agentic Multi-Step Profit Root-Cause Analysis",

    agentSteps: [
      "Interpret user question",
      "Apply business filters",
      "Retrieve governed profit metric",
      "Calculate total revenue",
      "Calculate total cost",
      "Calculate total profit",
      "Query regional performance",
      "Identify highest-cost region",
      "Identify lowest-profit region",
      "Drill down into product performance",
      "Identify weakest product",
      "Analyze shipping cost",
      "Analyze material cost",
      "Generate root-cause explanation"
    ],

    metric: requestedMetric,

value:
  requestedMetric === "margin"
    ? Number(totalMargin.toFixed(2))
    : totalProfit,

    message,

    data: regionalProducts,

    rootCause,

    chartType: "bar",

    drillDown: {
      margin:
  Number(totalMargin.toFixed(2)),

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
          : null,

      shippingCost:totalShippingCost,


      materialCost:totalMaterialCost
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

// ============================================================
// 10. COMPARISON EXECUTOR
// ============================================================

function executeComparison(
  question,
  interpretation
) {
  // ==========================================================
  // DIRECT ENTITY COMPARISON
  // ==========================================================

  if (
    interpretation.comparison &&
    interpretation.comparison.type === "direct"
  ) {

    const {
  dimension,
  entities
} = interpretation.comparison;

const metric =
  interpretation.metric;

  const filters =
  interpretation.filters || {};

    const results = [];

    for (const entity of entities) {

      const entityFilters = {};

      if (dimension === "country") {
        entityFilters.country = entity;
      }

      else if (dimension === "region") {
        entityFilters.region = entity;
      }

      else if (dimension === "product") {
        entityFilters.product = entity;
      }

      const rows =
        filterData(entityFilters);

      const value =
        calculateMetric(
          metric,
          rows
        );

      results.push({
        [dimension]: entity,
        [metric]: value
      });
    }

    const first =
      results[0];

    const second =
      results[1];

    const difference =
      Number(first[metric] || 0) -
      Number(second[metric] || 0);

    const higher =
      difference >= 0
        ? first
        : second;

    const lower =
      difference >= 0
        ? second
        : first;

    const higherValue =
      Number(higher[metric] || 0);

    const lowerValue =
      Number(lower[metric] || 0);

    const percentageDifference =
      lowerValue !== 0
        ? (difference / lowerValue) * 100
        : 0;

    const formattedHigher =
      metric === "margin"
        ? `${higherValue.toFixed(2)}%`
        : `₹${higherValue.toLocaleString("en-IN")}`;

    const formattedLower =
      metric === "margin"
        ? `${lowerValue.toFixed(2)}%`
        : `₹${lowerValue.toLocaleString("en-IN")}`;

    const differenceFormatted =
      metric === "margin"
        ? `${Math.abs(difference).toFixed(2)}%`
        : `₹${Math.abs(difference).toLocaleString("en-IN")}`;

    const percentageFormatted =
  `${percentageDifference.toFixed(2)}%`;    

    return {

      question,

      interpretation:
        `Agentic Direct ${dimension} Comparison`,

      agentSteps: [
        "Interpret user question",
        "Identify comparison request",
        `Identify ${dimension} entities`,
        `Identify ${metric} metric`,
        "Apply entity-specific filters",
        "Calculate deterministic metrics",
        "Compare both entities",
        "Calculate difference",
        "Generate business insight"
      ],

      metric,

      comparison: {
        type: "direct",
        dimension,
        entities
      },

      filters,

      data: results,

      value: higherValue,
      percentage: percentageFormatted,

      message:
        `${higher[dimension]} has higher ${metric} ` +
        `at ${formattedHigher}, while ` +
        `${lower[dimension]} has ${formattedLower}. ` +
        `The difference is ${differenceFormatted}.` +
        ` (${percentageFormatted} difference)`,

      chartType: "bar",

      governance: {
        allowed: true,
        deterministic: true,
        sqlGeneratedByLLM: false
      },

      apiCall:
        `GET /api/analytics/${dimension}`,

      sql:
        `SELECT ${dimension}, ` +
        `${getSQLMetric(metric)} ` +
        `FROM business_data ` +
        `WHERE ${dimension} IN (` +
        entities
          .map((e) => `'${e}'`)
          .join(", ") +
        `) ` +
        `GROUP BY ${dimension};`
    };
  }
  const {
    metric,
    comparison,
    filters = {}
  } = interpretation;

  let data = [];

  // ----------------------------------------------------------
  // COUNTRY
  // ----------------------------------------------------------

  if (
    comparison.dimension === "country"
  ) {
    data =
      countryAnalytics(filters);
  }

  // ----------------------------------------------------------
  // REGION
  // ----------------------------------------------------------

  else if (
    comparison.dimension === "region"
  ) {
    data =
      regionAnalytics(filters);
  }

  // ----------------------------------------------------------
  // PRODUCT
  // ----------------------------------------------------------

  else if (
    comparison.dimension === "product"
  ) {
    data =
      productAnalytics(filters);
  }

  // ----------------------------------------------------------
  // MONTH
  // ----------------------------------------------------------

  else if (
    comparison.dimension === "month"
  ) {
    data =
      monthlyAnalytics(filters);
  }

  if (
    !data ||
    data.length === 0
  ) {
    return {
      question,

      interpretation:
        "Governed Comparison Query",

      metric,

      filters,

      value: null,

      message:
        "No business data is available for the requested comparison.",

      data: [],

      chartType: "bar",

      governance: {
        allowed: true,
        deterministic: true,
        sqlGeneratedByLLM: false
      }
    };
  }

  // ----------------------------------------------------------
  // SORT
  // ----------------------------------------------------------

  const sortedData =
    [...data].sort(
      (a, b) => {
        const aValue =
          Number(a[metric] || 0);

        const bValue =
          Number(b[metric] || 0);

        if (
          comparison.type ===
          "highest"
        ) {
          return bValue - aValue;
        }

        return aValue - bValue;
      }
    );

  const winner =
    sortedData[0];

  // ----------------------------------------------------------
  // DIMENSION NAME
  // ----------------------------------------------------------

  let dimensionName = "";

  if (
    comparison.dimension ===
    "country"
  ) {
    dimensionName =
      winner.country;
  }

  else if (
    comparison.dimension ===
    "region"
  ) {
    dimensionName =
      winner.region;
  }

  else if (
    comparison.dimension ===
    "product"
  ) {
    dimensionName =
      winner.product;
  }

  else if (
    comparison.dimension ===
    "month"
  ) {
    dimensionName =
      winner.month;
  }

  const winnerValue =
    Number(
      winner[metric] || 0
    );

  const formattedValue =
    metric === "margin"
      ? `${winnerValue.toFixed(2)}%`
      : `₹${winnerValue.toLocaleString("en-IN")}`;

  const comparisonWord =
    comparison.type ===
    "highest"
      ? "highest"
      : "lowest";

  const dimensionLabel =
    comparison.dimension ===
    "month"
      ? "month"
      : comparison.dimension;

  const message =
    `${dimensionName} has the ${comparisonWord} ` +
    `${metric} among all ${dimensionLabel}s ` +
    `at ${formattedValue}.`;

  // ----------------------------------------------------------
  // SQL
  // ----------------------------------------------------------

  let sql = "";

  if (
    comparison.dimension ===
    "country"
  ) {
    sql =
      `SELECT country, ${getSQLMetric(metric)} ` +
      `FROM business_data ` +
      `GROUP BY country ` +
      `ORDER BY ${metric} ` +
      `${
        comparison.type === "highest"
          ? "DESC"
          : "ASC"
      } LIMIT 1;`;
  }

  else if (
    comparison.dimension ===
    "region"
  ) {
    sql =
      `SELECT region, ${getSQLMetric(metric)} ` +
      `FROM business_data ` +
      `GROUP BY region ` +
      `ORDER BY ${metric} ` +
      `${
        comparison.type === "highest"
          ? "DESC"
          : "ASC"
      } LIMIT 1;`;
  }

  else if (
    comparison.dimension ===
    "product"
  ) {
    sql =
      `SELECT product, ${getSQLMetric(metric)} ` +
      `FROM business_data ` +
      `GROUP BY product ` +
      `ORDER BY ${metric} ` +
      `${
        comparison.type === "highest"
          ? "DESC"
          : "ASC"
      } LIMIT 1;`;
  }

  else {
    sql =
      `SELECT date, ${getSQLMetric(metric)} ` +
      `FROM business_data ` +
      `GROUP BY date ` +
      `ORDER BY ${metric} ` +
      `${
        comparison.type === "highest"
          ? "DESC"
          : "ASC"
      } LIMIT 1;`;
  }

  const apiCall =
    comparison.dimension ===
    "country"
      ? "GET /api/analytics/country"
      : comparison.dimension ===
        "region"
      ? "GET /api/analytics/region"
      : comparison.dimension ===
        "product"
      ? "GET /api/analytics/product"
      : "GET /api/analytics/monthly";

  return {
    question,

    interpretation:
      `Agentic ${
        comparison.type === "highest"
          ? "Highest"
          : "Lowest"
      } ${metric} Comparison`,

    agentSteps: [
      "Interpret user question",
      `Identify ${comparison.dimension} dimension`,
      `Identify ${metric} metric`,
      `Retrieve governed ${comparison.dimension} analytics`,
      `Compare ${metric} across all ${comparison.dimension}s`,
      `Identify ${comparisonWord} performing ${comparison.dimension}`,
      "Generate business insight",
      "Return deterministic result"
    ],

    metric,

    comparison: {
      type:
        comparison.type,

      dimension:
        comparison.dimension
    },

    filters,

    winner: {
      dimension:
        dimensionName,

      value:
        winnerValue
    },

    value:
      winnerValue,

    formattedValue,

    message,

    data:
      sortedData,

    chartType:
      "bar",

    governance: {
      allowed: true,
      deterministic: true,
      sqlGeneratedByLLM: false
    },

    apiCall,

    sql
  };
}

// ============================================================
// 11. MONTHLY ANALYSIS
// ============================================================

function executeMonthlyAnalysis(
  question,
  filters
) {
  return {
    question,

    interpretation:
      "Agentic Monthly Analysis",

    metric: "revenue",

    filters,

    agentSteps: [
      "Interpret user question",
      "Identify Time dimension",
      "Apply available filters",
      "Query monthly analytics",
      "Return time-series result"
    ],

    data:
      monthlyAnalytics(
        filters || {}
      ),

    chartType:
      "line",

    apiCall:
      "GET /api/analytics/monthly",

    sql:
      "SELECT date, " +
      "SUM(revenue) AS revenue, " +
      "SUM(cost) AS cost, " +
      "SUM(revenue - cost) AS profit " +
      "FROM business_data " +
      "GROUP BY date;"
  };
}

// ============================================================
// 12. COUNTRY ANALYSIS
// ============================================================

function executeCountryAnalysis(
  question,
  filters
) {
  return {
    question,

    interpretation:
      "Agentic Country Analysis",

    metric: "revenue",

    filters,

    agentSteps: [
      "Interpret user question",
      "Identify Geography dimension",
      "Apply available filters",
      "Group revenue by country",
      "Return result"
    ],

    data:
      countryAnalytics(
        filters || {}
      ),

    chartType:
      "bar",

    apiCall:
      "GET /api/analytics/country",

    sql:
      "SELECT country, " +
      "SUM(revenue) AS revenue " +
      "FROM business_data " +
      "GROUP BY country;"
  };
}

// ============================================================
// 13. REGION ANALYSIS
// ============================================================

function executeRegionAnalysis(
  question,
  filters
) {
  return {
    question,

    interpretation:
      "Agentic Regional Analysis",

    metric: "revenue",

    filters,

    agentSteps: [
      "Interpret user question",
      "Identify Region dimension",
      "Apply available filters",
      "Group revenue by region",
      "Return result"
    ],

    data:
      regionAnalytics(
        filters || {}
      ),

    chartType:
      "bar",

    apiCall:
      "GET /api/analytics/region",

    sql:
      "SELECT region, " +
      "SUM(revenue) AS revenue " +
      "FROM business_data " +
      "GROUP BY region;"
  };
}

// ============================================================
// 14. PRODUCT ANALYSIS
// ============================================================

function executeProductAnalysis(
  question,
  filters
) {
  return {
    question,

    interpretation:
      "Agentic Product Analysis",

    metric: "profit",

    filters,

    agentSteps: [
      "Interpret user question",
      "Identify Product dimension",
      "Apply available filters",
      "Calculate profit by product",
      "Return result"
    ],

    data:
      productAnalytics(
        filters || {}
      ),

    chartType:
      "bar",

    apiCall:
      "GET /api/analytics/product",

    sql:
      "SELECT product, " +
      "SUM(revenue) - SUM(cost) AS profit " +
      "FROM business_data " +
      "GROUP BY product;"
  };
}

// ============================================================
// 15. SINGLE METRIC
// ============================================================

function executeSingleMetric(
  question,
  metric
) {
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
        "The requested metric is not available."
    };
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

        : "SELECT ((SUM(revenue) - SUM(cost)) / SUM(revenue)) * 100 FROM business_data;"
  };
}

// ============================================================
// 16. FILTERED METRIC
// ============================================================

function executeFilteredMetric(
  question,
  metric,
  filters
) {
  const rows =
    filterData(filters);

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
        "The requested metric is not available."
    };
  }

  const value =
    calculateMetric(
      metric,
      rows
    );

  const filterDescription =
    buildFilterDescription(
      filters
    );

  let formattedValue;

  if (metric === "margin") {
    formattedValue =
      `${Number(
        value.toFixed(2)
      )}%`;
  }

  else {
    formattedValue =
      `₹${value.toLocaleString("en-IN")}`;
  }

  return {
    question,

    interpretation:
      "Governed Filtered Metric Query",

    agentSteps: [
      "Interpret user question",
      "Extract metric",
      "Extract business filters",
      "Validate query through governance",
      "Apply filters through Semantic Layer",
      "Calculate deterministic metric",
      "Return structured result"
    ],

    metric,

    filters,

    rowsMatched:
      rows.length,

    value,

    formattedValue,

    message:
      rows.length === 0
        ? `No business data was found for ${filterDescription}.`
        : `${definition.name} for ${filterDescription} is ${formattedValue}.`,

    semanticMetric: {
      name:
        definition.name,

      description:
        definition.description,

      aggregation:
        definition.aggregation
    },

    chartType:
      "card",

    governance: {
      allowed: true,
      deterministic: true,
      sqlGeneratedByLLM: false
    },

    apiCall:
      `GET /api/metrics/${metric}?` +
      new URLSearchParams(
        filters
      ).toString(),

    sql:
      buildFilteredSQL(
        metric,
        filters
      )
  };
}

// ============================================================
// 17. MAIN EXECUTE AGENT
// ============================================================

export function executeAgent(question) {
  question =
    String(question || "")
      .trim();

  // ----------------------------------------------------------
  // EMPTY QUESTION
  // ----------------------------------------------------------

  if (!question) {
    return {
      question: "",

      interpretation:
        "Invalid Query",

      metric: null,

      value: null,

      message:
        "Please enter a business question."
    };
  }

  // ----------------------------------------------------------
  // QUESTION LENGTH
  // ----------------------------------------------------------

  if (question.length > 200) {
    return {
      question,

      interpretation:
        "Query Rejected by Governance",

      metric: null,

      value: null,

      message:
        "Question is too long. Please keep it under 200 characters.",

      governance: {
        allowed: false,
        reason:
          "Question exceeds maximum length."
      }
    };
  }

  // ----------------------------------------------------------
  // INTERPRET
  // ----------------------------------------------------------

  const interpretation =
    interpretQuestion(question);

  // ----------------------------------------------------------
  // GOVERNANCE
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // COMPARISON
  // ----------------------------------------------------------

  if (
    interpretation.intent ===
    "comparison"
  ) {
    return executeComparison(
      question,
      interpretation
    );
  }

  // ----------------------------------------------------------
  // Q3
  // ----------------------------------------------------------

  if (
    interpretation.intent ===
    "q3_revenue"
  ) {
    return executeQ3Revenue(
      question
    );
  }

  // ----------------------------------------------------------
// PROFIT / MARGIN ROOT CAUSE
// ----------------------------------------------------------

if (
  interpretation.intent ===
    "profit_root_cause" ||
  interpretation.intent ===
    "margin_root_cause"
) {
  
  return executeProfitRootCause(
    question,
    interpretation.filters,
    interpretation.metric
  );
}

  // ----------------------------------------------------------
  // MONTHLY
  // ----------------------------------------------------------

  if (
    interpretation.intent ===
    "monthly_analysis"
  ) {
    return executeMonthlyAnalysis(
      question,
      interpretation.filters
    );
  }

  // ----------------------------------------------------------
  // COUNTRY
  // ----------------------------------------------------------

  if (
    interpretation.intent ===
    "country_analysis"
  ) {
    return executeCountryAnalysis(
      question,
      interpretation.filters
    );
  }

  // ----------------------------------------------------------
  // REGION
  // ----------------------------------------------------------

  if (
    interpretation.intent ===
    "region_analysis"
  ) {
    return executeRegionAnalysis(
      question,
      interpretation.filters
    );
  }

  // ----------------------------------------------------------
  // PRODUCT
  // ----------------------------------------------------------

  if (
    interpretation.intent ===
    "product_analysis"
  ) {
    return executeProductAnalysis(
      question,
      interpretation.filters
    );
  }

  // ----------------------------------------------------------
  // FILTERED METRIC
  // ----------------------------------------------------------

  if (
    interpretation.intent ===
    "filtered_metric"
  ) {
    return executeFilteredMetric(
      question,
      interpretation.metric,
      interpretation.filters
    );
  }

  // ----------------------------------------------------------
  // SINGLE METRIC
  // ----------------------------------------------------------

  if (
    interpretation.intent ===
    "metric"
  ) {
    return executeSingleMetric(
      question,
      interpretation.metric
    );
  }

  // ----------------------------------------------------------
  // UNKNOWN
  // ----------------------------------------------------------

  return {
    question,

    interpretation:
      "Unknown Query",

    metric: null,

    value: null,

    message:
      "I could not understand this business question. Please ask about revenue, cost, profit, margin, orders, monthly performance, countries, regions, products, comparisons, or filtered metrics.",

    governance: {
      allowed: true,
      deterministic: true
    }
  };
}