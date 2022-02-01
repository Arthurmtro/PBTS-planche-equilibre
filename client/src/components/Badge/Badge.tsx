import { CSSProperties } from "react";
import styles from "./Badge.module.css";

interface IBadgeParams {
  color?: "primary" | "success" | "white" | "danger";
  disabled?: boolean;
}

export default function Badge({
  color = "primary",
  disabled = false,
}: IBadgeParams) {
  return (
    <button
      disabled={disabled}
      className={styles.badge}
      style={
        {
          "--button-background":
            color === "primary"
              ? "var(--color-primary)"
              : color === "success"
              ? "var(--color-success)"
              : color === "danger"
              ? "var(--color-danger)"
              : "#0000",
        } as CSSProperties
      }
    ></button>
  );
}
