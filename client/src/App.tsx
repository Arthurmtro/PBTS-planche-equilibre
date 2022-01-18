import { useState, useEffect } from "react";
import CylinderBox from "./components/CylinderBox";
import { api_url } from "./config";

export default function App() {
  const [infos, setInfos] = useState<any>([]);

  console.log("api_url :>> ", api_url);

  useEffect(() => {
    fetch(`${api_url}/fetchCylindersInfos`)
      .then((response) => response.json())
      .then((res) => setInfos(res));
  }, []);

  return (
    <div>
      <h1>App</h1>
      <button
        onClick={() => {
          fetch(`${api_url}/changeCylinderState?chanel=3&value=1`).then(
            console.log
          );
        }}
      >
        start
      </button>
      {infos.length >= 1 &&
        infos.map((info: any) => <CylinderBox infos={info} />)}
    </div>
  );
}
