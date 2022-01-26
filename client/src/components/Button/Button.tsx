import { CSSProperties, ReactNode } from "react";
import styles from "./Button.module.css";

interface IButtonParams {
  children?: ReactNode;
  onClick?: () => {};
  color?: "primary" | "secondary" | "white" | "danger";
  disabled?: boolean;
  thin?: boolean;
}

export default function Button({
  children,
  onClick,
  color = "primary",
  disabled = false,
  thin = false,
}: IButtonParams) {
  return (
    <button
      disabled={disabled}
      className={styles.button}
      onClick={onClick}
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
          "--font-weight": thin ? "thin" : "bold",
        } as CSSProperties
      }
    >
      {children}
    </button>
  );
}
