import styles from "./ModelViewer.module.css"
import { useState, useEffect, useRef, useCallback } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

// Model
import Model from "../../assets/planche_model.gltf"

// Lib
import { loadModel } from "../../lib/loadModel"
import { Vector3 } from "three"

function easeOutCirc(x: number) {
	return Math.sqrt(1 - Math.pow(x - 1, 4))
}

export default function ModelViewer({ enableRotate = false }: { enableRotate?: boolean }) {
	const refContainer = useRef<HTMLDivElement>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [renderer, setRenderer] = useState<THREE.WebGLRenderer>()
	const [scene] = useState(new THREE.Scene())
	const [model, setModel] = useState<THREE.Object3D<Event>>()
	const [slidersValue, setSlidersValue] = useState<number[]>([0, 0, 0])

	const handleWindowResize = useCallback(() => {
		const { current: container } = refContainer
		if (container && renderer) {
			const scW = container.clientWidth
			const scH = container.clientHeight

			console.log("scW :>> ", scW)

			renderer.setSize(scW, scH)
		}
	}, [renderer])

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		const { current: container } = refContainer
		if (container && !renderer) {
			const scW = container.clientWidth
			const scH = container.clientHeight

			console.log("start scW :>> ", scW)

			const renderer = new THREE.WebGLRenderer({
				antialias: true,
				alpha: true,
			})
			renderer.setPixelRatio(window.devicePixelRatio)
			renderer.setSize(scW, scH)
			renderer.outputEncoding = THREE.sRGBEncoding
			container.appendChild(renderer.domElement)
			setRenderer(renderer)

			const scale = scH * 0.4
			const camera = new THREE.OrthographicCamera(-scale, scale, scale, -scale, -250, 200)
			camera.position.set(0, 0, 0)

			const light = new THREE.PointLight()
			light.position.set(-75, 200.4, 1.0)
			// light.rotation.set(0, -30, 0)
			scene.add(light)

			const ambientLight = new THREE.AmbientLight(0xffffff, 1)
			// ambientLight.position.set(0.8, 1.4, 1.0)
			scene.add(ambientLight)

			const controls = new OrbitControls(camera, renderer.domElement)
			controls.autoRotate = false
			controls.enableZoom = false
			controls.enablePan = false
			controls.enableRotate = enableRotate

			loadModel(scene, Model, {
				receiveShadow: false,
				castShadow: false,
			}).then((res) => {
				animate()
				console.log("LOADED")
				console.log(res)
				setModel(res)
				// setTarget(res.position)
				setLoading(false)
			})

			let req: any = null
			let frame = 0
			const animate = () => {
				req = requestAnimationFrame(animate)

				frame = frame <= 100 ? frame + 1 : frame

				if (frame <= 100) {
					// const p = new Vector3(0, 0, 0)
					// const rotSpeed = -easeOutCirc(frame / 120) * Math.PI * 2
					// camera.position.y = 10
					// camera.position.x = p.x * Math.cos(rotSpeed) + p.z * Math.sin(rotSpeed)
					// camera.position.z = p.z * Math.cos(rotSpeed) - p.x * Math.sin(rotSpeed)
				} else {
					controls.update()
				}

				renderer.render(scene, camera)
			}

			return () => {
				console.log("unmount")
				cancelAnimationFrame(req)
				renderer.dispose()
			}
		}
	}, [])

	useEffect(() => {
		window.addEventListener("resize", handleWindowResize, false)
		return () => {
			window.removeEventListener("resize", handleWindowResize, false)
		}
	}, [renderer, handleWindowResize])

	return (
		<>
			<div className={styles["model-container"]} ref={refContainer}>
				{loading && <h1 className={styles["loading-container"]}>LOADING MODEL</h1>}
			</div>
			<div>
				<input
					type="range"
					value={slidersValue[0]}
					min={0}
					max={99}
					onChange={(event) => {
						// @ts-ignore
						model.morphTargetInfluences[0] = Number(event.target.value) * 0.01
						const newSliderVal = [...slidersValue]
						newSliderVal[0] = Number(event.target.value)
						setSlidersValue(newSliderVal)
					}}
				/>
				{slidersValue[0]}
			</div>
			<div>
				<input
					type="range"
					value={slidersValue[1]}
					min={0}
					max={99}
					onChange={(event) => {
						// @ts-ignore
						model.morphTargetInfluences[1] = Number(event.target.value) * 0.01
						const newSliderVal = [...slidersValue]
						newSliderVal[1] = Number(event.target.value)
						setSlidersValue(newSliderVal)
					}}
				/>
				{slidersValue[1]}
			</div>
			<div>
				<input
					type="range"
					value={slidersValue[2]}
					min={0}
					max={99}
					onChange={(event) => {
						// @ts-ignore
						model.morphTargetInfluences[2] = Number(event.target.value) * 0.01
						const newSliderVal = [...slidersValue]
						newSliderVal[2] = Number(event.target.value)
						setSlidersValue(newSliderVal)
					}}
				/>
				{slidersValue[2]}
			</div>
		</>
	)
}
