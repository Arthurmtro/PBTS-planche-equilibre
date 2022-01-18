import { useState, useEffect } from "react";

export default function App() {
  const [apiRes, setApiRes] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:8080/testAPI")
      .then((res) => res.text())
      .then((res) => setApiRes(res));
  }, []);

  return (
    <div>
      <h1>App</h1>
      <span>Api Res: {apiRes} </span>
      <button
        onClick={() => {
          fetch(
            "http://pied.local:8080/api/changeCylinderState?chanel=3&value=1"
          ).then(console.log);
        }}
      >
        start
      </button>
    </div>
  );
}
