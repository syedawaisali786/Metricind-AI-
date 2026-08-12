import { useState } from "react";

import RevenueChart from "./components/charts/RevenueChart";
import SalesChart from "./components/charts/SalesChart";
import RegionChart from "./components/RegionChart";
import RegionalPerformance from "./components/RegionalPerformance";
import MonthlyPerformance from "./components/MonthlyPerformance";
import CountryPerformance from "./components/CountryPerformance";
import KPICards from "./components/KPICards";
import FilterBar from "./components/FilterBar";
import Chat from "./Chat";

function App() {
  // ============================================================
  // BUSINESS FILTER STATE
  // ============================================================

  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [product, setProduct] = useState("");
  const [month, setMonth] = useState("");

  // ============================================================
  // APPLIED FILTERS
  // ============================================================

  const [appliedFilters, setAppliedFilters] = useState({
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

    console.log("Applied business filters:", {
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

    console.log("Business filters cleared");
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div
          style={{
            background: "#ffffff",
            padding: "24px",
            borderRadius: "12px",
            marginBottom: "20px",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#111827",
              fontSize: "30px",
            }}
          >
            MetricMind
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "#6b7280",
            }}
          >
            Agentic Semantic BI Dashboard
          </p>
        </div>

        {/* ================================================== */}
        {/* BUSINESS FILTER */}
        {/* ================================================== */}

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

        {/* ================================================== */}
        {/* ACTIVE FILTER DISPLAY */}
        {/* ================================================== */}

        {(appliedFilters.country ||
          appliedFilters.region ||
          appliedFilters.product ||
          appliedFilters.month) && (
          <div
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              padding: "14px 18px",
              borderRadius: "10px",
              marginTop: "15px",
              marginBottom: "20px",
              color: "#1e3a8a",
            }}
          >
            <strong>Active Filters:</strong>

            <div
              style={{
                marginTop: "8px",
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              {appliedFilters.country && (
                <span>
                  Country: {appliedFilters.country}
                </span>
              )}

              {appliedFilters.region && (
                <span>
                  Region: {appliedFilters.region}
                </span>
              )}

              {appliedFilters.product && (
                <span>
                  Product: {appliedFilters.product}
                </span>
              )}

              {appliedFilters.month && (
                <span>
                  Month: {appliedFilters.month}
                </span>
              )}
            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* KPI CARDS */}
        {/* ================================================== */}

        <KPICards
          country={country}
          region={region}
          product={product}
          month={month}
        />

        {/* ================================================== */}
        {/* ANALYTICS */}
        {/* ================================================== */}

        <RevenueChart />

        <SalesChart />

        <RegionChart />

        <RegionalPerformance />

        <MonthlyPerformance />

        <CountryPerformance />

        {/* ================================================== */}
        {/* AI CHAT */}
        {/* ================================================== */}

        <Chat />

      </div>
    </div>
  );
}

export default App;