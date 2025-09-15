const form = document.getElementById("entryForm");
const tableBody = document.querySelector("#journalTable tbody");
const totalDebit = document.getElementById("totalDebit");
const totalCredit = document.getElementById("totalCredit");

let entries = JSON.parse(localStorage.getItem("journalEntries")) || [];

function renderEntries() {
  tableBody.innerHTML = "";
  let debitSum = 0,
    creditSum = 0;

  entries.forEach((entry, index) => {
    let row = document.createElement("tr");
    row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.account}</td>
            <td>${entry.description}</td>
            <td>${entry.debit.toFixed(2)}</td>
            <td>${entry.credit.toFixed(2)}</td>
            <td><button class="btn btn-danger btn-sm" onclick="deleteEntry(${index})">حذف</button></td>
        `;
    tableBody.appendChild(row);
    debitSum += entry.debit;
    creditSum += entry.credit;
  });

  totalDebit.textContent = debitSum.toFixed(2);
  totalCredit.textContent = creditSum.toFixed(2);
}

function deleteEntry(index) {
  if (confirm("هل أنت متأكد من حذف هذا القيد؟")) {
    entries.splice(index, 1);
    localStorage.setItem("journalEntries", JSON.stringify(entries));
    renderEntries();
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const account = document.getElementById("account").value;
  const description = document.getElementById("description").value;
  const debit = parseFloat(document.getElementById("debit").value) || 0;
  const credit = parseFloat(document.getElementById("credit").value) || 0;

  if (debit === 0 && credit === 0) {
    alert("يجب إدخال قيمة في المدين أو الدائن.");
    return;
  }

  const entry = {
    date: new Date().toLocaleDateString("ar-EG"),
    account,
    description,
    debit,
    credit
  };

  entries.push(entry);
  localStorage.setItem("journalEntries", JSON.stringify(entries));
  form.reset();
  renderEntries();
});

renderEntries();
async function exportPDF() {
  const table = document.getElementById("journalTable");

  const canvas = await html2canvas(table);
  const imgData = canvas.toDataURL("image/png");

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight);
  pdf.save("دفتر_اليومية.pdf");
}
function exportExcel() {
  const worksheet = XLSX.utils.json_to_sheet(entries);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "دفتر اليومية");
  XLSX.writeFile(workbook, "دفتر_اليومية.xlsx");
}
function showIncomeStatement() {
  let income = 0;
  let expense = 0;

  entries.forEach((e) => {
    const acc = e.account.toLowerCase();
    if (
      acc.includes("ايراد") ||
      acc.includes("دخل") ||
      acc.includes("مبيعات")
    ) {
      income += e.credit;
    }
    if (acc.includes("مصروف") || acc.includes("تكلفة")) {
      expense += e.debit;
    }
  });

  const net = income - expense;

  document.getElementById("totalIncome").textContent = income.toFixed(2);
  document.getElementById("totalExpense").textContent = expense.toFixed(2);
  document.getElementById("netProfit").textContent = net.toFixed(2);

  document.getElementById("incomeStatement").style.display = "block";
}