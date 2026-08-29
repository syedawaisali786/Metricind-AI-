import { useState, useEffect } from "react";
import "./App.css";

import RevenueChart from "./components/charts/RevenueChart";
import SalesChart from "./components/charts/SalesChart";
import RegionChart from "./components/RegionChart";
import RegionalPerformance from "./components/RegionalPerformance";
import MonthlyPerformance from "./components/MonthlyPerformance";
import CountryPerformance from "./components/CountryPerformance";
import KPICards from "./components/KPICards";
import FilterBar from "./components/FilterBar";
import ExecutiveInsights from "./components/ExecutiveInsights";
import Recommendations from "./components/Recommendations";
import Chat from "./Chat";

function App() {
  // ============================================================
  // SIDEBAR NAVIGATION
  // ============================================================

  const [activePage, setActivePage] =
    useState("dashboard");

  // ============================================================
  // LIVE GREETING
  // ============================================================

  const [currentTime, setCurrentTime] =
    useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hour = currentTime.getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 17
      ? "Good afternoon"
      : "Good evening";

  // ============================================================
  // FILTER STATE
  // ============================================================

  const [country, setCountry] =
    useState("");

  const [region, setRegion] =
    useState("");

  const [product, setProduct] =
    useState("");

  const [month, setMonth] =
    useState("");

  // ============================================================
  // APPLIED FILTERS
  // ============================================================

  const [appliedFilters, setAppliedFilters] =
    useState({
      country: "",
      region: "",
      product: "",
      month: "",
    });

  // ============================================================
  // APPLY FILTERS
  // ============================================================

  const handleApplyFilters = () => {
    setAppliedFilters({
      country,
      region,
      product,
      month,
    });
  };

  // ============================================================
  // CLEAR FILTERS
  // ============================================================

  const handleClearFilters = () => {
    setCountry("");
    setRegion("");
    setProduct("");
    setMonth("");

    setAppliedFilters({
      country: "",
      region: "",
      product: "",
      month: "",
    });
  };

  // ============================================================
  // ACTIVE FILTER COUNT
  // ============================================================

  const activeFilterCount =
    Object.values(appliedFilters).filter(Boolean).length;

  // ============================================================
  // COMMON FILTER PROPS
  // ============================================================

  const filters = {
    country: appliedFilters.country,
    region: appliedFilters.region,
    product: appliedFilters.product,
    month: appliedFilters.month,
  };

  // ============================================================
  // NAVIGATION HELPER
  // ============================================================

  const navigateTo = (page: string) => {
    setActivePage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="app-shell">

      {/* ====================================================== */}
      {/* SIDEBAR */}
      {/* ====================================================== */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-logo">
            M
          </div>

          <div>
            <div className="brand-name">
              MetricMind
            </div>

            <div className="brand-subtitle">
              Semantic BI
            </div>
          </div>

        </div>

        <div className="sidebar-section">

          <div className="sidebar-label">
            WORKSPACE
          </div>

          {/* DASHBOARD */}

          <button
            className={`nav-item ${
              activePage === "dashboard"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigateTo("dashboard")
            }
          >
            <span>▦</span>
            Dashboard
          </button>

          {/* ANALYTICS */}

          <button
            className={`nav-item ${
              activePage === "analytics"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigateTo("analytics")
            }
          >
            <span>◇</span>
            Analytics
          </button>

          {/* AI ANALYST */}

          <button
            className={`nav-item ai-nav ${
              activePage === "ai"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigateTo("ai")
            }
          >
            <span>✦</span>
            AI Analyst
          </button>

        </div>

        <div className="sidebar-section">

          <div className="sidebar-label">
            INSIGHTS
          </div>

          {/* REPORTS */}

          <button
            className={`nav-item ${
              activePage === "reports"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigateTo("reports")
            }
          >
            <span>◉</span>
            Reports
          </button>

          {/* PERFORMANCE */}

          <button
            className={`nav-item ${
              activePage === "performance"
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigateTo("performance")
            }
          >
            <span>◇</span>
            Performance
          </button>

        </div>

        <div className="sidebar-spacer" />

        {/* GOVERNED ANALYTICS */}

        <div className="governed-card">

          <div className="governed-icon">
            ✓
          </div>

          <div>

            <strong>
              Governed Analytics
            </strong>

            <p>
              Semantic metrics and
              deterministic calculations
            </p>

          </div>

        </div>

        {/* USER */}

        <div className="user-profile">

          <div className="user-avatar">
            SA
          </div>

          <div>

            <strong>
              MetricMind User
            </strong>

            <span>
              Analyst
            </span>

          </div>

        </div>

      </aside>

      {/* ====================================================== */}
      {/* MAIN CONTENT */}
      {/* ====================================================== */}

      <main className="main-content">

        {/* LIVE GREETING */}

        <div className="welcome-header">

          <h1>
            {greeting}, Syed Awais Ali
          </h1>

        </div>

        <div className="dashboard-content">

          {/* ================================================= */}
          {/* DASHBOARD */}
          {/* ================================================= */}

          {activePage === "dashboard" && (
            <>

              {/* ================================================= */}
              {/* FILTERS */}
              {/* ================================================= */}

              <section className="section-block">

                <div className="section-heading">

                  <div>

                    <div className="eyebrow">
                      FILTERS
                    </div>

                    <h2>
                      Business Filters
                    </h2>

                    <p>
                      Narrow your analysis by business dimensions.
                    </p>

                  </div>

                  <div className="filter-count">

                    {activeFilterCount} Active Filters

                  </div>

                </div>

                <div className="dark-card filter-card">

                  <FilterBar
                    country={country}
                    region={region}
                    product={product}
                    month={month}

                    setCountry={setCountry}
                    setRegion={setRegion}
                    setProduct={setProduct}
                    setMonth={setMonth}

                    onApply={handleApplyFilters}
                    onClear={handleClearFilters}
                  />

                </div>

              </section>

              {/* ================================================= */}
              {/* KPI */}
              {/* ================================================= */}

              <section className="section-block">

                <div className="section-heading">

                  <div>

                    <div className="eyebrow">
                      PERFORMANCE
                    </div>

                    <h2>
                      Key Business Metrics
                    </h2>

                    <p>
                      Your most important governed business metrics.
                    </p>

                  </div>

                  <div className="deterministic-badge">
                    ✓ Deterministic
                  </div>

                </div>

                <div className="dark-card kpi-wrapper">

                  <KPICards
                    {...filters}
                  />

                </div>

              </section>

              {/* ================================================= */}
              {/* ANALYTICS */}
              {/* ================================================= */}

              <section className="section-block">

                <div className="section-heading">

                  <div>

                    <div className="eyebrow">
                      ANALYTICS
                    </div>

                    <h2>
                      Business Performance
                    </h2>

                    <p>
                      Explore revenue, profit and regional performance.
                    </p>

                  </div>

                </div>

                {/* MONTHLY REVENUE & PROFIT */}

                <div className="dark-card chart-card premium-chart-card">

                  <div className="chart-title-block">

                    <div className="chart-eyebrow">
                      REVENUE ANALYTICS
                    </div>

                    <h2>
                      Monthly Revenue &amp; Profit
                    </h2>

                    <p>
                      Track monthly revenue and profitability trends.
                    </p>

                  </div>

                  <RevenueChart
                    {...filters}
                  />

                </div>

                {/* PROFIT BY PRODUCT */}

                <div className="dark-card chart-card premium-chart-card">

                  <div className="chart-title-block">

                    <div className="chart-eyebrow">
                      PRODUCT PERFORMANCE
                    </div>

                    <h2>
                      Profit by Product
                    </h2>

                    <p>
                      Compare profit contribution across products.
                    </p>

                  </div>

                  <SalesChart
                    {...filters}
                  />

                </div>

                {/* REVENUE BY REGION */}

                <div className="dark-card chart-card premium-chart-card">

                  <div className="chart-title-block">

                    <div className="chart-eyebrow">
                      REGIONAL PERFORMANCE
                    </div>

                    <h2>
                      Revenue by Region
                    </h2>

                    <p>
                      Compare revenue performance across regions.
                    </p>

                  </div>

                  <RegionChart
                    {...filters}
                  />

                </div>

              </section>

              {/* ================================================= */}
              {/* EXECUTIVE INSIGHTS */}
              {/* ================================================= */}

              <section className="section-block">

                <div className="section-heading">

                  <div>

                    <div className="eyebrow">
                      INTELLIGENCE
                    </div>

                    <h2>
                      Executive Insights
                    </h2>

                    <p>
                      Automated analysis of your current
                      business performance.
                    </p>

                  </div>

                </div>

                <div className="dark-card">

                  <ExecutiveInsights
                    {...filters}
                  />

                </div>

              </section>

              {/* ================================================= */}
              {/* AI RECOMMENDATIONS */}
              {/* ================================================= */}

              <section className="section-block">

                <div className="section-heading">

                  <div>

                    <div className="eyebrow">
                      DECISION SUPPORT
                    </div>

                    <h2>
                      AI Recommendations
                    </h2>

                    <p>
                      Deterministic recommendations based on
                      governed business metrics.
                    </p>

                  </div>

                </div>

                <div className="ai-recommendation-wrapper">

                  <Recommendations
                    {...filters}
                  />

                </div>

              </section>

              {/* ================================================= */}
              {/* DETAILED PERFORMANCE */}
              {/* ================================================= */}

              <section className="section-block">

                <div className="section-heading">

                  <div>

                    <div className="eyebrow">
                      BUSINESS DATA
                    </div>

                    <h2>
                      Detailed Performance
                    </h2>

                    <p>
                      Review monthly, regional and
                      country-level performance.
                    </p>

                  </div>

                </div>

                <div className="dark-card performance-card">

                  <RegionalPerformance
                    {...filters}
                  />

                </div>

                <div className="dark-card performance-card">

                  <MonthlyPerformance />

                </div>

                <div className="dark-card performance-card">

                  <CountryPerformance
                    {...filters}
                  />

                </div>

              </section>

              {/* ================================================= */}
              {/* AI ANALYST */}
              {/* ================================================= */}

              <section className="ai-section">

                <div className="ai-glow" />

                <div className="ai-header">

                  <div className="ai-icon">
                    ✦
                  </div>

                  <div>

                    <div className="eyebrow">
                      AI ANALYST
                    </div>

                    <h2>
                      Ask MetricMind anything about your business
                    </h2>

                    <p>
                      Powered by semantic layer · Governed metrics ·
                      Deterministic answers
                    </p>

                  </div>

                </div>

                <div className="ai-chat-container">

                  <Chat />

                </div>

              </section>

            </>
          )}

          {/* ================================================= */}
          {/* ANALYTICS PAGE */}
          {/* ================================================= */}

          {activePage === "analytics" && (
            <>

              <section className="section-block">

                <div className="section-heading">

                  <div>

                    <div className="eyebrow">
                      ANALYTICS
                    </div>

                    <h2>
                      Business Performance
                    </h2>

                    <p>
                      Explore revenue, profit and regional performance.
                    </p>

                  </div>

                </div>

                {/* MONTHLY REVENUE & PROFIT */}

                <div className="dark-card chart-card premium-chart-card">

                  <div className="chart-title-block">

                    <div className="chart-eyebrow">
                      REVENUE ANALYTICS
                    </div>

                    <h2>
                      Monthly Revenue &amp; Profit
                    </h2>

                    <p>
                      Track monthly revenue and profitability trends.
                    </p>

                  </div>

                  <RevenueChart
                    {...filters}
                  />

                </div>

                {/* PROFIT BY PRODUCT */}

                <div className="dark-card chart-card premium-chart-card">

                  <div className="chart-title-block">

                    <div className="chart-eyebrow">
                      PRODUCT PERFORMANCE
                    </div>

                    <h2>
                      Profit by Product
                    </h2>

                    <p>
                      Compare profit contribution across products.
                    </p>

                  </div>

                  <SalesChart
                    {...filters}
                  />

                </div>

                {/* REVENUE BY REGION */}

                <div className="dark-card chart-card premium-chart-card">

                  <div className="chart-title-block">

                    <div className="chart-eyebrow">
                      REGIONAL PERFORMANCE
                    </div>

                    <h2>
                      Revenue by Region
                    </h2>

                    <p>
                      Compare revenue performance across regions.
                    </p>

                  </div>

                  <RegionChart
                    {...filters}
                  />

                </div>

              </section>

            </>
          )}

                    {/* ================================================= */}
          {/* AI ANALYST PAGE */}
          {/* ================================================= */}

          {activePage === "ai" && (
            <>

              <section className="ai-section">

                <div className="ai-glow" />

                <div className="ai-header">

                  <div className="ai-icon">
                    ✦
                  </div>

                  <div>

                    <div className="eyebrow">
                      AI ANALYST
                    </div>

                    <h2>
                      Ask MetricMind anything about your business
                    </h2>

                    <p>
                      Powered by semantic layer · Governed metrics ·
                      Deterministic answers
                    </p>

                  </div>

                </div>

                <div className="ai-chat-container">

                  <Chat />

                </div>

              </section>

            </>
          )}

          {/* ================================================= */}
          {/* REPORTS PAGE */}
          {/* ================================================= */}

          {activePage === "reports" && (
            <>

              <section className="section-block">

                <div className="section-heading">

                  <div>

                    <div className="eyebrow">
                      INTELLIGENCE
                    </div>

                    <h2>
                      Executive Insights
                    </h2>

                    <p>
                      Automated analysis of your current
                      business performance.
                    </p>

                  </div>

                </div>

                <div className="dark-card">

                  <ExecutiveInsights
                    {...filters}
                  />

                </div>

              </section>

              {/* AI RECOMMENDATIONS */}

              <section className="section-block">

                <div className="section-heading">

                  <div>

                    <div className="eyebrow">
                      DECISION SUPPORT
                    </div>

                    <h2>
                      AI Recommendations
                    </h2>

                    <p>
                      Deterministic recommendations based on
                      governed business metrics.
                    </p>

                  </div>

                </div>

                <div className="ai-recommendation-wrapper">

                  <Recommendations
                    {...filters}
                  />

                </div>

              </section>

            </>
          )}

          {/* ================================================= */}
          {/* PERFORMANCE PAGE */}
          {/* ================================================= */}

          {activePage === "performance" && (
            <>

              {/* KPI */}

              <section className="section-block">

                <div className="section-heading">

                  <div>

                    <div className="eyebrow">
                      PERFORMANCE
                    </div>

                    <h2>
                      Key Business Metrics
                    </h2>

                    <p>
                      Your most important governed business metrics.
                    </p>

                  </div>

                  <div className="deterministic-badge">
                    ✓ Deterministic
                  </div>

                </div>

                <div className="dark-card kpi-wrapper">

                  <KPICards
                    {...filters}
                  />

                </div>

              </section>

              {/* DETAILED PERFORMANCE */}

              <section className="section-block">

                <div className="section-heading">

                  <div>

                    <div className="eyebrow">
                      BUSINESS DATA
                    </div>

                    <h2>
                      Detailed Performance
                    </h2>

                    <p>
                      Review monthly, regional and
                      country-level performance.
                    </p>

                  </div>

                </div>

                <div className="dark-card performance-card">

                  <RegionalPerformance
                    {...filters}
                  />

                </div>

                <div className="dark-card performance-card">

                  <MonthlyPerformance />

                </div>

                <div className="dark-card performance-card">

                  <CountryPerformance
                    {...filters}
                  />

                </div>

              </section>

            </>
          )}

        </div>

      </main>

    </div>
  );
}

export default App;