import { useState } from "react";

function Chat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = () => {
    if (!question.trim()) return;

    setAnswer("");
    setLoading(true);

    const response =
      "Based on the available business data, revenue has increased due to stronger sales performance during the recent period.";

    let index = 0;

    const interval = setInterval(() => {
      setAnswer(response.slice(0, index));
      index++;

      if (index > response.length) {
        clearInterval(interval);
        setLoading(false);
      }
    }, 30);
  };

  return (
    <div
      style={{
        background: "#1e293b",
        padding: "25px",
        borderRadius: "12px",
        marginTop: "25px",
        color: "white",
      }}
    >
      <h2>🤖 MetricMind AI Chat</h2>

      <p>
        Ask questions about your business data.
      </p>

      <input
        type="text"
        placeholder="Ask a business question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "none",
          marginTop: "10px",
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={askQuestion}
        disabled={loading}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {answer && (
        <div
          style={{
            marginTop: "20px",
            background: "#334155",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          <strong>AI:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default Chat;