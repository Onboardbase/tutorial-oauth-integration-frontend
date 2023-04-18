// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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
    const { secrets } = req.body;
    const encryptedSecrets = secrets
      .map((secret) => {
        /**
         * The frontend is expected to send us an array of encrypted secrets
         * OBB expects encrypted secrets using AES and the API-Key's passphrase as the encryption key
         * We need to go through all the secrets and encrypt them before we send them over to onbaordbase
         * If we don't encrypt properly OR we don't use the right key(api_key passphrase) OBB API would return bad encryption error
         */
        return {
          key: CryptoJS.AES.encrypt(secret.key, passphrase).toString(),
          value: CryptoJS.AES.encrypt(secret.value, passphrase).toString(),
          comment: CryptoJS.AES.encrypt(secret.value, passphrase).toString(),
        };
      })
      .filter((secret) => secret.key || secret.comment || secret.value);

    if (!encryptedSecrets.length) {
      throw new Error("Bad Secret Inputs Detected");
    }

    const secretsUrl = `https://public.onboardbase.com/api/v1/secrets?project=${project}&environment=${environment}`;
    const secretsResponse = await axios.post(
      secretsUrl,
      {
        secrets: encryptedSecrets,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          API_KEY: apiKey,
        },
      }
    );
    /**
     * The returned data by this API is an array of encrypted secrets.
     * If you decide to return the secrets back to your frotnend, you might want to decrypt it with your API Key passphrase
     */

    // const secretData = secretsResponse?.data?.data ?? [];
    // const plainSecrets = secretData.secrets.map((secret) => {
    //   return {
    //     key: CryptoJS.AES.decrypt(secret.key, passphrase).toString(
    //       CryptoJS.enc.Utf8
    //     ),
    //     value: CryptoJS.AES.decrypt(secret.value, passphrase).toString(
    //       CryptoJS.enc.Utf8
    //     ),
    //     id: secret.id,
    //   };
    // });
    return {
      error: null,
      message: "Secrets Created Successfully",
    };
  } catch (error) {
    return {
      error: error.message || "Something went wrong",
      secrets: [],
    };
  }
}
