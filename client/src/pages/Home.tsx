import ProgressBar from "../components/ProgressBar";
import ProfileBox from "../components/ProfileBox";
import Box from "../components/Box";
import { useProfilesData } from "../contexts/profilesProvider";

export default function HomePage() {
  const { profiles, status, error } = useProfilesData();

  console.log("profiles :>> ", profiles);

  return (
    <div>
      <ProgressBar />
      <Box />
      <ProfileBox />
    </div>
  );
}
