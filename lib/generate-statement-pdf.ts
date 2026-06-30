import { jsPDF } from "jspdf";
import type { Statement, Transaction } from "./data";

interface StatementPdfInput {
  period: string;
  date: string;
  balance: string;
  accountHolder: string;
  accountType: string;
  accountNumber: string;
  routingNumber: string;
  transactions: Transaction[];
}

export function downloadStatementPdf(input: StatementPdfInput) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pw = doc.internal.pageSize.getWidth();
  const margin = 50;
  let y = 50;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(215, 30, 40);
  doc.text("Wells Fargo", margin, y);
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text("Wells Fargo Bank, N.A. | Member FDIC", margin, y + 16);

  doc.setDrawColor(215, 30, 40);
  doc.setLineWidth(2);
  doc.line(margin, y + 28, pw - margin, y + 28);
  y += 52;

  // Statement info
  doc.setFontSize(14);
  doc.setTextColor(215, 30, 40);
  doc.text("Account Statement", margin, y);
  y += 22;

  doc.setFontSize(10);
  doc.setTextColor(60);
  const info = [
    ["Statement Period", input.period],
    ["Closing Date", input.date],
    ["Account Holder", input.accountHolder],
    ["Account Type", input.accountType],
    ["Account Number", `•••• •••• •••• ${input.accountNumber.slice(-4)}`],
    ["Routing Number", input.routingNumber],
  ];

  for (const [label, value] of info) {
    doc.setFont("helvetica", "normal");
    doc.text(label + ":", margin, y);
    doc.setFont("helvetica", "bold");
    doc.text(value, margin + 140, y);
    y += 16;
  }

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(215, 30, 40);
  doc.text("Closing Balance", margin, y);
  doc.text(input.balance, pw - margin, y, { align: "right" });

  y += 12;
  doc.setDrawColor(230, 232, 235);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pw - margin, y);
  y += 20;

  // Transaction table header
  doc.setFontSize(11);
  doc.setTextColor(215, 30, 40);
  doc.text("Transaction Activity", margin, y);
  y += 18;

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100);
  doc.text("Date", margin, y);
  doc.text("Description", margin + 80, y);
  doc.text("Category", margin + 300, y);
  doc.text("Amount", pw - margin, y, { align: "right" });
  y += 6;
  doc.setDrawColor(200);
  doc.line(margin, y, pw - margin, y);
  y += 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  if (input.transactions.length === 0) {
    doc.setTextColor(140);
    doc.text("No transactions during this statement period.", margin, y);
    y += 16;
  } else {
    for (const t of input.transactions) {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      const dateStr = new Date(t.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const sign = t.type === "credit" ? "+" : "-";
      const amountStr = `${sign}$${t.amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

      doc.setTextColor(26);
      doc.text(dateStr, margin, y);
      doc.text(t.merchant, margin + 80, y);
      doc.setTextColor(100);
      doc.text(t.category, margin + 300, y);
      doc.setTextColor(t.type === "credit" ? 20 : 26);
      doc.text(amountStr, pw - margin, y, { align: "right" });
      y += 14;
    }
  }

  y += 10;
  doc.setDrawColor(230, 232, 235);
  doc.line(margin, y, pw - margin, y);
  y += 20;

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(150);
  doc.text(
    "This statement is for informational purposes. Wells Fargo Bank, N.A. Member FDIC. Equal Housing Lender. NMLS ID 399801.",
    margin,
    y
  );

  const fileName = `WellsFargo_Statement_${input.period.replace(/\s+/g, "_")}.pdf`;
  doc.save(fileName);
}

export function getTransactionsForStatement(
  allTransactions: Transaction[],
  statement: Statement,
  statementIndex: number
): Transaction[] {
  const closingDate = new Date(statement.date);
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - statementIndex, 0);
  startDate.setDate(1);

  return allTransactions.filter((t) => {
    const d = new Date(t.date);
    return d > startDate && d <= closingDate;
  });
}
