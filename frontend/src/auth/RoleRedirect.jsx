import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "./msalConfig";
import { getMe } from "../api";

export default function RoleRedirect() {
  const isE2ETest = import.meta.env.VITE_E2E_TEST === "true";

  const isAuthenticated = useIsAuthenticated();
  const { instance, inProgress } = useMsal();
  const [target, setTarget] = useState(isE2ETest ? "/student" : null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function run() {
      if (isE2ETest) {
        setTarget("/student");
        return;
      }

      if (inProgress !== "none") return;

      if (!isAuthenticated) {
        await instance.loginRedirect(loginRequest);
        return;
      }

      try {
        const me = await getMe();
        const role = me.primaryRole || me.roles?.[0] || "Student";

        if (role === "Admin") setTarget("/admin");
        else if (role === "Organizer") setTarget("/organizer");
        else setTarget("/student");
      } catch (err) {
        console.error(err);
        setError("Login worked, but the backend rejected or failed the token.");
      }
    }

    run();
  }, [isAuthenticated, inProgress, instance, isE2ETest]);

  if (target) {
    return <Navigate to={target} replace />;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Signing you in...</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
}