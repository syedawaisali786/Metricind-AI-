type FilterBarProps = {
  country: string;
  region: string;
  product: string;
  month: string;

  setCountry: (value: string) => void;
  setRegion: (value: string) => void;
  setProduct: (value: string) => void;
  setMonth: (value: string) => void;

  onApply: () => void;
  onClear: () => void;
};

function FilterBar({
  country,
  region,
  product,
  month,
  setCountry,
  setRegion,
  setProduct,
  setMonth,
  onApply,
  onClear,
}: FilterBarProps) {
  // ==========================================================
  // FILTER OPTIONS
  // ==========================================================

  const countries = [
    "USA",
    "India",
    "Germany",
    "France",
  ];

  const regions = [
    "North America",
    "Asia",
    "Europe",
  ];

  const products = [
    "Laptop",
    "Monitor",
    "Keyboard",
  ];

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
  ];

  // ==========================================================
  // HELPERS
  // ==========================================================

  const selectStyle = {
    width: "100%",
    padding: "11px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#111827",
    boxSizing: "border-box" as const,
    fontSize: "14px",
    cursor: "pointer",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    color: "#374151",
    fontWeight: "bold" as const,
    fontSize: "14px",
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "20px",
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      {/* ==================================================== */}
      {/* HEADER */}
      {/* ==================================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "18px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              color: "#111827",
              fontSize: "20px",
            }}
          >
            🔎 Business Filters
          </h2>

          <p
            style={{
              margin: "5px 0 0",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Filter your business analytics
          </p>
        </div>

        {/* ACTIVE FILTER COUNT */}

        <div
          style={{
            background: "#eff6ff",
            color: "#2563eb",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "bold",
          }}
        >
          {
            [
              country,
              region,
              product,
              month,
            ].filter(Boolean).length
          }{" "}
          Active Filter
          {
            [
              country,
              region,
              product,
              month,
            ].filter(Boolean).length !== 1
              ? "s"
              : ""
          }
        </div>
      </div>

      {/* ==================================================== */}
      {/* FILTER GRID */}
      {/* ==================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "15px",
        }}
      >
        {/* ================================================== */}
        {/* COUNTRY */}
        {/* ================================================== */}

        <div>
          <label style={labelStyle}>
            Country
          </label>

          <select
            value={country}
            onChange={(e) =>
              setCountry(e.target.value)
            }
            style={selectStyle}
          >
            <option value="">
              All Countries
            </option>

            {countries.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* ================================================== */}
        {/* REGION */}
        {/* ================================================== */}

        <div>
          <label style={labelStyle}>
            Region
          </label>

          <select
            value={region}
            onChange={(e) =>
              setRegion(e.target.value)
            }
            style={selectStyle}
          >
            <option value="">
              All Regions
            </option>

            {regions.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* ================================================== */}
        {/* PRODUCT */}
        {/* ================================================== */}

        <div>
          <label style={labelStyle}>
            Product
          </label>

          <select
            value={product}
            onChange={(e) =>
              setProduct(e.target.value)
            }
            style={selectStyle}
          >
            <option value="">
              All Products
            </option>

            {products.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* ================================================== */}
        {/* MONTH */}
        {/* ================================================== */}

        <div>
          <label style={labelStyle}>
            Month
          </label>

          <select
            value={month}
            onChange={(e) =>
              setMonth(e.target.value)
            }
            style={selectStyle}
          >
            <option value="">
              All Months
            </option>

            {months.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ==================================================== */}
      {/* SELECTED FILTER SUMMARY */}
      {/* ==================================================== */}

      {(country ||
        region ||
        product ||
        month) && (
        <div
          style={{
            marginTop: "18px",
            padding: "12px",
            background: "#f8fafc",
            borderRadius: "8px",
            border:
              "1px solid #e2e8f0",
          }}
        >
          <strong
            style={{
              color: "#374151",
              fontSize: "13px",
            }}
          >
            Active Filters:
          </strong>

          <div
            style={{
              marginTop: "7px",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            {country && (
              <span>
                Country:{" "}
                <strong>{country}</strong>
              </span>
            )}

            {region && (
              <span
                style={{
                  marginLeft: "15px",
                }}
              >
                Region:{" "}
                <strong>{region}</strong>
              </span>
            )}

            {product && (
              <span
                style={{
                  marginLeft: "15px",
                }}
              >
                Product:{" "}
                <strong>{product}</strong>
              </span>
            )}

            {month && (
              <span
                style={{
                  marginLeft: "15px",
                }}
              >
                Month:{" "}
                <strong>
                  {
                    months.find(
                      (item) =>
                        item.value === month
                    )?.label
                  }
                </strong>
              </span>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* BUTTONS */}
      {/* ==================================================== */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "18px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={onApply}
          style={{
            padding: "10px 20px",
            background: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ✓ Apply Filters
        </button>

        <button
          onClick={onClear}
          style={{
            padding: "10px 20px",
            background: "#e5e7eb",
            color: "#111827",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ↺ Clear Filters
        </button>
      </div>
    </div>
  );
}

export default FilterBar;