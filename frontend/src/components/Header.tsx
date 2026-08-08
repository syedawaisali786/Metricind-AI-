function Header() {
  return (
    <header
      style={{
        height: "70px",
        background: "linear-gradient(90deg,#2563eb,#1d4ed8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        color: "white",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "28px",
          fontWeight: "bold",
        }}
      >
        📊 MetricMind AI
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          fontSize: "15px",
        }}
      >
        🔔 Notifications
        👤 Admin
      </div>
    </header>
  );
}

export default Header;