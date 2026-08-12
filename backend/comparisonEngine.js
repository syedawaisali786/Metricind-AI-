// ============================================================
// METRICMIND - COMPARISON ENGINE
// Deterministic business comparison and ranking engine
// ============================================================

import {
  calculateMetric,
  countryAnalytics,
  regionAnalytics,
  productAnalytics,
  filterData
} from "./semanticLayer.js";

// ============================================================
// FORMAT VALUE
// ============================================================

function formatValue(value, metric) {
  const number = Number(value || 0);

  if (metric === "margin") {
    return `${number.toFixed(2)}%`;
  }

  return `₹${number.toLocaleString("en-IN")}`;
}

// ============================================================
// GET METRIC VALUE
// ============================================================

function getMetricValue(rows, metric) {
  return Number(
    calculateMetric(metric, rows)
  );
}

// ============================================================
// COMPARE TWO FILTERS
// ============================================================

function compareFilters(
  firstFilters,
  secondFilters,
  metric = "revenue"
) {
  const firstRows =
    filterData(firstFilters);

  const secondRows =
    filterData(secondFilters);

  const firstValue =
    getMetricValue(
      firstRows,
      metric
    );

  const secondValue =
    getMetricValue(
      secondRows,
      metric
    );

  let winner = "tie";

  if (firstValue > secondValue) {
    winner = "first";
  }

  if (secondValue > firstValue) {
    winner = "second";
  }

  const difference =
    Math.abs(
      firstValue - secondValue
    );

  return {
    metric,

    first: {
      filters: firstFilters,
      value: Number(
        firstValue.toFixed(2)
      ),
      formatted:
        formatValue(
          firstValue,
          metric
        )
    },

    second: {
      filters: secondFilters,
      value: Number(
        secondValue.toFixed(2)
      ),
      formatted:
        formatValue(
          secondValue,
          metric
        )
    },

    winner,

    difference: Number(
      difference.toFixed(2)
    ),

    differenceFormatted:
      formatValue(
        difference,
        metric
      )
  };
}

// ============================================================
// RANK COUNTRIES
// ============================================================

function rankCountries(
  metric = "revenue",
  filters = {}
) {
  const data =
    countryAnalytics(filters);

  return [...data]
    .sort(
      (a, b) =>
        Number(b[metric] || 0) -
        Number(a[metric] || 0)
    )
    .map(
      (item, index) => ({
        rank: index + 1,
        country: item.country,
        revenue: item.revenue,
        cost: item.cost,
        profit: item.profit,
        margin: item.margin,
        orders: item.orders
      })
    );
}

// ============================================================
// RANK REGIONS
// ============================================================

function rankRegions(
  metric = "revenue",
  filters = {}
) {
  const data =
    regionAnalytics(filters);

  return [...data]
    .sort(
      (a, b) =>
        Number(b[metric] || 0) -
        Number(a[metric] || 0)
    )
    .map(
      (item, index) => ({
        rank: index + 1,
        region: item.region,
        revenue: item.revenue,
        cost: item.cost,
        profit: item.profit,
        margin: item.margin,
        orders: item.orders
      })
    );
}

// ============================================================
// RANK PRODUCTS
// ============================================================

function rankProducts(
  metric = "profit",
  filters = {}
) {
  const data =
    productAnalytics(filters);

  return [...data]
    .sort(
      (a, b) =>
        Number(b[metric] || 0) -
        Number(a[metric] || 0)
    )
    .map(
      (item, index) => ({
        rank: index + 1,
        product: item.product,
        revenue: item.revenue,
        cost: item.cost,
        profit: item.profit,
        margin: item.margin,
        orders: item.orders
      })
    );
}

// ============================================================
// FIND TOP COUNTRY
// ============================================================

function topCountry(
  metric = "revenue",
  filters = {}
) {
  const ranked =
    rankCountries(
      metric,
      filters
    );

  return ranked[0] || null;
}

// ============================================================
// FIND TOP REGION
// ============================================================

function topRegion(
  metric = "profit",
  filters = {}
) {
  const ranked =
    rankRegions(
      metric,
      filters
    );

  return ranked[0] || null;
}

// ============================================================
// FIND TOP PRODUCT
// ============================================================

function topProduct(
  metric = "profit",
  filters = {}
) {
  const ranked =
    rankProducts(
      metric,
      filters
    );

  return ranked[0] || null;
}

// ============================================================
// BUILD COMPARISON EXPLANATION
// ============================================================

function buildComparisonMessage(
  comparison,
  firstName,
  secondName
) {
  const {
    metric,
    first,
    second,
    winner
  } = comparison;

  if (winner === "tie") {
    return (
      `${firstName} and ${secondName} have the same ` +
      `${metric} of ${first.formatted}.`
    );
  }

  const winnerName =
    winner === "first"
      ? firstName
      : secondName;

  const winnerValue =
    winner === "first"
      ? first.formatted
      : second.formatted;

  const loserName =
    winner === "first"
      ? secondName
      : firstName;

  const loserValue =
    winner === "first"
      ? second.formatted
      : first.formatted;

  return (
    `${winnerName} has higher ${metric} at ` +
    `${winnerValue}, compared with ` +
    `${loserName} at ${loserValue}.`
  );
}

// ============================================================
// MAIN COMPARISON ENGINE
// ============================================================

function compareBusinessData({
  firstFilters = {},
  secondFilters = {},
  firstName = "First",
  secondName = "Second",
  metric = "revenue"
}) {
  const comparison =
    compareFilters(
      firstFilters,
      secondFilters,
      metric
    );

  return {
    type: "comparison",

    metric,

    comparison,

    message:
      buildComparisonMessage(
        comparison,
        firstName,
        secondName
      ),

    governance: {
      deterministic: true,
      semanticLayer: true,
      sqlGeneratedByLLM: false
    }
  };
}

// ============================================================
// EXPORTS
// ============================================================

export {
  compareBusinessData,
  compareFilters,
  rankCountries,
  rankRegions,
  rankProducts,
  topCountry,
  topRegion,
  topProduct
};