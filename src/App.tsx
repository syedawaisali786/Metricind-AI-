import RevenueChart from "./components/charts/RevenueChart";
import SalesChart from "./components/charts/SalesChart";
import RecentTransaction from "./components/RecentTransaction";
import { useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

type Message = {
  sender: string;
  text: string;
};

const cardStyle = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "10px",
  textAlign: "center" as const,
};

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const askAI = async () => {
    if (!question.trim()) return;

    try {
      const response = await axios.post("http://localhost:5000/ask", {
        question,
      });

      setMessages((prev) => [
        ...prev,
        { sender: "You", text: question },
        { sender: "AI", text: response.data.answer },
      ]);

      setQuestion("");
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        { sender: "AI", text: "Unable to get AI response." },
      ]);
    }
  };

  return (
    <>
      <Header />

      <div
        style={{
          display: "flex",
          background: "#0f172a",
          minHeight: "100vh",
        }}
      >
        <Sidebar />

        <div
          style={{
            flex: 1,
            padding: "30px",
            color: "white",
            overflowY: "auto",
          }}
        >
          <h1>📊 MetricMind Dashboard</h1>

          <p>Welcome to the AI Powered Business Intelligence Platform.</p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
              marginTop: "25px",
            }}
          >
            <div style={cardStyle}>
              <h3>💰 Total Revenue</h3>
              <h2>₹12.5M</h2>
              <p style={{ color: "#22c55e" }}>+12.4% this month</p>
            </div>

            <div style={cardStyle}>
              <h3>🛒 Total Sales</h3>
              <h2>4,520</h2>
              <p style={{ color: "#22c55e" }}>+8.2% this month</p>
            </div>

            <div style={cardStyle}>
              <h3>👥 Customers</h3>
              <h2>1,245</h2>
              <p style={{ color: "#22c55e" }}>+15% this month</p>
            </div>

            <div style={cardStyle}>
              <h3>📈 Profit</h3>
              <h2>₹3.2M</h2>
              <p style={{ color: "#22c55e" }}>+5.6% this month</p>
            </div>
          </div>

          <div
            style={{
              marginTop: "30px",
              background: "#1e293b",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <h2>🤖 AI Assistant</h2>

            <input
              type="text"
              placeholder="Ask AI..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "15px",
                borderRadius: "8px",
              }}
            />

            <button
              onClick={askAI}
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Ask AI
            </button>

            <div style={{ marginTop: "20px" }}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    background:
                      msg.sender === "You" ? "#2563eb" : "#334155",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <strong>{msg.sender}:</strong> {msg.text}
                </div>
              ))}
            </div>
          </div>
          <RevenueChart />
          <SalesChart />
          <RecentTransaction />
        </div>
      </div>
    </>
  );
}

export default App;