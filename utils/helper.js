export const config = {
  obb: {
    clientId: process.env.OBB_CLIENT_ID,
    clientSecret: process.env.OBB_CLIENT_SECRET,
    redirectUrl: process.env.OBB_REDIRECT_URL,
  },
};

export const getOBBOauthUrl = (state) => {
  const { clientId, redirectUrl } = config.obb;
  const scopes = "read.secrets,read.projects";
  return `https://app.onboardbase.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}&scopes='${scopes}'&state='${state}'`;
};

// https://app.onboardbase.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scopes='read.secrets,read.projects'&state="{"hi":"there"}"`

// https://app.onboardbase.com/oauth/authorize?response_type=code&client_id=e18a327e-c247-4483-8660-180e349abddc&redirect_uri=https://tutorial-oauth-integration.vercel.app/&scopes='read.secrets,read.projects'&state="{"hi":"there"}"
