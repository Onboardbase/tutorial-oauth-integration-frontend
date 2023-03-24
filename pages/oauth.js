import Head from "next/head";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";
import { config } from "./helper";
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
      const postURl = `https://api.onboardbase.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=authorization_code&code=${code}&redirect_uri=${redirectUrl}
`;
      console.log("postURl", postURl);
      const response = await fetch(postURl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setProjects(data);
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
