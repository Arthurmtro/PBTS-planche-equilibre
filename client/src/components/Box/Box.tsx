import { CSSProperties, ReactNode } from "react";
import styles from "./Box.module.css";

interface IBoxParams {
  size?: "lg" | "md" | "sm";
  children?: ReactNode;
}

export default function Box({ size = "md", children }: IBoxParams) {
  const convertSizeParamToSize = () => {
    switch (size) {
      case "lg":
        return { height: "419px", width: "672px" };
      case "md":
        return { height: "253px", width: "559px" };
      case "sm":
        return { height: "419px", width: "424px" };
      default:
        return { height: "253px", width: "559px" };
    }
  };

  return (
    <div
      className={styles.background}
      style={
        {
          "--height": convertSizeParamToSize().height,
          "--width": convertSizeParamToSize().width,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
