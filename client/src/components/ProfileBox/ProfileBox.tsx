import styles from "./ProfileBox.module.css";
import Box from "../Box";
import Button from "../Button";
import Badge from "../Badge";

export default function ProfileBox() {
  return (
    <Box>
      <div className={styles.content}>

      <div>
        <h1 >Profile Name</h1>
        <h3 >Category</h3>
      </div>
      <div className={styles.actions}>
        <Badge disabled color="danger" />
        <Button disabled color="secondary" >lancer</Button>
      </div>
      </div>

    </Box>
  );
}
