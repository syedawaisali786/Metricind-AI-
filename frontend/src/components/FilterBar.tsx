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
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
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
      </div>

      {/* FILTERS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "15px",
        }}
      >
        {/* COUNTRY */}

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              color: "#374151",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            Country
          </label>

          <select
            value={country}
            onChange={(e) =>
              setCountry(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              background: "#ffffff",
              boxSizing: "border-box",
            }}
          >
            <option value="">All Countries</option>
            <option value="USA">USA</option>
            <option value="India">India</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
          </select>
        </div>

        {/* REGION */}

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              color: "#374151",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            Region
          </label>

          <select
            value={region}
            onChange={(e) =>
              setRegion(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              background: "#ffffff",
              boxSizing: "border-box",
            }}
          >
            <option value="">All Regions</option>
            <option value="North America">
              North America
            </option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
          </select>
        </div>

        {/* PRODUCT */}

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              color: "#374151",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            Product
          </label>

          <select
            value={product}
            onChange={(e) =>
              setProduct(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              background: "#ffffff",
              boxSizing: "border-box",
            }}
          >
            <option value="">All Products</option>
            <option value="Laptop">Laptop</option>
            <option value="Monitor">Monitor</option>
            <option value="Keyboard">Keyboard</option>
          </select>
        </div>

        {/* MONTH */}

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              color: "#374151",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            Month
          </label>

          <select
            value={month}
            onChange={(e) =>
              setMonth(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              background: "#ffffff",
              boxSizing: "border-box",
            }}
          >
            <option value="">All Months</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
          </select>
        </div>
      </div>

      {/* BUTTONS */}

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
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Apply Filters
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
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default FilterBar;