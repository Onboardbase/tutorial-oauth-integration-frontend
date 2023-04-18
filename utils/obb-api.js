import axios from "axios";

const makeRequest = async (url, authCode, method = "GET", body = {}) => {
  const resp = await axios(url, {
    method,
    headers: {
      "obb-auth-code": authCode,
    },
    data: method == "GET" ? null : body,
  });

  return {
    status: resp.status,
    data: resp.data,
  };
};

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3000`
    : "https://tutorial-oauth-integration.vercel.app";

const makeURL = (pathName) => `${BASE_URL}/api${pathName}`;

export const fetchProjects = async (authCode) => {
  return makeRequest(makeURL("/projects"), authCode, "POST");
};

export const fetchSecrets = async (
  authCode,
  projectTitle,
  environmentTitle
) => {
  return makeRequest(
    makeURL(`/secrets?project=${projectTitle}&environment=${environmentTitle}`),
    authCode,
    "GET"
  );
};

export const createSecrets = async (
  authCode,
  projectTitle,
  environmentTitle,
  secrets = []
) => {
  return makeRequest(
    makeURL(
      `/create-secrets?project=${projectTitle}&environment=${environmentTitle}`
    ),
    authCode,
    "POST",
    { secrets }
  );
};
