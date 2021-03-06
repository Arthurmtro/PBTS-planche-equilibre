import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Object3D, Vector3 } from "three"

export function loadModel(scene: any, glbPath: any, options = { receiveShadow: true, castShadow: true }) {
	const { receiveShadow, castShadow } = options
	return new Promise<Object3D<Event>>((resolve, reject) => {
		const loader = new GLTFLoader()

		return loader.load(
			glbPath,
			(gltfObj) => {
				const object = gltfObj.scenes[0].children[0]

				object.traverse((child: Object3D<Event> | any) => {
					if (child!.isMesh) {
						child.castShadow = castShadow
						child.receiveShadow = receiveShadow
					}
				})
				object.scale.set(500, 500, 500)
				object.rotation.set(0, 0, 0)
				object.up = new Vector3(0, 0, 0)
				object.position.set(0, -0.25 * 500, -0.25 * 500)
				object.name = "Planche"
				object.receiveShadow = receiveShadow
				object.castShadow = castShadow

				scene.add(object)
				// @ts-ignore
				resolve(object)
				// return object
			},

			(xhr) => {
				console.log((xhr.loaded / xhr.total) * 100 + "% loaded")
			},
			(error) => {
				reject(error)
			}
		)
	})
}
