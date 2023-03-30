export const config = {
  obb: {
    clientId: process.env.OBB_CLIENT_ID,
    clientSecret: process.env.OBB_CLIENT_SECRET,
    redirectUrl: process.env.OBB_REDIRECT_URL,
  },
  apiBaseUrl: "https://tutorial-oauth-integration.vercel.app/api",
};

export const getOBBOauthUrl = (state) => {
  const { clientId, redirectUrl, apiBaseUrl } = config.obb;
  console.log("apiBaseUrl", apiBaseUrl);
  const scopes = "read.secrets,read.projects";
  return `https://app.onboardbase.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}&scopes='${scopes}'&state='${state}'`;
};
