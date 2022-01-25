import { CSSProperties, ReactNode } from "react";
import styles from "./Badge.module.css";

interface IBadgeParams {
  children?: ReactNode;
  color?: "primary" | "secondary" | "white" | "danger";
  disabled?: boolean;
}

export default function Badge({
  children,
  color = "primary",
  disabled = false,
}: IBadgeParams) {
  return (
    <button
      disabled={disabled}
      className={styles.button}
      style={
        {
          "--button-background":
            color === "primary"
              ? "var(--color-primary)"
              : color === "secondary"
              ? "var(--color-secondary)"
              : color === "danger"
              ? "#DF0D0D"
              : "#ffff",
          "--button-color": color === "white" ? "#000000" : "#f7f7f7",
        } as CSSProperties
      }
    >
      {children}
    </button>
  );
}
