// Contexts
import { useCylindersData } from "../../contexts/cylindersProdiver";

export default function StatusBar() {
  const { status, error } = useCylindersData();

  if (status === "loading") {
    return <div>...</div>;
  }
  if (status === "error") {
    return <div>{error!.message}</div>;
  }

  return (
    <div>
      <span>Status infos : {status}</span>
    </div>
  );
}
