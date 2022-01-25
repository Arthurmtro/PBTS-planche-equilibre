import { QueryClient, QueryClientProvider } from "react-query";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Contexts
import CylindersDataProvider from "./contexts/cylindersProdiver";

// Components
import HomePage from "./pages/Home";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CylindersDataProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="*"
              element={
                <>
                  <h1>Page not found 404 </h1>
                  <img
                    alt="404"
                    src="https://i.pinimg.com/originals/ce/57/77/ce5777bf7b7bd966ef14f4a0c7e4c845.gif"
                  />
                </>
              }
            />
          </Routes>
        </Layout>
      </CylindersDataProvider>
    </QueryClientProvider>
  );
}
