import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

// 1. Export All Backend Data to Multi-Sheet Excel (Enhanced Design & Spacing)
export const exportAllDataToExcel = (
  exportData,
  filename = "Complete_Financial_Report.xlsx"
) => {
  const {
    transactions = [],
    books = [],
    categories = [],
    budgets = [],
    debts = [],
    reminders = [],
  } = exportData || {};

  const workbook = XLSX.utils.book_new();

  // Helper utility to format and apply spacing/width to sheets
  const addStyledSheet = (sheetData, sheetName) => {
    if (!sheetData || sheetData.length === 0) return;

    // 1. Create Worksheet from JSON
    const worksheet = XLSX.utils.json_to_sheet(sheetData);

    // 2. Auto-Calculate Column Widths (Proper Spacing)
    const objectKeys = Object.keys(sheetData[0]);
    const colWidths = objectKeys.map((key) => {
      const maxContentLength = sheetData.reduce((max, row) => {
        const val = row[key] !== null && row[key] !== undefined ? String(row[key]) : "";
        return Math.max(max, val.length);
      }, key.length);

      // Add extra padding (+4) so columns don't look squeezed
      return { wch: Math.max(maxContentLength + 4, 12) };
    });

    worksheet["!cols"] = colWidths;

    // 3. Set Header Row Height (Row Spacing)
    worksheet["!rows"] = [
      { hpt: 25 }, // Header row height (25pt)
      ...sheetData.map(() => ({ hpt: 20 })) // Data rows height (20pt)
    ];

    // 4. Freeze Header Row (Scrollable Content)
    worksheet["!views"] = [{ state: "frozen", ySplit: 1 }];

    // 5. Append to Workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  };

  // SHEET 1: Transactions List
  if (transactions.length > 0) {
    const formattedTx = transactions.map((t, i) => ({
      SL: i + 1,
      Date: t.date ? new Date(t.date).toLocaleDateString() : "N/A",
      Type: t.type || "N/A",
      "Amount (BDT)": t.amount || 0,
      Category: t.category || "N/A",
      "Book ID": t.bookId || "N/A",
      Note: t.note || "-",
    }));
    addStyledSheet(formattedTx, "Transactions");
  }

  // SHEET 2: Books / Ledgers Summary
  if (books.length > 0) {
    const formattedBooks = books.map((b, i) => ({
      SL: i + 1,
      "Book Name": b.bookName || b.title || "N/A",
      "Opening Balance": b.openingBalance || 0,
      "Current Balance": b.currentBalance || 0,
      "Total Income": b.totalIncome || 0,
      "Total Expense": b.totalExpense || 0,
    }));
    addStyledSheet(formattedBooks, "Books");
  }

  // SHEET 3: Debts & Loans
  if (debts.length > 0) {
    const formattedDebts = debts.map((d, i) => ({
      SL: i + 1,
      "Person Name": d.personName || d.title || "N/A",
      Type: d.type || "N/A",
      "Total Amount": d.amount || 0,
      "Remaining Balance": d.remainingBalance || 0,
      Status: d.status || "N/A",
      "Due Date": d.dueDate ? new Date(d.dueDate).toLocaleDateString() : "N/A",
    }));
    addStyledSheet(formattedDebts, "Debts & Loans");
  }

  // SHEET 4: Budget Limits
  if (budgets.length > 0) {
    const formattedBudgets = budgets.map((bg, i) => ({
      SL: i + 1,
      Category: bg.category || "N/A",
      "Budget Amount": bg.budgetAmount || 0,
      Month: bg.month || "N/A",
    }));
    addStyledSheet(formattedBudgets, "Budgets");
  }

  // SHEET 5: Payment Reminders
  if (reminders.length > 0) {
    const formattedReminders = reminders.map((r, i) => ({
      SL: i + 1,
      Title: r.title || "N/A",
      Amount: r.amount || 0,
      Type: r.type || "N/A",
      "Next Due Date": r.nextDueDate
        ? new Date(r.nextDueDate).toLocaleDateString()
        : "N/A",
      Status: r.status || "N/A",
    }));
    addStyledSheet(formattedReminders, "Reminders");
  }

  // SHEET 6: Categories
  if (categories.length > 0) {
    const formattedCat = categories.map((c, i) => ({
      SL: i + 1,
      "Category Name": c.name || "N/A",
      Type: c.isDefault ? "Default" : "Custom",
    }));
    addStyledSheet(formattedCat, "Categories");
  }

  // Trigger file download
  XLSX.writeFile(workbook, filename);
};

// 2. Export Single Transactions Array to PDF
export const exportToPDF = (
  transactions,
  filename = "Financial_Report.pdf"
) => {
  if (!transactions || transactions.length === 0) {
    alert("No data available to export!");
    return;
  }

  const doc = new jsPDF();

  // Header
  doc.setFontSize(16);
  doc.text("Financial Transactions Report", 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

  const tableColumn = ["#", "Date", "Type", "Amount (BDT)", "Note"];
  const tableRows = transactions.map((t, index) => [
    index + 1,
    t.date ? new Date(t.date).toLocaleDateString() : "N/A",
    t.type || "N/A",
    t.amount || 0,
    t.note || "-",
  ]);

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 28,
    theme: "striped",
    headStyles: { fillColor: [0, 71, 43] },
  });

  doc.save(filename);
};