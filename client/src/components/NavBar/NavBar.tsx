import NavLink from "../NavLink";
import styles from "./NavBar.module.css";

export default function NavBar() {
  return (
    <section className={styles["status-bar"]}>
      <h1>LOGO</h1>
      <ul>
        <NavLink path="/" label="Accueil" icon="home" />
        <NavLink path="/running" label="Running" icon="running" />
        <NavLink
          path="/configuration"
          label="Configuration"
          icon="configuration"
        />
      </ul>
      <span>Sheeshh</span>
    </section>
  );
}
