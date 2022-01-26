import { QueryClient, QueryClientProvider } from "react-query";
import { Routes, Route } from "react-router-dom";

// Contexts
import CylindersDataProvider from "./contexts/cylindersProdiver";
import ProfilesDataProvider from "./contexts/profilesProvider";
import RunningProfileProvider from "./contexts/runningProvider";

// Components
import Layout from "./components/Layout";
import HomePage from "./pages/Home";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CylindersDataProvider>
        <ProfilesDataProvider>
          <RunningProfileProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                  path="*"
                  element={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <h1>Page not found 404 </h1>
                      <img
                        alt="404"
                        src="https://i.pinimg.com/originals/ce/57/77/ce5777bf7b7bd966ef14f4a0c7e4c845.gif"
                      />
                    </div>
                  }
                />
              </Routes>
            </Layout>
          </RunningProfileProvider>
        </ProfilesDataProvider>
      </CylindersDataProvider>
    </QueryClientProvider>
  );
}
