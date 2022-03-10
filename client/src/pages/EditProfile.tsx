import styles from "../styles/EditProfile.module.css";

import Slider from "../components/Slider";



export default function EditProfilePage() {
	return (
		<>
		<div className={styles["header"]}>

			<div className={styles["right"]} >
				<output>Verin 1</output>  
				<Slider label="Pourcentage deploiment" nbverin={1} min={0} max={100}/> 
				<Slider label="Pourcentage de la vites" nbverin={1} min={0} max={99}/>
		
			</div>
			<div className={styles["centre"]}>
				<output>Verin 2</output>
				<Slider nbverin={2}min={0} max={100}/> 
				<Slider nbverin={2} min={0} max={99}/>
			</div>

			<div className={styles["left"]}>
				<output>Verin 3</output>
				<Slider nbverin={3} min={0} max={100}/> 
				<Slider nbverin={3} min={0} max={99}/>

			</div>
		</div>
	
		
		
		</>
	)}
