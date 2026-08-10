import { useEffect, useState } from "react";

type CountryData = {
  country: string;
  orders: number;
  revenue: number;
  cost: number;
  profit: number;
};

function CountryPerformance() {
  const [data, setData] = useState<CountryData[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/analytics/country")
      .then((res) => res.json())
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.error("Error loading country data:", error);
      });
  }, []);

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "24px",
        borderRadius: "12px",
        marginTop: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        overflowX: "auto",
      }}
    >
      <h2
        style={{
          color: "#111827",
          marginBottom: "20px",
        }}
      >
        Country Performance
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={headerStyle}>Country</th>
            <th style={headerStyle}>Orders</th>
            <th style={headerStyle}>Revenue</th>
            <th style={headerStyle}>Cost</th>
            <th style={headerStyle}>Profit</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.country}>
              <td style={cellStyle}>{item.country}</td>
              <td style={cellStyle}>{item.orders}</td>
              <td style={cellStyle}>
                ₹{Number(item.revenue).toLocaleString("en-IN")}
              </td>
              <td style={cellStyle}>
                ₹{Number(item.cost).toLocaleString("en-IN")}
              </td>
              <td style={cellStyle}>
                ₹{Number(item.profit).toLocaleString("en-IN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "2px solid #e5e7eb",
  color: "#374151",
};

const cellStyle: React.CSSProperties = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
  color: "#4b5563",
};

export default CountryPerformance;