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

  /* ==========================================================
     FILTER OPTIONS
  ========================================================== */

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

  const activeCount = [
    country,
    region,
    product,
    month,
  ].filter(Boolean).length;


  /* ==========================================================
     STYLES
     BLACK + ORANGE PREMIUM SYSTEM
  ========================================================== */

  const selectStyle = {
    width: "100%",
    padding: "11px 13px",

    borderRadius: "9px",

    border:
      "1px solid rgba(255, 255, 255, 0.08)",

    background:
      "#0c0c0c",

    color:
      "#f5f5f5",

    boxSizing:
      "border-box" as const,

    fontSize:
      "12px",

    fontWeight:
      600,

    cursor:
      "pointer",

    outline:
      "none",

    transition:
      "all 0.2s ease",
  };


  const labelStyle = {
    display: "block",

    marginBottom:
      "7px",

    color:
      "#8a8a8a",

    fontWeight:
      700 as const,

    fontSize:
      "9px",

    textTransform:
      "uppercase" as const,

    letterSpacing:
      "0.12em",
  };


  const chipStyle = {
    padding:
      "6px 9px",

    borderRadius:
      "7px",

    background:
      "rgba(249, 115, 22, 0.07)",

    border:
      "1px solid rgba(249, 115, 22, 0.14)",

    color:
      "#00F5A0",

    fontSize:
      "10px",

    fontWeight:
      600,
  };


  /* ==========================================================
     UI
  ========================================================== */

  return (
    <div
      className="metricmind-filter"
      style={{
        position: "relative",

        background:
          "linear-gradient(145deg, #141414 0%, #0b0b0b 100%)",

        padding:
          "22px",

        borderRadius:
          "14px",

        marginBottom:
          "26px",

        border:
          "1px solid rgba(255, 255, 255, 0.07)",

        boxShadow:
          "0 14px 40px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.025)",

        overflow:
          "hidden",
      }}
    >

      {/* ====================================================
          ORANGE TOP ACCENT
      ==================================================== */}

      <div
        style={{
          position:
            "absolute",

          left:
            0,

          top:
            0,

          width:
            "100%",

          height:
            "2px",

          background:
            "linear-gradient(90deg, #087F5B, #00E5A0, #00F5A0)",

          boxShadow:
            "0 0 12px rgba(249,115,22,0.22)",

          pointerEvents:
            "none",
        }}
      />


      {/* ====================================================
          SUBTLE ORANGE GLOW
      ==================================================== */}

      <div
        style={{
          position:
            "absolute",

          width:
            "220px",

          height:
            "220px",

          right:
            "-130px",

          top:
            "-150px",

          borderRadius:
            "50%",

          background:
            "radial-gradient(circle, rgba(249,115,22,0.07), transparent 70%)",

          pointerEvents:
            "none",
        }}
      />


      {/* ====================================================
          HEADER
      ==================================================== */}

      <div
        style={{
          position:
            "relative",

          display:
            "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          marginBottom:
            "19px",

          flexWrap:
            "wrap",

          gap:
            "12px",
        }}
      >

        <div>

          <div
            style={{
              color:
                "#00F5A0",

              fontSize:
                "9px",

              fontWeight:
                800,

              letterSpacing:
                "0.17em",

              textTransform:
                "uppercase",

              marginBottom:
                "6px",
            }}
          >
            FILTERS
          </div>


          <h2
            style={{
              margin:
                0,

              color:
                "#f5f5f5",

              fontSize:
                "19px",

              fontWeight:
                750,

              letterSpacing:
                "-0.025em",
            }}
          >
            Business Filters
          </h2>


          <p
            style={{
              margin:
                "5px 0 0",

              color:
                "#707070",

              fontSize:
                "11px",
            }}
          >
            Narrow your analysis by business dimensions.
          </p>

        </div>


        {/* ACTIVE FILTER COUNT */}

        <div
          style={{
            display:
              "inline-flex",

            alignItems:
              "center",

            gap:
              "7px",

            padding:
              "7px 10px",

            borderRadius:
              "999px",

            background:
              activeCount > 0
                ? "rgba(249,115,22,0.08)"
                : "rgba(255,255,255,0.035)",

            border:
              activeCount > 0
                ? "1px solid rgba(249,115,22,0.16)"
                : "1px solid rgba(255,255,255,0.07)",

            color:
              activeCount > 0
                ? "#00F5A0"
                : "#707070",

            fontSize:
              "9px",

            fontWeight:
              700,

            whiteSpace:
              "nowrap",
          }}
        >

          <span
            style={{
              width:
                "6px",

              height:
                "6px",

              borderRadius:
                "50%",

              background:
                activeCount > 0
                  ? "#00E5A0"
                  : "#4a4a4a",

              boxShadow:
                activeCount > 0
                  ? "0 0 9px rgba(249,115,22,0.7)"
                  : "none",
            }}
          />

          {activeCount} Active Filter
          {activeCount !== 1 ? "s" : ""}

        </div>

      </div>


      {/* ====================================================
          FILTER GRID
      ==================================================== */}

      <div
        style={{
          position:
            "relative",

          display:
            "grid",

          gridTemplateColumns:
            "repeat(4, minmax(0, 1fr))",

          gap:
            "12px",
        }}
      >

        {/* COUNTRY */}

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


        {/* REGION */}

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


        {/* PRODUCT */}

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


        {/* MONTH */}

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


      {/* ====================================================
          ACTIVE FILTER SUMMARY
      ==================================================== */}

      {activeCount > 0 && (

        <div
          style={{
            marginTop:
              "14px",

            padding:
              "11px",

            borderRadius:
              "9px",

            background:
              "#090909",

            border:
              "1px solid rgba(255,255,255,0.06)",
          }}
        >

          <div
            style={{
              color:
                "#555555",

              fontSize:
                "8px",

              fontWeight:
                800,

              textTransform:
                "uppercase",

              letterSpacing:
                "0.13em",

              marginBottom:
                "7px",
            }}
          >
            Active Filters
          </div>


          <div
            style={{
              display:
                "flex",

              flexWrap:
                "wrap",

              gap:
                "7px",
            }}
          >

            {country && (
              <span style={chipStyle}>
                Country:{" "}
                <strong>
                  {country}
                </strong>
              </span>
            )}


            {region && (
              <span style={chipStyle}>
                Region:{" "}
                <strong>
                  {region}
                </strong>
              </span>
            )}


            {product && (
              <span style={chipStyle}>
                Product:{" "}
                <strong>
                  {product}
                </strong>
              </span>
            )}


            {month && (
              <span style={chipStyle}>
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


      {/* ====================================================
          ACTION BUTTONS
      ==================================================== */}

      <div
        style={{
          display:
            "flex",

          gap:
            "8px",

          marginTop:
            "15px",

          flexWrap:
            "wrap",
        }}
      >

        {/* APPLY */}

        <button
          onClick={onApply}
          style={{
            padding:
              "9px 17px",

            background:
              "linear-gradient(135deg, #087F5B, #00E5A0)",

            color:
              "#ffffff",

            border:
              "none",

            borderRadius:
              "8px",

            cursor:
              "pointer",

            fontWeight:
              750,

            fontSize:
              "11px",

            boxShadow:
              "0 7px 20px rgba(249,115,22,0.20)",

            transition:
              "all 0.2s ease",
          }}
        >
          ✓ Apply Filters
        </button>


        {/* CLEAR */}

        <button
          onClick={onClear}
          style={{
            padding:
              "9px 17px",

            background:
              "#151515",

            color:
              "#999999",

            border:
              "1px solid rgba(255,255,255,0.07)",

            borderRadius:
              "8px",

            cursor:
              "pointer",

            fontWeight:
              650,

            fontSize:
              "11px",

            transition:
              "all 0.2s ease",
          }}
        >
          ↺ Clear Filters
        </button>

      </div>

    </div>
  );
}

export default FilterBar;