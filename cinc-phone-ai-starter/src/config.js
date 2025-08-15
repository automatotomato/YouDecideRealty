import dotenv from "dotenv";
dotenv.config();
export const config = {
  clientId: process.env.CINC_CLIENT_ID || "",
  clientSecret: process.env.CINC_CLIENT_SECRET || "",
  redirectUri: process.env.CINC_REDIRECT_URI || "",
  port: Number(process.env.PORT || 3000),
  apiBase: "https://public.cincapi.com/v2/site",
  authAuthorize: "https://authv2.cincapi.com/integrator/authorize",
  authToken: "https://authv2.cincapi.com/integrator/token",
};
