import styles from "./ProfileBox.module.css";
import Box from "../Box";
import Button from "../Button";

export default function ProfileBox() {
  return (
    <Box>
      <h1 >Profile Name</h1>
      <h3 >Category</h3>
      
      <Button disabled color="secondary">lancer</Button>
    </Box>
  );
}
