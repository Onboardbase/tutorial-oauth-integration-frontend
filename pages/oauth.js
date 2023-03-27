import Head from "next/head";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";
import { config } from "../utils/helper";
import { useEffect, useState } from "react";
const inter = Inter({ subsets: ["latin"] });

export default function OAuth() {
  const router = useRouter();
  const { code } = router.query;
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("code", code);
      const { clientId, clientSecret, redirectUrl } = config.obb;
      // const clientId = "e18a327e-c247-4483-8660-180e349abddc";
      // const clientSecret = "8VEPTKZJN44HY37XQF8A2RMF9";
      // const redirectUrl = "https://tutorial-oauth-integration.vercel.app/oauth";
      const postURl = `https://api.onboardbase.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=authorization_code&code=${code}&redirect_uri=${redirectUrl}
`;
      console.log("postURl", postURl);
      try {
        const response = await fetch(postURl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        });
        const getAuthResult = await response.json();

        const apiKey = getAuthResult?.data?.api_key;
        console.log("apiKey", apiKey);

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
        console.log("getProjectResult", getProjectResult);
        setProjects(getProjectResult.data);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, [code]);

  return (
    <>
      <Head>
        <title>Onboardbase OAuth - Projects</title>
      </Head>
      {console.log("projects: ", projects)}
      <main className={styles.main}>
        <h1 style={{ padding: "1rem" }} className={inter.className}>
          Onboardbase OAuth - Projects
        </h1>
        {projects.map((project, i) => (
          <h3 key={i}>{project.title}</h3>
        ))}
      </main>
    </>
  );
}
