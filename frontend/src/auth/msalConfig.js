export const msalConfig = {
  auth: {
    clientId: "562c6df4-0ce8-4165-8969-f300f4c1842a",
    authority:
      "https://login.microsoftonline.com/2f2dcb5d-f3e1-4f33-8584-dcacd25d604d",
    redirectUri: "http://localhost:5173/auth",
    postLogoutRedirectUri: "http://localhost:5173/",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["api://562c6df4-0ce8-4165-8969-f300f4c1842a/api_access"],
};
