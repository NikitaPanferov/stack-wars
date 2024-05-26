import { useQuery } from "react-query";
import { fetchConfig } from "./api";
import { Config } from "./types";

export const App = () => {
  const { data, error, isLoading } = useQuery<Config>("config", fetchConfig);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading config</div>;
  }

  return (
    <div>
      <h1>Configuration</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
