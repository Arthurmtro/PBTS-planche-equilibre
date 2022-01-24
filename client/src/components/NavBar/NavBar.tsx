import NavLink from "../NavLink";
import styles from "./NavBar.module.css";

// import Button from "../Button";

export default function NavBar() {
  return (
    <section className={styles["status-bar"]}>
      <ul>
        <NavLink path="/" label="Accueil" icon="home" />
        <NavLink path="/" label="Running" icon="running" />
        <NavLink path="/" label="Configuration" icon="configuration" />
      </ul>
    </section>
  );
}
