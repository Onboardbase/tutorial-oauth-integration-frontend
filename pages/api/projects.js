// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { config } from "@/utils/helper";
import axios from "axios";

export default async function handler(req, res) {
  const result = await fetchProjects(req);
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  res.status(200).json({ projects: result.projects });
}

async function fetchProjects(req) {
  try {
    const { apiKey } = await getAPIKey(req.headers["obb-auth-code"]);

    const projectsUrl = `https://public.onboardbase.com/api/v1/projects`;
    const projectsResponse = await axios.get(projectsUrl, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        API_KEY: apiKey,
      },
    });

    const projects = projectsResponse?.data?.data ?? [];
    return {
      error: null,
      projects,
    };
  } catch (error) {
    return {
      error: error.message || "Something went wrong",
      projects: [],
    };
  }
}

export const getAPIKey = async (authCode = "") => {
  if (!authCode) {
    throw new Error("No auth code found");
  }
  const { clientId, clientSecret, redirectUrl } = config.obb;
  const postURl = `https://api.onboardbase.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=authorization_code&code=${authCode}&redirect_uri=${redirectUrl}`;

  const getAuthResult = await axios.post(
    postURl,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    }
  );

  if (getAuthResult.data.errors.length) {
    console.log(getAuthResult.data.errors);
    throw new Error(getAuthResult.data.errors[0].message);
  }

  const { api_key: apiKey, passphrase } = getAuthResult?.data?.data;
  if (!apiKey) {
    throw new Error("No API key found");
  }

  return { apiKey, passphrase };
};
