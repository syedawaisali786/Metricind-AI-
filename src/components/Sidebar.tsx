function Sidebar() {
  const menu = [
    "🏠 Dashboard",
    "🤖 AI Chat",
    "📊 Analytics",
    "📈 Reports",
    "📁 Datasets",
    "⚙️ Settings",
    "👤 Profile",
  ];

  return (
    <div
      style={{
        width: "250px",
        background: "#111827",
        color: "white",
        padding: "25px",
        height: "calc(100vh - 70px)",
        borderRight: "1px solid #1f2937",
      }}
    >
      <h2 style={{ marginBottom: "35px" }}>Navigation</h2>

      {menu.map((item) => (
        <div
          key={item}
          style={{
            padding: "15px",
            marginBottom: "12px",
            borderRadius: "10px",
            background: item === "🏠 Dashboard" ? "#2563eb" : "transparent",
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;