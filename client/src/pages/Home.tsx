// Contexts
import { useProfilesData } from "../contexts/profilesProvider";

// Components
import ProgressBar from "../components/ProgressBar";
import ProfileBox from "../components/ProfileBox";

export default function HomePage() {
  const { profiles, status, error } = useProfilesData();

  console.log("profiles :>> ", profiles);

  return (
    <div>
      <ProgressBar />
      {profiles?.map((profile) => (
        <ProfileBox key={profile.fileName} profile={profile} />
      ))}
    </div>
  );
}
