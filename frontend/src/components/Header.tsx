import { useEffect, useState } from "react";

function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hour = currentTime.getHours();

  let greeting = "Good Morning";
  let greetingIcon = "☀️";

  if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
    greetingIcon = "☀️";
  } else if (hour >= 17) {
    greeting = "Good Evening";
    greetingIcon = "🌙";
  }

  const date = currentTime.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const time = currentTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <header
      style={{
        minHeight: "88px",
        width: "100%",
        padding: "16px 30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#070707",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        color: "#f5f5f5",
      }}
    >
      {/* LEFT — GREETING */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "26px",
            fontWeight: "600",
            letterSpacing: "-0.5px",
          }}
        >
          <span style={{ fontSize: "27px" }}>
            {greetingIcon}
          </span>

          <span>{greeting},</span>

          <span
            style={{
              color: "#00E5A0",
              fontWeight: "700",
            }}
          >
            Syed Awais Ali
          </span>
        </div>

        <div
          style={{
            marginTop: "6px",
            color: "#8f8f8f",
            fontSize: "13px",
          }}
        >
          Here's your business performance overview
        </div>
      </div>

      {/* RIGHT — DATE + TIME + USER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "22px",
        }}
      >
        {/* DATE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
          }}
        >
          <span style={{ fontSize: "19px" }}>📅</span>

          <span
            style={{
              color: "#d4d4d4",
              fontSize: "13px",
            }}
          >
            {date}
          </span>
        </div>

        {/* TIME */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            paddingLeft: "20px",
            borderLeft: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          <span style={{ fontSize: "19px" }}>◷</span>

          <span
            style={{
              color: "#ffffff",
              fontSize: "18px",
              fontWeight: "600",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {time}
          </span>

          <span
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              background: "#181818",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "#a1a1a1",
              fontSize: "10px",
              fontWeight: "600",
            }}
          >
            IST
          </span>
        </div>

        {/* NOTIFICATION */}
        <div
          style={{
            width: "42px",
            height: "42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10px",
            background: "#101010",
            border: "1px solid rgba(255,255,255,0.10)",
            fontSize: "19px",
          }}
        >
          🔔
        </div>

        {/* USER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            paddingLeft: "8px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              border: "1px solid #00E5A0",
              background: "#151515",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "13px",
            }}
          >
            SA
          </div>

          <div>
            <div
              style={{
                color: "#f5f5f5",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              Syed Awais Ali
            </div>

            <div
              style={{
                marginTop: "2px",
                color: "#777",
                fontSize: "10px",
              }}
            >
              Admin
            </div>
          </div>

          <span
            style={{
              marginLeft: "8px",
              color: "#888",
              fontSize: "14px",
            }}
          >
           ⌄
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;