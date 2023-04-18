import Head from "next/head";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";
import { useQuery } from "@tanstack/react-query";
import * as Api from "@/utils/obb-api";
import Link from "next/link";

export const SecretList = ({ secrets = [] }) => {
  return (
    <ul className="flex flex-col justify-self-start w-full my-4">
      {secrets.map((secret, i) => (
        <li key={i} className="text-lg font-bold my-2 capitalize">
          <span className="mr-2">{secret.id}</span>
          <ul className="ml-4">
            <li>KEY: {secret.key}</li>
            <li>VALUE: {secret.value}</li>
          </ul>
        </li>
      ))}
    </ul>
  );
};

export default function OAuth() {
  const router = useRouter();
  const { projectTitle, environmentTitle, projectId, environmentId, authCode } =
    router.query;

  const { data: secrets, refetch: refetchProjects } = useQuery({
    enabled: !!authCode,
    queryKey: ["fetch-secrets"],
    queryFn: async () => {
      const { data } = await Api.fetchSecrets(
        authCode,
        projectTitle,
        environmentTitle
      );
      return data.secrets;
    },
  });

  return (
    <>
      <Head>
        <title>
          Onboardbase OAuth - Get Secrets {projectTitle}:{environmentTitle}
        </title>
      </Head>
      <main className={styles.main}>
        <h1 className="font-bold text-2xl" onClick={() => refetchProjects()}>
          Onboardbase - Secrets [{projectTitle}:{environmentTitle}]
        </h1>
        <Link
          href={`/oauth/create-secrets?projectTitle=${projectTitle}&projectId=${projectId}&environmentTitle=${environmentTitle}&environmentId=${environmentId}&authCode=${authCode}`}
          className={`my-2 rounded border border-green-700 p-1 text-xs font-normal bg-green-500 mr-2 `}
        >
          Create Secrets
        </Link>
        {secrets?.length > 0 && <SecretList secrets={secrets} />}
      </main>
    </>
  );
}
