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


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
        {
            index: true,
            Component: Home
        },
    ]
  },

  {
    path: "/dashboard",
    element: <DashboardLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <DashboardHome />
      },
      {
        path: "my-books",
        element: <MyBooks />
      },
      {
        path: "my-books/:id",
        element: <BookDetails />
      }
    ]
  },



  {
    path: "/sign-in",
    Component: SignIn
  },
  {
    path: "/sign-up",
    Component: SignUp
  },
  {
    path: "*",
    element: <ErrorPage />
  }

]);

export default router;