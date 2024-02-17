import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Oauth2 from "./pages/Oauth2";
import Chat from "./pages/Chat";

const PrivateRouter = () => {
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const PublicRouter = () => {
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "",
    element: <PublicRouter />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "login/oauth",
        element: <Oauth2 />,
      },
    ],
  },

  {
    path: "",
    element: <PrivateRouter />,
    children: [
      {
        path: "chat",
        element: (
          <MainLayout>
            <Chat />
          </MainLayout>
        ),
      },
    ],
  },
]);

export default router;
