import styles from "./Layout.module.css";

import NavBar from "../NavBar";
import StatusBar from "../StatusBar";

type ParamsType = {
  children: React.ReactNode;
};

export default function Layout({ children }: ParamsType) {
  return (
    <div className={styles.layout}>
      <NavBar />
      <div className={styles["app-content"]}>
        <StatusBar />
        <div className={styles["page-content"]}>{children}</div>
      </div>
    </div>
  );
}
