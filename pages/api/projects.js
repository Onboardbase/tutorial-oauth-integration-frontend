import { config } from "../helper";

export default async function projects(req, res) {
  const query = req.query;
  const { code } = query;

  // use the information from the query to get the products
  // then send the data back to the client
  const { clientId, clientSecret, redirectUrl } = config.obb;
  const postURl = `https://api.onboardbase.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=authorization_code&code=${code}&redirect_uri=${redirectUrl}
`;
  console.log("postURl", postURl);
  const response = await fetch(postURl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
}
