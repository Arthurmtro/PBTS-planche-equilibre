import StatusBar from "../StatusBar";

type ParamsType = {
  children: React.ReactNode;
};

export default function Layout({ children }: ParamsType) {
  return (
    <div>
      <StatusBar />
      {children}
    </div>
  );
}
