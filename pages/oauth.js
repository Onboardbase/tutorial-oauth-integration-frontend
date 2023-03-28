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

      const apiBaseUrl = config.apiBaseUrl;
      const postURl = `${apiBaseUrl}/projects`;
      try {
        const response = await fetch(postURl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({ authCode: code }),
        });
        const result = await response.json();
        setProjects(result.projects ?? []);
      } catch (error) {
        setProjects([]);
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
      <main className={styles.main}>
        <h1 style={{ padding: "1rem" }} className={inter.className}>
          Onboardbase OAuth - Projects
        </h1>
        <ul>
          {projects.map((project, i) => (
            <li key={i} className={inter.className}>
              {project.title}
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
