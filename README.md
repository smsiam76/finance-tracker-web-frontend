# Modern Multi-Book Finance Tracker

A modern personal finance management web application designed to help users manage multiple financial ledgers, track income and expenses, transfer money between books, create category-wise budgets, monitor debts, and generate detailed financial reports.

## Live Links

- **Frontend:** https://finance-tracker-web-frontend-byte-builders.vercel.app/
- **Backend API:** https://finance-tracker-web-backend.onrender.com/

---

## Project Overview

**Finance Tracker** allows users to organize their finances into multiple independent **books/ledgers**.

For example, users can create separate books such as:

- Daily Expenses
- December Tour
- Savings
- Business
- Emergency Fund

Each book maintains its own transactions and running balance, making it easier to manage different financial goals independently.

---

## Features

### Multi-Book Management

- Create multiple financial books/ledgers.
- Each book works as an independent ledger.
- Maintain a separate running balance for every book.
- Manage different financial goals independently.

### Cash-In & Cash-Out

- Add income/cash-in transactions.
- Add expense/cash-out transactions.
- Attach a date automatically or select a date manually.
- Add notes to transactions.
- Optionally attach receipt photos.
- Built-in calculator for quick transaction amount calculations.

### Inter-Book Transfers

Transfer money between different books.

**Example:**

`Daily Expenses → Vacation Fund`

The system keeps the transaction and balance of both books updated accordingly.

### Custom Categories

- Categorize income and expense transactions.
- Includes default categories.
- Users can create their own custom categories.
- Categories can be managed according to individual books.

### Category-Based Budgeting

- Create a budget for a specific category within a specific book.
- Track spending against the allocated budget.
- Display real-time budget progress.
- Identify exceeded budgets.
- Monitor category-wise spending.

### Debt & Credit Tracking

Track money that has been:

- Lent to other people.
- Borrowed from other people.

Users can maintain person-wise debt information for better financial tracking.

### Reminders & Recurring Entries

Set reminders for recurring financial activities such as:

- Rent
- Utility bills
- Monthly salary
- Subscription payments
- Other recurring transactions

### Search & Filtering

Quickly find transactions using filters such as:

- Date
- Date range
- Category
- Transaction type
- Book

Supported transaction types include:

- Income
- Expense
- Transfer

---

## Reports & Analytics

### Financial Summaries

Generate:

- Daily summaries
- Weekly summaries
- Monthly summaries
- Yearly summaries

Reports can be viewed:

- Per book
- Across all books

### Visual Charts

Interactive charts help users understand their financial activities through:

- Spending distribution by category
- Balance trends over time
- Income and expense comparisons
- Budget progress

### Export

Financial data can be exported to:

- **PDF**
- **Excel**

---

## Data & Backup

The project is designed with local-first data management and backup/restore capabilities in mind.

Supported/planned backup options include:

- Local backup and restore
- Google Drive backup and restore

---

## 🛠️ Tech Stack

### Frontend

- **React 19**
- **React DOM 19**
- **React Router 8**
- **Tailwind CSS 4**
- **DaisyUI**
- **Vite**

### Data & API

- **Axios**
- **TanStack React Query**
- **Firebase**

### Forms & Validation

- **React Hook Form**

### Data Visualization

- **Recharts**

### PDF & Excel Export

- **jsPDF**
- **jsPDF AutoTable**
- **SheetJS (XLSX)**

### UI, Animation & Icons

- **Framer Motion**
- **Simple Parallax JS**
- **Lucide React**
- **React Icons**

### Notifications & Alerts

- **React Hot Toast**
- **SweetAlert2**

### Other Utilities

- **date-fns**
- **React Helmet Async**

---

## Main Dependencies

```json
{
  "@tailwindcss/vite": "^4.3.3",
  "@tanstack/react-query": "^5.102.8",
  "axios": "^1.20.0",
  "date-fns": "^4.4.0",
  "firebase": "^12.18.0",
  "framer-motion": "^13.1.0",
  "jspdf": "^4.2.1",
  "jspdf-autotable": "^5.0.8",
  "lucide-react": "^1.31.0",
  "react": "^19.2.8",
  "react-helmet-async": "^3.0.0",
  "react-hook-form": "^7.85.0",
  "react-hot-toast": "^2.6.0",
  "react-icons": "^5.7.0",
  "react-router": "^8.3.0",
  "recharts": "^3.10.1",
  "sweetalert2": "^11.26.25",
  "tailwindcss": "^4.3.3",
  "xlsx": "^0.18.5"
}