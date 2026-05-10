import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "./msalConfig";
import { getMe } from "../api";

export default function ProtectedRoute({ allowedRoles, children }) {
  const isAuthenticated = useIsAuthenticated();
  const { instance, inProgress } = useMsal();
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    async function run() {
      if (inProgress !== "none") return;

      if (!isAuthenticated) {
        await instance.loginRedirect(loginRequest);
        return;
      }

      const me = await getMe();
      const roles = me.roles || [];

      setAllowed(roles.some((role) => allowedRoles.includes(role)));
    }

    run();
  }, [allowedRoles, inProgress, instance, isAuthenticated]);

  if (allowed === null) {
    return <div style={{ padding: 40 }}>Checking access...</div>;
  }

  if (!allowed) {
    return <Navigate to="/" replace />;
  }

  return children;
}
