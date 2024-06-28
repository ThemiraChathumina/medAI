const baseURL = "http://localhost:5173";

export const config = {
  signInRedirectURL: baseURL,
  signOutRedirectURL: `${baseURL}/login`,
  clientID: "YOUR_CLIENT_ID",
  baseUrl: "https://api.asgardeo.io/t/YOUR_TENANT_NAME",
  scope: ["openid", "profile"],
};
