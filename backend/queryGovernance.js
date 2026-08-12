// ============================================================
// METRICMIND - QUERY GOVERNANCE
// ============================================================

const MAX_QUESTION_LENGTH = 200;

// ============================================================
// ALLOWED AGENT INTENTS
// ============================================================

const ALLOWED_INTENTS = [
  "profit_root_cause",
  "q3_revenue",
  "monthly_analysis",
  "country_analysis",
  "region_analysis",
  "product_analysis",
  "filtered_metric",
  "comparison",
  "metric"
];

// ============================================================
// VALIDATE QUERY
// ============================================================

export function validateQuery(
  question,
  interpretation
) {

  // ==========================================================
  // QUESTION LENGTH PROTECTION
  // ==========================================================

  if (
    String(question || "").length >
    MAX_QUESTION_LENGTH
  ) {

    return {
      allowed: false,

      reason:
        "Question is too long. Please keep it under 200 characters."
    };
  }

  // ==========================================================
  // INTERPRETATION CHECK
  // ==========================================================

  if (!interpretation) {

    return {
      allowed: false,

      reason:
        "Unable to interpret the business query."
    };
  }

  // ==========================================================
  // INTENT GOVERNANCE
  // ==========================================================

  if (
    !ALLOWED_INTENTS.includes(
      interpretation.intent
    )
  ) {

    return {
      allowed: false,

      reason:
        "This type of analytical query is not allowed."
    };
  }

  // ==========================================================
  // METRIC GOVERNANCE
  // ==========================================================

  const allowedMetrics = [
    "revenue",
    "cost",
    "profit",
    "margin",
    "orders"
  ];

  if (
    interpretation.metric &&
    !allowedMetrics.includes(
      interpretation.metric
    )
  ) {

    return {
      allowed: false,

      reason:
        "The requested metric is not governed by MetricMind."
    };
  }

  // ==========================================================
  // APPROVED
  // ==========================================================

  return {

    allowed: true,

    reason:
      "Query approved by MetricMind Governance."
  };
}