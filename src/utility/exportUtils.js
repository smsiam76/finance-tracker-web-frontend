import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

// 1. Export Transactions to Excel
export const exportToExcel = (transactions, filename = "Financial_Report.xlsx") => {
  if (!transactions || transactions.length === 0) {
    alert("No data available to export!");
    return;
  }

  // Formatting data for Excel export
  const formattedData = transactions.map((t, index) => ({
    "SL": index + 1,
    "Date": t.date ? new Date(t.date).toLocaleDateString() : "N/A",
    "Type": t.type || "N/A",
    "Amount (BDT)": t.amount || 0,
    "Book Name": t.bookDetails?.name || "N/A",
    "Note": t.note || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
  XLSX.writeFile(workbook, filename);
};

// 2. Export Transactions to PDF
export const exportToPDF = (transactions, filename = "Financial_Report.pdf") => {
  if (!transactions || transactions.length === 0) {
    alert("No data available to export!");
    return;
  }

  const doc = new jsPDF();

  // PDF Header Title
  doc.setFontSize(16);
  doc.text("Financial Transactions Report", 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

  // Table Columns & Rows setup
  const tableColumn = ["#", "Date", "Type", "Amount (BDT)", "Note"];
  const tableRows = transactions.map((t, index) => [
    index + 1,
    t.date ? new Date(t.date).toLocaleDateString() : "N/A",
    t.type,
    t.amount,
    t.note || "-",
  ]);

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 28,
    theme: "striped",
    headStyles: { fillColor: [0, 71, 43] }, // Matches primary theme color
  });

  doc.save(filename);
};