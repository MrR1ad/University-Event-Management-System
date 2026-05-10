import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import "./index.css";
import App from "./App.jsx";
import { msalConfig } from "./auth/msalConfig";
import MsalBridge from "./auth/MsalBridge";

const msalInstance = new PublicClientApplication(msalConfig);

await msalInstance.initialize();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MsalProvider instance={msalInstance}>
      <MsalBridge>
        <App />
      </MsalBridge>
    </MsalProvider>
  </StrictMode>,
);
