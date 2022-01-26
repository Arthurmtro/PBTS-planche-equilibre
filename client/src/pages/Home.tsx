import Box from "../components/Box";
import ProfileBox from "../components/ProfileBox";
import ProgressBar from "../components/ProgressBar";

export default function HomePage() {
  return (  
    <div>
      <ProgressBar />
      <Box />
      <ProfileBox />
      <ProfileBox />
      <ProfileBox />
    </div>
  );
}
