import { CSSProperties, ReactNode } from "react";
import styles from "./Badge.module.css";

interface IBadgeParams {
  children?: ReactNode;
  color?: "primary" | "success" | "white" | "danger";
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
      className={styles.badge}
      style={
        {
          "--button-background":
            color === "primary"
            ? "var(--color-primary)"
              : color === "success"
              ? "#38EC28"
              : color === "danger"
              ? "#DF0D0D"
              : "#0000",
        } as CSSProperties
      }
    >
      
    </button>
  );
}
