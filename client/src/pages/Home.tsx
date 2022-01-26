// Contexts
import { useProfilesData } from "../contexts/profilesProvider";

// Components
import ProgressBar from "../components/ProgressBar";
import ProfileBox from "../components/ProfileBox";

export default function HomePage() {
  const { profiles, status, error } = useProfilesData();

  return (
    <div>
      <ProgressBar />

      <div>
        {status === "loading" || status === "idle" ? (
          <h1>Loading ...</h1>
        ) : (
          <>
            {status === "error" && <h1>Error : {error?.message}</h1>}
            {status === "success" &&
              profiles?.map((profile) => (
                <ProfileBox key={profile.fileName} profile={profile} />
              ))}
          </>
        )}
      </div>
    </div>
  );
}
