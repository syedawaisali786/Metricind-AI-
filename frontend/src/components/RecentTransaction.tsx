const transactions = [
  {
    id: 1,
    customer: "Rahul Sharma",
    product: "AI Dashboard",
    amount: "₹12,000",
    status: "Completed",
  },
  {
    id: 2,
    customer: "Priya Singh",
    product: "Analytics Pro",
    amount: "₹8,500",
    status: "Pending",
  },
];

function RecentTransaction() {
  return (
    <div
      style={{
        background: "#1e293b",
        color: "white",
        padding: "20px",
        borderRadius: "10px",
        marginTop: "20px",
      }}
    >
      <h2>Recent Transactions</h2>

      {transactions.map((item) => (
        <div key={item.id} style={{ marginBottom: "10px" }}>
          <strong>{item.customer}</strong> - {item.product} - {item.amount}
        </div>
      ))}
    </div>
  );
}

export default RecentTransaction;