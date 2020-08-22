import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'
import loadHDR from './hdrLoader'
import loadGLTF from './gltfLoader'
import createPostProcessing from './postProcessing'

const createViewport = async (canvas, hdr, model) => {
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
    })
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1 //brightness
    renderer.outputEncoding = THREE.sRGBEncoding

    const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 50)
    camera.position.set(5, 5, 5)

    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.target.set(0, 0, 0)
    controls.update()

    const scene = new THREE.Scene()

    await loadHDR(renderer, scene, hdr)

    function resizeRenderer(renderer) {
        const pixelRatio = window.devicePixelRatio
        const width = canvas.clientWidth * pixelRatio | 0
        const height = canvas.clientHeight * pixelRatio | 0
        const needResize = canvas.width !== width || canvas.height !== height
        if (needResize) {
            renderer.setSize(width, height, false)
        }
        return needResize
    }

    let renderRequested = false

    function render() {
        renderRequested = undefined

        if (resizeRenderer(renderer)) {
            const canvas = renderer.domElement
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
        }

        controls.update()
        renderer.render(scene, camera)
    }

    function requestRender() {
        if (!renderRequested) {
            renderRequested = true
            requestAnimationFrame(render)
        }
    }

    controls.addEventListener('change', requestRender)
    window.addEventListener('resize', requestRender)

    requestRender()

    return {
        async loadModel(model) {
            const objects = await loadGLTF(scene, model)
            requestRender()
            return objects
        }
    }
}

export default createViewport