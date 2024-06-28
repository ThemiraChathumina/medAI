const baseURL = "http://localhost:5173";

export const config = {
  signInRedirectURL: baseURL,
  signOutRedirectURL: `${baseURL}/login`,
  clientID: "Q3JE26tigybUL9Lv3gyd3MPzyUAa",
  baseUrl: "https://api.asgardeo.io/t/themira",
  scope: ["openid", "profile"],
};
