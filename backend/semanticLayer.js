// ============================================================
// METRICMIND - SEMANTIC LAYER
// Axlero-style governed metrics and dimensions
// ============================================================

import businessData from "./data.js";

// ============================================================
// SNOWFLAKE / DATA SOURCE NORMALIZATION
// ============================================================

function setBusinessData(rows = []) {
  businessData.splice(
    0,
    businessData.length,
    ...rows.map((row) => {

      const shippingCost = Number(
        row.SHIPPING_COST ??
        row.shipping_cost ??
        row.shippingCost ??
        0
      );

      const materialCost = Number(
        row.MATERIAL_COST ??
        row.material_cost ??
        row.materialCost ??
        0
      );

      return {
        id:
          row.ID ??
          row.id,

        date:
          row.DATE ??
          row.date,

        country:
          row.COUNTRY ??
          row.country,

        region:
          row.REGION ??
          row.region,

        product:
          row.PRODUCT ??
          row.product,

        orders: Number(
          row.ORDERS ??
          row.orders ??
          0
        ),

        revenue: Number(
          row.REVENUE ??
          row.revenue ??
          0
        ),

        cost: Number(
          row.COST ??
          row.cost ??
          0
        ),

        // ======================================================
        // KEEP BOTH NAMING CONVENTIONS
        // ======================================================

        shippingCost,

        shipping_cost:
          shippingCost,

        materialCost,

        material_cost:
          materialCost,
      };
    })
  );

  console.log(
    `✅ Semantic Layer loaded ${businessData.length} Snowflake rows`
  );

  return businessData;
}

function getBusinessData() {
  return businessData;
}

// ============================================================
// GOVERNED METRICS
// ============================================================

const metrics = {

  // ==========================================================
  // REVENUE
  // ==========================================================

  revenue: {
    name: "Total Revenue",
    description: "Total business revenue",
    type: "number",
    aggregation: "SUM",

    calculate: (rows) =>
      rows.reduce(
        (sum, row) =>
          sum + Number(row.revenue || 0),
        0
      ),
  },

  // ==========================================================
  // COST
  // ==========================================================

  cost: {
    name: "Total Cost",
    description: "Total business cost",
    type: "number",
    aggregation: "SUM",

    calculate: (rows) =>
      rows.reduce(
        (sum, row) =>
          sum + Number(row.cost || 0),
        0
      ),
  },

  // ==========================================================
  // SHIPPING COST
  // ==========================================================

  shippingCost: {
    name: "Shipping Cost",
    description: "Total shipping cost",
    type: "number",
    aggregation: "SUM",

    calculate: (rows) =>
      rows.reduce(
        (sum, row) =>
          sum +
          Number(
            row.shippingCost ??
            row.shipping_cost ??
            0
          ),
        0
      ),
  },

  // ==========================================================
  // MATERIAL COST
  // ==========================================================

  materialCost: {
    name: "Material Cost",
    description: "Total material cost",
    type: "number",
    aggregation: "SUM",

    calculate: (rows) =>
      rows.reduce(
        (sum, row) =>
          sum +
          Number(
            row.materialCost ??
            row.material_cost ??
            0
          ),
        0
      ),
  },

  // ==========================================================
  // PROFIT
  // ==========================================================

  profit: {
    name: "Total Profit",
    description: "Revenue minus cost",
    type: "number",
    aggregation: "CALCULATED",

    calculate: (rows) =>
      rows.reduce(
        (sum, row) =>
          sum +
          Number(row.revenue || 0) -
          Number(row.cost || 0),
        0
      ),
  },

  // ==========================================================
  // MARGIN
  // ==========================================================

  margin: {
    name: "Profit Margin",
    description: "Profit divided by revenue",
    type: "percentage",
    aggregation: "CALCULATED",

    calculate: (rows) => {

      const revenue =
        rows.reduce(
          (sum, row) =>
            sum + Number(row.revenue || 0),
          0
        );

      const cost =
        rows.reduce(
          (sum, row) =>
            sum + Number(row.cost || 0),
          0
        );

      if (revenue === 0) {
        return 0;
      }

      return (
        ((revenue - cost) /
          revenue) *
        100
      );
    },
  },

  // ==========================================================
  // ORDERS
  // ==========================================================

  orders: {
    name: "Total Orders",
    description: "Total number of orders",
    type: "number",
    aggregation: "SUM",

    calculate: (rows) =>
      rows.reduce(
        (sum, row) =>
          sum + Number(row.orders || 0),
        0
      ),
  },
};

// ============================================================
// GOVERNED DIMENSIONS
// ============================================================

const dimensions = {

  time: {
    name: "Time",
    field: "date",
    type: "date",
  },

  geography: {
    name: "Geography",
    field: "country",
    type: "string",
  },

  country: {
    name: "Country",
    field: "country",
    type: "string",
  },

  region: {
    name: "Region",
    field: "region",
    type: "string",
  },

  product: {
    name: "Product",
    field: "product",
    type: "string",
  },
};

// ============================================================
// GET METRIC
// ============================================================

function getMetric(metricName) {

  if (!metricName) {
    return null;
  }

  return (
    metrics[
      String(metricName)
        .toLowerCase()
    ] || null
  );
}

// ============================================================
// GET DIMENSION
// ============================================================

function getDimension(dimensionName) {

  if (!dimensionName) {
    return null;
  }

  return (
    dimensions[
      String(dimensionName)
        .toLowerCase()
    ] || null
  );
}

// ============================================================
// CALCULATE METRIC
// ============================================================

function calculateMetric(
  metricName,
  rows = businessData
) {

  const metric =
    getMetric(metricName);

  if (!metric) {
    throw new Error(
      `Unknown metric: ${metricName}`
    );
  }

  return metric.calculate(rows);
}

// ============================================================
// GET MONTH FROM ROW
// ============================================================

function getRowMonth(row) {

  if (
    row.month !== undefined &&
    row.month !== null &&
    String(row.month).trim() !== ""
  ) {

    const monthNumber =
      Number(row.month);

    if (
      Number.isInteger(monthNumber) &&
      monthNumber >= 1 &&
      monthNumber <= 12
    ) {
      return monthNumber;
    }
  }

  if (
    row.date === undefined ||
    row.date === null
  ) {
    return null;
  }

  const dateString =
    String(row.date).trim();

  if (!dateString) {
    return null;
  }

  // YYYY-MM-DD
  const directMatch =
    dateString.match(
      /^(\d{4})-(\d{1,2})-(\d{1,2})/
    );

  if (directMatch) {
    return Number(
      directMatch[2]
    );
  }

  // DD-MM-YYYY
  const reverseMatch =
    dateString.match(
      /^(\d{1,2})-(\d{1,2})-(\d{4})/
    );

  if (reverseMatch) {
    return Number(
      reverseMatch[2]
    );
  }

  const parsedDate =
    new Date(dateString);

  if (
    !Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return (
      parsedDate.getMonth() + 1
    );
  }

  return null;
}

// ============================================================
// FILTER DATA
// ============================================================

function filterData(filters = {}) {

  let rows = [
    ...businessData,
  ];

  // ==========================================================
  // COUNTRY
  // ==========================================================

  if (
    filters.country !== undefined &&
    filters.country !== null &&
    String(filters.country).trim() !== ""
  ) {

    const country =
      String(filters.country)
        .trim()
        .toLowerCase();

    rows = rows.filter(
      (row) =>
        String(row.country || "")
          .trim()
          .toLowerCase() === country
    );
  }

  // ==========================================================
  // REGION
  // ==========================================================

  if (
    filters.region !== undefined &&
    filters.region !== null &&
    String(filters.region).trim() !== ""
  ) {

    const region =
      String(filters.region)
        .trim()
        .toLowerCase();

    rows = rows.filter(
      (row) =>
        String(row.region || "")
          .trim()
          .toLowerCase() === region
    );
  }

  // ==========================================================
  // PRODUCT
  // ==========================================================

  if (
    filters.product !== undefined &&
    filters.product !== null &&
    String(filters.product).trim() !== ""
  ) {

    const product =
      String(filters.product)
        .trim()
        .toLowerCase();

    rows = rows.filter(
      (row) =>
        String(row.product || "")
          .trim()
          .toLowerCase() === product
    );
  }

  // ==========================================================
  // MONTH
  // ==========================================================

  if (
    filters.month !== undefined &&
    filters.month !== null &&
    String(filters.month).trim() !== ""
  ) {

    const requestedMonth =
      Number(
        String(filters.month).trim()
      );

    if (
      Number.isInteger(
        requestedMonth
      ) &&
      requestedMonth >= 1 &&
      requestedMonth <= 12
    ) {

      rows = rows.filter(
        (row) =>
          getRowMonth(row) ===
          requestedMonth
      );
    }
  }

  return rows;
}

// ============================================================
// GROUP DATA
// ============================================================

function groupBy(
  rows,
  field
) {

  const groups = {};

  rows.forEach((row) => {

    const key = row[field];

    if (
      key === undefined ||
      key === null ||
      String(key).trim() === ""
    ) {
      return;
    }

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

function monthlyAnalytics(
  filters = {}
) {

  const filteredRows =
    filterData(filters);

  const groups = {};

  filteredRows.forEach((row) => {

    let monthKey;

    if (row.date) {

      const dateString =
        String(row.date);

      const match =
        dateString.match(
          /^(\d{4})-(\d{1,2})/
        );

      if (match) {

        monthKey =
          `${match[1]}-${String(
            match[2]
          ).padStart(2, "0")}`;
      }
    }

    if (!monthKey) {

      const month =
        getRowMonth(row);

      monthKey =
        month
          ? `Month ${month}`
          : "Unknown";
    }

    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }

    groups[monthKey].push(row);
  });

  return Object.entries(
    groups
  )
    .sort(([a], [b]) =>
      a.localeCompare(b)
    )
    .map(([month, rows]) => ({

      month,

      orders:
        calculateMetric(
          "orders",
          rows
        ),

      revenue:
        calculateMetric(
          "revenue",
          rows
        ),

      cost:
        calculateMetric(
          "cost",
          rows
        ),

      profit:
        calculateMetric(
          "profit",
          rows
        ),

      margin:
        Number(
          calculateMetric(
            "margin",
            rows
          ).toFixed(2)
        ),
    }));
}

// ============================================================
// COUNTRY ANALYTICS
// ============================================================

function countryAnalytics(
  filters = {}
) {

  const filteredRows =
    filterData(filters);

  const groups =
    groupBy(
      filteredRows,
      "country"
    );

  return Object.entries(
    groups
  ).map(([country, rows]) => ({

    country,

    orders:
      calculateMetric(
        "orders",
        rows
      ),

    revenue:
      calculateMetric(
        "revenue",
        rows
      ),

    cost:
      calculateMetric(
        "cost",
        rows
      ),

    profit:
      calculateMetric(
        "profit",
        rows
      ),

    margin:
      Number(
        calculateMetric(
          "margin",
          rows
        ).toFixed(2)
      ),
  }));
}

// ============================================================
// REGION ANALYTICS
// ============================================================

function regionAnalytics(
  filters = {}
) {

  const filteredRows =
    filterData(filters);

  const groups =
    groupBy(
      filteredRows,
      "region"
    );

  return Object.entries(
    groups
  ).map(([region, rows]) => ({

    region,

    orders:
      calculateMetric(
        "orders",
        rows
      ),

    revenue:
      calculateMetric(
        "revenue",
        rows
      ),

    cost:
      calculateMetric(
        "cost",
        rows
      ),

    profit:
      calculateMetric(
        "profit",
        rows
      ),

    margin:
      Number(
        calculateMetric(
          "margin",
          rows
        ).toFixed(2)
      ),
  }));
}

// ============================================================
// PRODUCT ANALYTICS
// ============================================================

function productAnalytics(
  filters = {}
) {

  const filteredRows =
    filterData(filters);

  const groups =
    groupBy(
      filteredRows,
      "product"
    );

  return Object.entries(
    groups
  ).map(([product, rows]) => ({

    product,

    orders:
      calculateMetric(
        "orders",
        rows
      ),

    revenue:
      calculateMetric(
        "revenue",
        rows
      ),

    cost:
      calculateMetric(
        "cost",
        rows
      ),

    profit:
      calculateMetric(
        "profit",
        rows
      ),

    margin:
      Number(
        calculateMetric(
          "margin",
          rows
        ).toFixed(2)
      ),
  }));
}

// ============================================================
// REGION → PRODUCT DRILL-DOWN
// ============================================================

function productAnalyticsByRegion(
  region,
  additionalFilters = {}
) {

  if (!region) {
    return [];
  }

  const filters = {
    ...additionalFilters,
    region,
  };

  const regionRows =
    filterData(filters);

  const groups =
    groupBy(
      regionRows,
      "product"
    );

  return Object.entries(
    groups
  ).map(
    ([product, rows]) => ({

      region,

      product,

      orders:
        calculateMetric(
          "orders",
          rows
        ),

      revenue:
        calculateMetric(
          "revenue",
          rows
        ),

      cost:
        calculateMetric(
          "cost",
          rows
        ),

      profit:
        calculateMetric(
          "profit",
          rows
        ),

      margin:
        Number(
          calculateMetric(
            "margin",
            rows
          ).toFixed(2)
        ),
    })
  );
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
  productAnalytics,
  productAnalyticsByRegion,
  setBusinessData,
  getBusinessData,
};