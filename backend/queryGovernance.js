// ============================================================
// METRICMIND - QUERY GOVERNANCE
// ============================================================

const MAX_QUESTION_LENGTH = 200;

const ALLOWED_INTENTS = [
  "profit_root_cause",
  "q3_revenue",
  "monthly_analysis",
  "country_analysis",
  "region_analysis",
  "product_analysis",
  "filtered_metric",
  "metric"
];

export function validateQuery(question, interpretation) {

  // ==========================================================
  // QUESTION LENGTH PROTECTION
  // ==========================================================

  if (question.length > MAX_QUESTION_LENGTH) {
    return {
      allowed: false,
      reason:
        "Question is too long. Please keep it under 200 characters."
    };
  }


  // ==========================================================
  // INTENT GOVERNANCE
  // ==========================================================

  if (
    interpretation &&
    !ALLOWED_INTENTS.includes(interpretation.intent)
  ) {
    return {
      allowed: false,
      reason:
        "This type of analytical query is not allowed."
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