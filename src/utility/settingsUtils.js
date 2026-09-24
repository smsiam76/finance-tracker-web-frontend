
import useAxios from "../hooks/useAxios";
import { exportToExcel, exportToPDF } from "./exportUtils";

/**
 * Fetches all system collections and saves them as a full JSON payload in LocalStorage.
 * @param {Object} user - Currently authenticated user object.
 * @param {Function} setLastBackup - React state dispatcher to update the backup timestamp display.
 */
export const handleLocalStorageBackup = async (user, setLastBackup) => {
  if (!user?.email) {
    alert("Please log in first!");
    return;
  }

  try {
    const res = await useAxios.get(`/backup/all?email=${user.email}`);

    if (res.status === 200) {
      localStorage.setItem(
        `full_backup_${user.email}`,
        JSON.stringify(res.data)
      );

      const currentTime = new Date().toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      localStorage.setItem("lastBackupTime", currentTime);
      setLastBackup(currentTime);

      alert(
        "All-in-One Backup (Books, Budgets, Debts, Transactions, Categories) successfully saved to Local Storage!"
      );
    }
  } catch (err) {
    console.error("Backup Error:", err);
    alert(err.response?.data?.message || "Failed to take full local backup.");
  }
};

/**
 * Placeholder trigger for Google Drive cloud sync capabilities.
 */
export const handleGoogleDriveBackup = () => {
  alert("Google Drive OAuth API connection is required for cloud syncing.");
};

/**
 * Reads local storage backup data and submits it to the restore API endpoint.
 * @param {Object} user - Currently authenticated user object.
 */
export const handleRestoreData = async (user) => {
  if (!user?.email) {
    alert("Please log in first!");
    return;
  }

  const savedBackup = localStorage.getItem(`full_backup_${user.email}`);
  if (!savedBackup) {
    alert("No full backup found in Local Storage! Please take a backup first.");
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to restore EVERYTHING? All current Books, Budgets, Debts, and Transactions will be overwritten with the backup copy."
  );

  if (!confirmed) return;

  try {
    const parsedBackup = JSON.parse(savedBackup);

    const res = await useAxios.post("/backup/restore-all", {
      email: user.email,
      backupData: parsedBackup,
    });

    if (res.data?.success) {
      localStorage.removeItem(`full_backup_${user.email}`);
      alert(res.data.message || "All system data restored successfully!");
      window.location.reload();
    } else {
      alert(`Restore Failed: ${res.data?.error || "Unknown Error"}`);
    }
  } catch (err) {
    console.error("Restore Error:", err);
    alert(err.response?.data?.error || "Failed to restore full system data.");
  }
};

/**
 * Fetches current transactions and exports them to PDF or Excel.
 * @param {Object} user - Currently authenticated user object.
 * @param {'pdf' | 'excel'} type - Target document format for export.
 */
export const handleExportData = async (user, type) => {
  if (!user?.email) return;

  try {
    const res = await useAxios.get(`/transactions?email=${user.email}`);

    if (type === "excel") {
      exportToExcel(res.data);
    } else if (type === "pdf") {
      exportToPDF(res.data);
    }
  } catch (err) {
    console.error("Failed to fetch data for export:", err);
    alert("Failed to export data. Please try again.");
  }
};

/**
 * Issues a DELETE request to clear all financial data associated with the user account.
 * @param {Object} user - Currently authenticated user object.
 */
export const handleDeleteAllData = async (user) => {
  if (!user?.email) return;

  const confirmed = window.confirm(
    "Are you sure you want to delete all financial data? This action cannot be undone!"
  );
  if (!confirmed) return;

  try {
    const res = await useAxios.delete(`/users/data?email=${user.email}`);

    if (res.data?.success) {
      alert("All data cleared successfully.");
      window.location.reload();
    }
  } catch (err) {
    console.error("Failed to delete user data:", err);
    alert("Failed to delete data. Please try again.");
  }
};