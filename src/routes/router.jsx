import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home/Home";

import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import SignIn from "../pages/Authentication/SignIn/SignIn";
import SignUp from "../pages/Authentication/SignUp/SignUp";
import MyBooks from "../pages/Dashboard/DashboardBooks/DashboardBooks";
import BookDetails from "../pages/Dashboard/DashboardBooks/BookDetails";
import ErrorPage from "../component/Shared/ErrorPage/ErrorPage";
import { CashIn } from "../pages/Dashboard/Transactions/CashIn/CashIn";
import { CashOut } from "../pages/Dashboard/Transactions/CashOut/Cashout";
import TransferMoney from "../pages/Dashboard/Transactions/TransferMoney/TransferMoney";
import { ReportAnalysis } from "../pages/Dashboard/ReportAnalysis/ReportAnalysis";
import { TransactionHistory } from "../pages/Dashboard/TransactionHistory/TransactionHistory";
import { LentAndBorrowed } from "../pages/Dashboard/Lent&Borrowed/Lent&Borrowed";
import { SettingsPage } from "../pages/Dashboard/Settings/SettingsPage";
import { Budget } from "../pages/Dashboard/Budget/Budget";
import { Categories } from "../pages/Dashboard/Categories/Categories";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        Component: Home,
      },
    ],
  },

  {
    path: "/dashboard",
    element: <DashboardLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "my-books",
        element: <MyBooks />,
      },
      {
        path: "my-books/book-details/:id",
        element: <BookDetails />,
      },
      {
        path: "cash-in",
        element: <CashIn />,
      },
      {
        path: "cash-out",
        element: <CashOut />,
      },
      {
        path: "transfer-money",
        element: <TransferMoney />,
      },
      {
        path: "reports",
        element: <ReportAnalysis />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "transaction-history",
        element: <TransactionHistory />,
      },
      {
        path: "lent-and-borrowed",
        element: <LentAndBorrowed />,
      },
      {
        path: "budget-management",
        element: <Budget />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },

  {
    path: "/sign-in",
    Component: SignIn,
  },
  {
    path: "/sign-up",
    Component: SignUp,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;
