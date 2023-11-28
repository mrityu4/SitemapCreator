import { Navigate, Outlet, useLocation } from "react-router-dom";

import { usePocket } from "../contexts/PocketContext";

export const RequireAuth = () => {
  const ctx = usePocket();
  const location = useLocation();

  if (!ctx?.user) {
    return (
      <Navigate to={{ pathname: "/sign-in" }} state={{ location }} replace />
    );
  }

  return <Outlet />;
};
