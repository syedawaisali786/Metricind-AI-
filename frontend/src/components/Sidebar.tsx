type SidebarProps = {
  setPage: (page: string) => void;
};

function Sidebar({ setPage }: SidebarProps) {
  const menu = [
    { name: "🏠 Dashboard", page: "dashboard" },
    { name: "🤖 AI Chat", page: "chat" },
    { name: "📊 Analytics", page: "analytics" },
    { name: "📈 Reports", page: "reports" },
    { name: "📁 Datasets", page: "datasets" },
    { name: "⚙️ Settings", page: "settings" },
    { name: "👤 Profile", page: "profile" },
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
          key={item.page}
          onClick={() => setPage(item.page)}
          style={{
            padding: "15px",
            marginBottom: "12px",
            borderRadius: "10px",
            background:
              item.page === "dashboard" ? "#2563eb" : "transparent",
            cursor: "pointer",
          }}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;