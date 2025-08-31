const STORAGE_KEY = "pft-transactions";
const INR = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

let transactions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const txForm = document.getElementById("txForm");
const txBody = document.getElementById("txBody");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const balanceEl = document.getElementById("balance");
const clearAllBtn = document.getElementById("clearAll");

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function render() {
  const income = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  totalIncomeEl.textContent = INR.format(income);
  totalExpenseEl.textContent = INR.format(expense);
  balanceEl.textContent = INR.format(balance);

  txBody.innerHTML = transactions.map(t => `
    <tr>
      <td>${t.date}</td>
      <td>${t.desc}</td>
      <td>${t.category}</td>
      <td><span class="${t.type === "income" ? "badge-income" : "badge-expense"}">
        ${t.type.charAt(0).toUpperCase() + t.type.slice(1)}
      </span></td>
      <td>${INR.format(t.amount)}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteTx('${t.id}')">X</button>
      </td>
    </tr>
  `).join("");
}

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
window.deleteTx = deleteTx;

txForm.addEventListener("submit", e => {
  e.preventDefault();

  const tx = {
    id: crypto.randomUUID(),
    date: txForm.date.value,
    desc: txForm.desc.value,
    category: txForm.category.value,
    type: txForm.type.value.toLowerCase(),
    amount: Number(txForm.amount.value)
  };

  if (!tx.date || !tx.desc || !tx.amount) {
    alert("Please fill all fields!");
    return;
  }
  addTx(tx);
  txForm.reset();
  txForm.date.value = new Date().toISOString().split("T")[0];
});

clearAllBtn.addEventListener("click", () => {
  if (confirm("Delete all transactions?")) {
    transactions = [];
    save();
    render();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (txForm.date && !txForm.date.value) {
    txForm.date.value = new Date().toISOString().split("T")[0];
  }
  render();
});
    
