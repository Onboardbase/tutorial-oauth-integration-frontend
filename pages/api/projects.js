// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { config } from "@/utils/helper";


export default async function handler(req, res) {
  const result = await fetchProjects(req);
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  res.status(200).json({ projects: result.projects });
}

async function fetchProjects(req) {
  const body = req.body;
  const authCode = body.authCode;
  if (!authCode) {
    return {
      error: "No auth code found",
      projects: [],
    };
  }

  try {
    const postURl = getOAuthTokenAuthURL(authCode);
    const response = await fetch(postURl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    });
    const getAuthResult = await response.json();
    const apiKey = getAuthResult?.data?.api_key;
    if (!apiKey) {
      return {
        error: "No API key found",
        projects: [],
      };
    }

    const projectsUrl = `https://public.onboardbase.com/api/v1/projects`;
    const projectsResponse = await fetch(projectsUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        API_KEY: apiKey,
      },
    });
    const getProjectResult = await projectsResponse.json();
    const projects = getProjectResult.data ?? [];
    return {
      error: null,
      projects,
    };
  } catch (error) {
    return {
      error: "Something went wrong",
      projects: [],
    };
  }
}

function getOAuthTokenAuthURL(authCode) {
  const { clientId, clientSecret, redirectUrl } = config.obb;
  const postURl = `https://api.onboardbase.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=authorization_code&code=${authCode}&redirect_uri=${redirectUrl}
`;
  return postURl;
}
