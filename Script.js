const STORAGE_KEY = "pft-transactions";
const INR = new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR"});

let transactions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const txForm = document.getElementById("txForm");
const txBody = document.getElementById("txBody");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const balanceEl = document.getElementById("balance");
const clearAllBtn = document.getElementById("clearAll");
let chart;

function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions)); }

function render() {
  // totals
  const income = transactions.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const expense = transactions.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  totalIncomeEl.textContent = INR.format(income);
  totalExpenseEl.textContent = INR.format(expense);
  balanceEl.textContent = INR.format(income - expense);

  // table
  txBody.innerHTML = transactions.map(t=>`
    <tr>
      <td>${t.date}</td>
      <td>${t.desc}</td>
      <td>${t.category}</td>
      <td><span class="${t.type==="income"?"badge-income":"badge-expense"}">${t.type}</span></td>
      <td>${INR.format(t.amount)}</td>
      <td><button class="btn btn-sm btn-danger" onclick="delTx('${t.id}')">X</button></td>
    </tr>`).join("");

  // chart
  const byCat = {};
  transactions.filter(t=>t.type==="expense").forEach(t=>{
    byCat[t.category]=(byCat[t.category]||0)+t.amount;
  });
  const ctx=document.getElementById("spendingChart");
  if(chart) chart.destroy();
  chart=new Chart(ctx,{type:"bar",data:{labels:Object.keys(byCat),datasets:[{label:"Expenses",data:Object.values(byCat)}]}});
}

function addTx(tx){ transactions.unshift(tx); save(); render(); }
function delTx(id){ transactions=transactions.filter(t=>t.id!==id); save(); render(); }
window.delTx = delTx;

txForm.addEventListener("submit",(e)=>{
  e.preventDefault();
  const tx={id:crypto.randomUUID(),date:txForm.date.value,desc:txForm.desc.value,category:txForm.category.value,type:txForm.type.value,amount:+txForm.amount.value};
  addTx(tx);
  txForm.reset();
});

clearAllBtn.addEventListener("click",()=>{
  if(confirm("Delete all?")){ transactions=[]; save(); render(); }
});

render();
