import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ConfigPage, RootPage } from "./pages";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootPage />} />
          <Route path="/config" element={<ConfigPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
