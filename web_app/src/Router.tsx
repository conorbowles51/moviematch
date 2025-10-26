import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useAuth } from "./context/AuthContext";

const Home = lazy(() => import("./pages/Home"))
const Login = lazy(() => import("./pages/Login"));
const Movie = lazy(() => import("./pages/Movie"));
const Library = lazy(() => import("./pages/Library"));
const Groups = lazy(() => import("./pages/Groups"));
const GroupDetail = lazy(() => import("./pages/GroupDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

function RequireAuth({children} : {children: React.ReactNode}) {
  const { user, loading } = useAuth();
  if (loading) return null; // TODO: Loading animation
  return user ? children : <Navigate to="/login" replace />
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={null}>
        <Home />
      </Suspense>
    )
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={null}>
        <Login />
      </Suspense>
    )
  },
  {
    path: "/movie/:tmdbId",
    element: (
      <Suspense fallback={null}>
        <Movie />
      </Suspense>
    ),
  },
  {
    path: "/library",
    element: (
      <RequireAuth>
        <Suspense fallback={null}>
          <Library />
        </Suspense>
      </RequireAuth>
    ),
  },
  {
    path: "/groups",
    element: (
      <RequireAuth>
        <Suspense fallback={null}>
          <Groups />
        </Suspense>
      </RequireAuth>
    ),
  },
  {
    path: "/groups/:groupId",
    element: (
      <RequireAuth>
        <Suspense fallback={null}>
          <GroupDetail />
        </Suspense>
      </RequireAuth>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={null}>
        <NotFound />
      </Suspense>
    ),
  },
]);