import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { setAuthInstance } from "../api";

export default function MsalBridge({ children }) {
  const { instance } = useMsal();

  useEffect(() => {
    setAuthInstance(instance);
  }, [instance]);

  return children;
}
