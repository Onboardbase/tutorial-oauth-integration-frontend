import Head from "next/head";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as Api from "@/utils/obb-api";
import Link from "next/link";
import { useRef, useState } from "react";
import { SecretList } from "./get-secrets";

const CreateSecretInputs = ({
  secretKey = "",
  secretValue = "",
  secretComment = "",
  onRemove,
  onChange,
}) => {
  const keyRef = useRef(secretKey);
  const valueRef = useRef(secretValue);
  const commentRef = useRef(secretComment);
  const handleChange = () => {
    onChange({
      key: keyRef.current,
      value: valueRef.current,
      comment: commentRef.current,
    });
  };
  return (
    <div className="flex flex-col gap-2 border bottom-1 p-2 mb-2 w-full">
      <div className="w-full flex items-center justify-center">
        <label id="secret-key" className="w-20 font-bold">
          Key
        </label>
        <input
          id="secret-key"
          className="w-font-bold p-1 flex-1"
          onChange={(e) => {
            keyRef.current = e.currentTarget.value;
            handleChange();
          }}
          defaultValue={keyRef.current}
          placeholder="Secret Key"
          type="text"
        />
      </div>
      <div className="w-full flex items-center justify-center">
        <label id="secret-key" className="w-20 font-bold">
          Value
        </label>
        <input
          className="w-font-bold p-1 flex-1"
          onChange={(e) => {
            valueRef.current = e.currentTarget.value;
            handleChange();
          }}
          defaultValue={valueRef.current}
          placeholder="Secret Value"
          type="text"
        />
      </div>
      <div className="w-full flex items-center justify-center">
        <label id="secret-key" className="w-20 font-bold">
          Comment
        </label>
        <input
          className="w-font-bold p-1 flex-1"
          onChange={(e) => {
            commentRef.current = e.currentTarget.value;
            handleChange();
          }}
          defaultValue={commentRef.current}
          placeholder="Secret Comment"
          type="text"
        />
      </div>
      <div className="flex justify-end">
        <button
          className="hover:bg-slate-800 p-1 border border-1 rounded"
          onClick={onRemove}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

const SecretFields = ({
  secrets = [],
  onRemove = (idx) => {},
  onChange = (idx, data) => {},
}) => {
  return secrets.map((secretData, i) => {
    return (
      <CreateSecretInputs
        key={i}
        secretKey={secretData.key}
        secretValue={secretData.value}
        secretComment={secretData.comment}
        onRemove={() => onRemove(i)}
        onChange={(data) => onChange(i, data)}
      />
    );
  });
};

const ManageSecretFields = ({ onCreateSecrets = (secres = []) => {} }) => {
  const [secrets, setSecrets] = useState([]);
  const handleRemoveSecret = (idx) => {
    setSecrets((secrets) => {
      secrets.splice(idx, 1);
      return [...secrets];
    });
  };

  const handleSecretChange = (idx, data) => {
    setSecrets((secrets) => {
      secrets[idx] = data;
      return [...secrets];
    });
  };
  return (
    <div className="w-auto mt-12">
      <SecretFields
        secrets={secrets}
        onRemove={handleRemoveSecret}
        onChange={handleSecretChange}
      />
      <div className="flex gap-2 my-2">
        <button
          onClick={() =>
            setSecrets((secrets) => [
              ...secrets,
              { key: "", value: "", comment: "" },
            ])
          }
          className="border bottom-1 p-2 rounded bg-zinc-400"
        >
          Add New Secret
        </button>
        {secrets.length > 0 && (
          <button
            className="border bottom-1 p-2 rounded bg-blue-400"
            onClick={() => onCreateSecrets(secrets)}
          >
            Create Secret(s)
          </button>
        )}
      </div>
    </div>
  );
};

export default function OAuth() {
  const router = useRouter();
  const { projectTitle, environmentTitle, projectId, environmentId, authCode } =
    router.query;

  const [state, setState] = useState({ msg: "", color: "bg-red-800" });

  const { data: createSecretsData, mutate: createSecrets } = useMutation(
    async (secrets) => {
      const { data } = await Api.createSecrets(
        authCode,
        projectTitle,
        environmentTitle,
        secrets
      );
      return data.secrets;
    }
  );

  const { data: secrets, refetch: refetchSecrets } = useQuery({
    enabled: false,
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

  const handleCreateSecrets = (secrets = []) => {
    setState({ msg: "creating secrets", color: "bg-blue-800" });

    createSecrets(secrets, {
      onSuccess() {
        setState({
          msg: "secrets created successfully",
          color: "bg-green-800",
        });
        refetchSecrets();
      },
      onError() {
        setState({
          msg: "An error occurred when creating secrets",
          color: "bg-red-800",
        });
      },
    });
  };

  return (
    <>
      <Head>
        <title>
          Onboardbase OAuth - Get Secrets {projectTitle}:{environmentTitle}
        </title>
      </Head>
      <main className={styles.main}>
        <h1 className="font-bold text-2xl" onClick={() => refetchSecrets()}>
          Onboardbase - Secrets [{projectTitle}:{environmentTitle}]
        </h1>

        <ManageSecretFields onCreateSecrets={handleCreateSecrets} />
        {state && state.msg && (
          <div className={`${state.color} border border-1 border-red-50 p-1`}>
            {state.msg}
          </div>
        )}

        {secrets?.length > 0 && (
          <div className="w-full mt-24">
            <h1
              className="font-bold text-xl text-left w-full"
              onClick={() => refetchSecrets()}
            >
              All Secrets
            </h1>
            <SecretList secrets={secrets} />
          </div>
        )}
      </main>
    </>
  );
}
