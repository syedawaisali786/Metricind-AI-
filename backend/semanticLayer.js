// ============================================================
// METRICMIND - SEMANTIC LAYER
// Axlero-style governed metrics and dimensions
// ============================================================

import businessData from "./data.js";

// ============================================================
// GOVERNED METRICS
// ============================================================

const metrics = {
  revenue: {
    name: "Total Revenue",
    description: "Total business revenue",
    type: "number",
    aggregation: "SUM",
    calculate: (rows) =>
      rows.reduce((sum, row) => sum + Number(row.revenue || 0), 0)
  },

  cost: {
    name: "Total Cost",
    description: "Total business cost",
    type: "number",
    aggregation: "SUM",
    calculate: (rows) =>
      rows.reduce((sum, row) => sum + Number(row.cost || 0), 0)
  },

  profit: {
    name: "Total Profit",
    description: "Revenue minus cost",
    type: "number",
    aggregation: "CALCULATED",
    calculate: (rows) =>
      rows.reduce(
        (sum, row) =>
          sum + Number(row.revenue || 0) - Number(row.cost || 0),
        0
      )
  },

  margin: {
    name: "Profit Margin",
    description: "Profit divided by revenue",
    type: "percentage",
    aggregation: "CALCULATED",
    calculate: (rows) => {
      const revenue = rows.reduce(
        (sum, row) => sum + Number(row.revenue || 0),
        0
      );

      const cost = rows.reduce(
        (sum, row) => sum + Number(row.cost || 0),
        0
      );

      if (revenue === 0) return 0;

      return ((revenue - cost) / revenue) * 100;
    }
  },

  orders: {
    name: "Total Orders",
    description: "Total number of orders",
    type: "number",
    aggregation: "SUM",
    calculate: (rows) =>
      rows.reduce((sum, row) => sum + Number(row.orders || 0), 0)
  }
};

// ============================================================
// GOVERNED DIMENSIONS
// ============================================================

const dimensions = {
  time: {
    name: "Time",
    field: "date",
    type: "date"
  },

  geography: {
    name: "Geography",
    field: "country",
    type: "string"
  },

  country: {
    name: "Country",
    field: "country",
    type: "string"
  },

  region: {
    name: "Region",
    field: "region",
    type: "string"
  },

  product: {
    name: "Product",
    field: "product",
    type: "string"
  }
};

// ============================================================
// GET METRIC
// ============================================================

function getMetric(metricName) {
  if (!metricName) return null;

  return metrics[metricName.toLowerCase()] || null;
}

// ============================================================
// GET DIMENSION
// ============================================================

function getDimension(dimensionName) {
  if (!dimensionName) return null;

  return dimensions[dimensionName.toLowerCase()] || null;
}

// ============================================================
// CALCULATE METRIC
// ============================================================

function calculateMetric(metricName, rows = businessData) {
  const metric = getMetric(metricName);

  if (!metric) {
    throw new Error(`Unknown metric: ${metricName}`);
  }

  return metric.calculate(rows);
}

// ============================================================
// FILTER DATA
// ============================================================

function filterData(filters = {}) {
  let rows = [...businessData];

  if (filters.country) {
    rows = rows.filter(
      (row) =>
        row.country.toLowerCase() ===
        String(filters.country).toLowerCase()
    );
  }

  if (filters.region) {
    rows = rows.filter(
      (row) =>
        row.region.toLowerCase() ===
        String(filters.region).toLowerCase()
    );
  }

  if (filters.product) {
    rows = rows.filter(
      (row) =>
        row.product.toLowerCase() ===
        String(filters.product).toLowerCase()
    );
  }

  if (filters.month) {
    rows = rows.filter(
      (row) =>
        new Date(row.date).getMonth() + 1 ===
        Number(filters.month)
    );
  }

  return rows;
}

// ============================================================
// GROUP DATA
// ============================================================

function groupBy(rows, field) {
  const groups = {};

  rows.forEach((row) => {
    const key = row[field];

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(row);
  });

  return groups;
}

// ============================================================
// MONTHLY ANALYTICS
// ============================================================

function monthlyAnalytics() {
  const groups = groupBy(businessData, "date");

  return Object.entries(groups).map(([date, rows]) => ({
    month: date,
    orders: calculateMetric("orders", rows),
    revenue: calculateMetric("revenue", rows),
    cost: calculateMetric("cost", rows),
    profit: calculateMetric("profit", rows),
    margin: Number(calculateMetric("margin", rows).toFixed(2))
  }));
}

// ============================================================
// COUNTRY ANALYTICS
// ============================================================

function countryAnalytics() {
  const groups = groupBy(businessData, "country");

  return Object.entries(groups).map(([country, rows]) => ({
    country,
    orders: calculateMetric("orders", rows),
    revenue: calculateMetric("revenue", rows),
    cost: calculateMetric("cost", rows),
    profit: calculateMetric("profit", rows),
    margin: Number(calculateMetric("margin", rows).toFixed(2))
  }));
}

// ============================================================
// REGION ANALYTICS
// ============================================================

function regionAnalytics() {
  const groups = groupBy(businessData, "region");

  return Object.entries(groups).map(([region, rows]) => ({
    region,
    orders: calculateMetric("orders", rows),
    revenue: calculateMetric("revenue", rows),
    cost: calculateMetric("cost", rows),
    profit: calculateMetric("profit", rows),
    margin: Number(calculateMetric("margin", rows).toFixed(2))
  }));
}

// ============================================================
// PRODUCT ANALYTICS
// ============================================================

function productAnalytics() {
  const groups = groupBy(businessData, "product");

  return Object.entries(groups).map(([product, rows]) => ({
    product,
    orders: calculateMetric("orders", rows),
    revenue: calculateMetric("revenue", rows),
    cost: calculateMetric("cost", rows),
    profit: calculateMetric("profit", rows),
    margin: Number(calculateMetric("margin", rows).toFixed(2))
  }));
}

// ============================================================
// EXPORTS
// ============================================================

export {
  metrics,
  dimensions,
  getMetric,
  getDimension,
  calculateMetric,
  filterData,
  groupBy,
  monthlyAnalytics,
  countryAnalytics,
  regionAnalytics,
  productAnalytics
};