import Head from "next/head";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";
import { useQuery } from "@tanstack/react-query";
import * as Api from "@/utils/obb-api";
import Link from "next/link";

const EnvironmentActions = ({ project, environment, authCode = "" }) => {
  const environmentActions = [
    {
      url: "/oauth/get-secrets",
      label: "Fetch Secrets",
      color: "bg-blue-500",
      border: "border-sky-500",
    },
    {
      url: "/oauth/create-secrets",
      label: "Create Secret",
      border: "border-green-700",
      color: "bg-green-500",
    },
    // {
    //   url: "/oauth/get-webhooks",
    //   label: "Get Webooks",
    //   color: "bg-yellow-500",
    //   border: "border-yellow-700",
    // },
    // {
    //   url: "/oauth/create-webhooks",
    //   label: "Create Webooks",
    //   color: "bg-orange-500",
    //   border: "border-red-700",
    // },
  ];
  return environmentActions.map((action) => {
    return (
      project &&
      environment && (
        <Link
          key={action.url}
          href={`${action.url}?projectTitle=${project.title}&projectId=${project.id}&environmentTitle=${environment.title}&environmentId=${project.id}&authCode=${authCode}`}
          className={`rounded border ${action.border} p-1 text-xs font-normal ${action.color} mr-2 `}
        >
          {action.label}
        </Link>
      )
    );
  });
};

const EnvironmentList = ({ environments = [], project, authCode = "" }) => {
  return (
    <ul className="ml-3">
      {environments.map((environment, i) => {
        return (
          <li key={i}>
            <span className="mr-2 text-sm">{environment.title}</span>
            <EnvironmentActions
              project={project}
              environment={environment}
              authCode={authCode}
            />
          </li>
        );
      })}
    </ul>
  );
};

const ProjectList = ({ projects = [], authCode = "" }) => {
  console.log(projects);
  return (
    <ul className="flex flex-col justify-self-start w-full my-4">
      {projects.map((project, i) => (
        <li key={i} className="text-lg font-bold my-2 capitalize">
          <span className="mr-2">{project.title}</span>
          <EnvironmentList
            environments={project.environments}
            project={{ title: project.title, id: project.id }}
            authCode={authCode}
          />
        </li>
      ))}
    </ul>
  );
};

export default function OAuth() {
  const router = useRouter();
  const { code } = router.query;

  const { data: projects, refetch: refetchProjects } = useQuery({
    enabled: !!code,
    queryKey: ["fetch-projects"],
    queryFn: async () => {
      const { data } = await Api.fetchProjects(code);
      return data.projects;
    },
  });

  return (
    <>
      <Head>
        <title>Onboardbase OAuth - Projects</title>
      </Head>
      <main className={styles.main}>
        <h1 className="font-bold text-3xl" onClick={() => refetchProjects()}>
          Onboardbase - Projects
        </h1>

        {projects?.length > 0 && (
          <ProjectList projects={projects} authCode={code} />
        )}
      </main>
    </>
  );
}
