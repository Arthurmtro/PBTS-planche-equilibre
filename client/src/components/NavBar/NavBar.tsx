import NavLink from "../NavLink";
import styles from "./NavBar.module.css";

export default function NavBar() {
  return (
    <section className={styles["status-bar"]}>
      <ul>
        <img
          style={{ width: "15rem", marginBottom: "4rem" }}
          alt="404"
          src="https://i.pinimg.com/originals/ce/57/77/ce5777bf7b7bd966ef14f4a0c7e4c845.gif"
        />
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
