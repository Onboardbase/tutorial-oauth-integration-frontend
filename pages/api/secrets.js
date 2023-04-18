// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { config } from "@/utils/helper";
import axios from "axios";
import { getAPIKey } from "./projects";
import CryptoJS from "crypto-js";

export default async function handler(req, res) {
  const result = await fetchSecrets(req);
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  res.status(200).json({ secrets: result.secrets });
}

async function fetchSecrets(req) {
  try {
    const { apiKey, passphrase } = await getAPIKey(
      req.headers["obb-auth-code"]
    );

    const { project, environment } = req.query;

    const secretsUrl = `https://public.onboardbase.com/api/v1/secrets?project=${project}&environment=${environment}`;
    const secretsResponse = await axios.get(secretsUrl, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        API_KEY: apiKey,
      },
    });

    const secretData = secretsResponse?.data?.data ?? [];
    const plainSecrets = secretData.secrets.map((secret) => {
      return {
        key: CryptoJS.AES.decrypt(secret.key, passphrase).toString(
          CryptoJS.enc.Utf8
        ),
        value: CryptoJS.AES.decrypt(secret.value, passphrase).toString(
          CryptoJS.enc.Utf8
        ),
        id: secret.id,
      };
    });
    return {
      error: null,
      secrets: plainSecrets,
    };
  } catch (error) {
    return {
      error: error.message || "Something went wrong",
      projects: [],
    };
  }
}
