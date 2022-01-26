import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Routes, Route } from "react-router-dom";

// Contexts
import CylindersDataProvider from "./contexts/cylindersProdiver";
import ProfilesDataProvider from "./contexts/profilesProvider";
import RunningProfileProvider, {
  useRunningProfile,
} from "./contexts/runningProvider";

// Components
import Layout from "./components/Layout";
import HomePage from "./pages/Home";

const queryClient = new QueryClient();

var interval: NodeJS.Timer;

export default function App() {
  const [startedTime, setStartedTime] = useState(0);

  const { runningProfile, setRunningProfile, timeSpend, setTimeSpend } =
    useRunningProfile();

  useEffect(() => {
    if (runningProfile === null) {
      return setTimeSpend(0);
    }

    const d = new Date();
    setStartedTime(Math.round(d.getTime()));

    console.log("StartedTime :>> ", Math.round(d.getTime()));

    interval = setInterval(() => {
      const d = new Date();
      setTimeSpend(Math.round(d.getTime()) - startedTime);

      console.log("timeSpend :>> ", Math.round(d.getTime()) - startedTime);
      console.log("runningProfile?.duration :>> ", runningProfile.duration);
    }, 1000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runningProfile]);

  useEffect(() => {
    if (timeSpend === 0) return;
    if (runningProfile === null || timeSpend >= runningProfile?.duration) {
      clearInterval(interval);
      setTimeSpend(0);
      setRunningProfile(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeSpend]);

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
          </RunningProfileProvider>
        </ProfilesDataProvider>
      </CylindersDataProvider>
    </QueryClientProvider>
  );
}
