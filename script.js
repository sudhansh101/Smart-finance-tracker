// -------- Settings --------
const STORAGE_KEY = "pft-transactions";
const INR = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

// -------- State --------
let transactions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// -------- DOM Elements --------
const txForm = document.getElementById("txForm");
const txBody = document.getElementById("txBody");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const balanceEl = document.getElementById("balance");
const clearAllBtn = document.getElementById("clearAll");
let chart;

// -------- Save / Load --------
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

// -------- Render UI --------
function render() {
  // Totals
  const income = transactions.filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions.filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  totalIncomeEl.textContent = INR.format(income);
  totalExpenseEl.textContent = INR.format(expense);
  balanceEl.textContent = INR.format(balance);

  // Table
  txBody.innerHTML = transactions.map(t => `
    <tr>
      <td>${t.date}</td>
      <td>${t.desc}</td>
      <td>${t.category}</td>
      <td>
        <span class="${t.type === "income" ? "badge-income" : "badge-expense"}">
          ${t.type}
        </span>
      </td>
      <td>${INR.format(t.amount)}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteTx('${t.id}')">X</button>
      </td>
    </tr>
  `).join("");

  // Chart
  const byCat = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    byCat[t.category] = (byCat[t.category] || 0) + t.amount;
  });

  const ctx = document.getElementById("spendingChart");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(byCat),
      datasets: [{ label: "Expenses", data: Object.values(byCat) }]
    },
    options: { responsive: true }
  });
}

// -------- Actions --------
function addTx(tx) {
  transactions.unshift(tx);
  save();
  render();
}

function deleteTx(id) {
  transactions = transactions.filter(t => t.id !== id);
  save();
  render();
}
window.deleteTx = deleteTx; // make it global for delete button

// -------- Form Handler --------
txForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const tx = {
    id: crypto.randomUUID(),
    date: txForm.date.value,
    desc: txForm.desc.value,
    category: txForm.category.value,
    type: txForm.type.value.toLowerCase(), // income/expense
    amount: Number(txForm.amount.value)
  };

  if (!tx.date || !tx.desc || !tx.amount) {
    alert("Please fill all fields!");
    return;
  }

  addTx(tx);
  txForm.reset();

  // auto-fill today's date again
  txForm.date.value = new Date().toISOString().split("T")[0];
});

// -------- Clear All --------
clearAllBtn.addEventListener("click", () => {
  if (confirm("Delete all transactions?")) {
    transactions = [];
    save();
    render();
  }
});

// -------- Init --------
document.addEventListener("DOMContentLoaded", () => {
  // Auto-fill date with today
  if (txForm.date && !txForm.date.value) {
    txForm.date.value = new Date().toISOString().split("T")[0];
  }
  render();
});
