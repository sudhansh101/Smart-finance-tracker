txForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const tx = {
    id: crypto.randomUUID(),
    date: txForm.date.value,
    desc: txForm.desc.value,
    category: txForm.category.value,
    type: txForm.type.value.toLowerCase(), // force lowercase
    amount: Number(txForm.amount.value)
  };

  if (!tx.date || !tx.desc || !tx.amount) {
    alert("Please fill all fields!");
    return;
  }

  transactions.unshift(tx);
  save();
  render();
  txForm.reset();
});
