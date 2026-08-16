// ============================================================
// METRICMIND - MOCK BUSINESS DATA
// ============================================================

// Existing business data
const businessData = [
  // JANUARY
  {
    id: 1,
    date: "2026-01-15",
    country: "USA",
    region: "North America",
    product: "Laptop",
    orders: 1,
    revenue: 10000,
    cost: 6500,
    shippingCost: 500,
    materialCost: 6000
  },
  {
    id: 2,
    date: "2026-01-20",
    country: "India",
    region: "Asia",
    product: "Monitor",
    orders: 1,
    revenue: 9000,
    cost: 6000,
    shippingCost: 400,
    materialCost: 5600
  },

  // FEBRUARY
  {
    id: 3,
    date: "2026-02-10",
    country: "USA",
    region: "North America",
    product: "Laptop",
    orders: 1,
    revenue: 9500,
    cost: 6000,
    shippingCost: 450,
    materialCost: 5550
  },
  {
    id: 4,
    date: "2026-02-22",
    country: "Germany",
    region: "Europe",
    product: "Keyboard",
    orders: 1,
    revenue: 8500,
    cost: 5300,
    shippingCost: 350,
    materialCost: 4950
  },

  // MARCH
  {
    id: 5,
    date: "2026-03-12",
    country: "USA",
    region: "North America",
    product: "Laptop",
    orders: 1,
    revenue: 10000,
    cost: 6200,
    shippingCost: 500,
    materialCost: 5700
  },
  {
    id: 6,
    date: "2026-03-25",
    country: "France",
    region: "Europe",
    product: "Monitor",
    orders: 1,
    revenue: 10000,
    cost: 7000,
    shippingCost: 450,
    materialCost: 6550
  },

  // APRIL
  {
    id: 7,
    date: "2026-04-10",
    country: "India",
    region: "Asia",
    product: "Keyboard",
    orders: 1,
    revenue: 6500,
    cost: 4000,
    shippingCost: 300,
    materialCost: 3700
  },
  {
    id: 8,
    date: "2026-04-20",
    country: "Germany",
    region: "Europe",
    product: "Laptop",
    orders: 1,
    revenue: 6000,
    cost: 3500,
    shippingCost: 250,
    materialCost: 3250
  },

  // MAY
  {
    id: 9,
    date: "2026-05-10",
    country: "USA",
    region: "North America",
    product: "Laptop",
    orders: 1,
    revenue: 10000,
    cost: 6500,
    shippingCost: 500,
    materialCost: 6000
  },
  {
    id: 10,
    date: "2026-05-22",
    country: "India",
    region: "Asia",
    product: "Monitor",
    orders: 1,
    revenue: 6500,
    cost: 4000,
    shippingCost: 300,
    materialCost: 3700
  },

  // JUNE
  {
    id: 11,
    date: "2026-06-12",
    country: "Germany",
    region: "Europe",
    product: "Laptop",
    orders: 1,
    revenue: 10000,
    cost: 6500,
    shippingCost: 500,
    materialCost: 6000
  },
  {
    id: 12,
    date: "2026-06-25",
    country: "France",
    region: "Europe",
    product: "Laptop",
    orders: 1,
    revenue: 13500,
    cost: 8200,
    shippingCost: 600,
    materialCost: 7600
  }
];

// ============================================================
// COMPLETE FILTER COVERAGE
// ============================================================

const countries = [
  {
    country: "USA",
    region: "North America"
  },
  {
    country: "India",
    region: "Asia"
  },
  {
    country: "Germany",
    region: "Europe"
  },
  {
    country: "France",
    region: "Europe"
  }
];

const products = [
  "Laptop",
  "Monitor",
  "Keyboard"
];

const months = [
  {
    number: 1,
    name: "January"
  },
  {
    number: 2,
    name: "February"
  },
  {
    number: 3,
    name: "March"
  },
  {
    number: 4,
    name: "April"
  },
  {
    number: 5,
    name: "May"
  },
  {
    number: 6,
    name: "June"
  }
];

// ============================================================
// FIND EXISTING COMBINATIONS
// ============================================================

const existingCombinations = new Set(
  businessData.map(row =>
    `${row.country}|${row.product}|${row.date.substring(0, 7)}`
  )
);

// ============================================================
// GENERATE MISSING COMBINATIONS
// ============================================================

let nextId = businessData.length + 1;

countries.forEach(({ country, region }) => {

  products.forEach(product => {

    months.forEach(({ number }) => {

      const monthKey = `2026-${String(number).padStart(2, "0")}`;

      const combinationKey =
        `${country}|${product}|${monthKey}`;

      // Do not replace existing real/mock records
      if (existingCombinations.has(combinationKey)) {
        return;
      }

      // Deterministic values for missing combinations
      const baseRevenue =
        country === "USA"
          ? 10000
          : country === "India"
          ? 8500
          : country === "Germany"
          ? 9000
          : 9500;

      const productMultiplier =
        product === "Laptop"
          ? 1.20
          : product === "Monitor"
          ? 1.00
          : 0.75;

      const monthMultiplier = 1 + (number - 1) * 0.03;

      const revenue = Math.round(
        baseRevenue *
        productMultiplier *
        monthMultiplier
      );

      const cost = Math.round(revenue * 0.60);

      const shippingCost = Math.round(revenue * 0.05);

      const materialCost = Math.round(
        cost - shippingCost
      );

      businessData.push({
        id: nextId++,
        date: `2026-${String(number).padStart(2, "0")}-15`,
        country,
        region,
        product,
        orders: 1,
        revenue,
        cost,
        shippingCost,
        materialCost
      });
    });
  });
});

// ============================================================
// EXPORT
// ============================================================

console.log(
  `MetricMind: ${businessData.length} total business records loaded`
);

export default businessData;