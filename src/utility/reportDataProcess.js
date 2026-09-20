// src/utils/reportDataProcessor.js
import { isSameDay, isSameWeek, isSameMonth, isSameYear, subDays, subWeeks, subMonths, subYears, parseISO } from "date-fns";

export const processReportData = (transactions = [], categories = []) => {
  const now = new Date();

  // Helper filter function based on tab period
  const filterByPeriod = (txList, period, isPrevious = false) => {
    return txList.filter((tx) => {
      const txDate = parseISO(tx.date);
      let targetDate = now;

      if (isPrevious) {
        if (period === "Daily") targetDate = subDays(now, 1);
        if (period === "Weekly") targetDate = subWeeks(now, 1);
        if (period === "Monthly") targetDate = subMonths(now, 1);
        if (period === "Yearly") targetDate = subYears(now, 1);
      }

      switch (period) {
        case "Daily": return isSameDay(txDate, targetDate);
        case "Weekly": return isSameWeek(txDate, targetDate);
        case "Monthly": return isSameMonth(txDate, targetDate);
        case "Yearly": return isSameYear(txDate, targetDate);
        default: return false;
      }
    });
  };

  const tabs = ["Daily", "Weekly", "Monthly", "Yearly"];
  const dynamicDashboardData = {};

  tabs.forEach((tab) => {
    const currentTx = filterByPeriod(transactions, tab, false);
    const prevTx = filterByPeriod(transactions, tab, true);

    // Calculate Current Totals
    const totalIncome = currentTx
      .filter((t) => t.type === "CASH_IN")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const totalExpense = currentTx
      .filter((t) => t.type === "CASH_OUT")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    // Calculate Previous Totals
    const prevIncome = prevTx
      .filter((t) => t.type === "CASH_IN")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const prevExpense = prevTx
      .filter((t) => t.type === "CASH_OUT")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    // Growth Percentage Calculation
    const getGrowth = (curr, prev) => {
      if (!prev) return curr > 0 ? "+100%" : "0%";
      const diff = ((curr - prev) / prev) * 100;
      return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`;
    };

    // Expense by Category Grouping
    const categoryMap = {};
    currentTx
      .filter((t) => t.type === "CASH_OUT")
      .forEach((t) => {
        const catName = t.categoryDetails?.name || "Other";
        const catColor = t.categoryDetails?.color || "#10B981";
        if (!categoryMap[catName]) {
          categoryMap[catName] = { name: catName, value: 0, color: catColor };
        }
        categoryMap[catName].value += Number(t.amount || 0);
      });

    // Dynamic Balance Trend Chart Generation
    const balanceTrendMap = {};
    currentTx.forEach((t) => {
      const timeKey = new Date(t.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      balanceTrendMap[timeKey] = (balanceTrendMap[timeKey] || 0) + 
        (t.type === "CASH_IN" ? Number(t.amount) : -Number(t.amount));
    });

    const balanceTrend = Object.keys(balanceTrendMap).map((key) => ({
      time: key,
      balance: balanceTrendMap[key],
    }));

    dynamicDashboardData[tab] = {
      totalIncome,
      totalExpense,
      currentBalance: totalIncome - totalExpense,
      incomeGrowth: getGrowth(totalIncome, prevIncome),
      expenseGrowth: getGrowth(totalExpense, prevExpense),
      balanceTrend: balanceTrend.length > 0 ? balanceTrend : [{ time: "N/A", balance: 0 }],
      categories: Object.values(categoryMap),
      comparison: {
        label1: `Previous ${tab}`,
        label2: `Current ${tab}`,
        v1: `৳${prevIncome.toLocaleString()} vs ৳${prevExpense.toLocaleString()}`,
        v2: `৳${totalIncome.toLocaleString()} vs ৳${totalExpense.toLocaleString()}`,
      },
      transactions: currentTx.slice(0, 5), // Top recent 5 transactions
    };
  });

  return dynamicDashboardData;
};