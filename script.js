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
    // Totals
    const income = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;

    totalIncomeEl.textContent = INR.format(income);
    totalExpenseEl.textContent = INR.format(expense);
    balanceEl.textContent = INR.format(balance);

    // Table
    txBody.innerHTML = transactions
  
