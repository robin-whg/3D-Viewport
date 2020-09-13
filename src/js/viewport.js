import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'
import loadHDR from './hdrLoader'
import loadGLTF from './gltfLoader'
import { createPostProcessing } from './postProcessing'

export const createViewport = async (canvas, hdr, model) => {
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true
    })
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1 //brightness
    renderer.outputEncoding = THREE.sRGBEncoding

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 50)
    camera.position.set(5, 5, 5)

    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.target.set(0, 0, 0)
    controls.update()

    await loadHDR(renderer, scene, hdr)

    const p = createPostProcessing(renderer, scene, camera)

    function resizeRenderer(renderer) {
        const pixelRatio = window.devicePixelRatio
        const width = canvas.clientWidth * pixelRatio | 0
        const height = canvas.clientHeight * pixelRatio | 0
        const needResize = canvas.width !== width || canvas.height !== height
        if (needResize) {
            renderer.setSize(width, height, false)
            p.resizeComposer(width, height)
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
        //renderer.render(scene, camera) for use without postprocessing
        p.renderComposer()
    }

    function requestRender() {
        if (!renderRequested) {
            renderRequested = true
            requestAnimationFrame(render)
        }
    }

    controls.addEventListener('change', requestRender)
    window.addEventListener('resize', requestRender)

    //custom event listener triggered when new frame needs to be rendered
    window.addEventListener('renderEvent', requestRender)

    requestRender()

    return {
        async loadModel(model) {
            const objects = await loadGLTF(scene, model)
            requestRender()
            return objects
        }
    }
}

/**
 * two versions of every function so the number of render requests is minimized
 */
export function isVisible(obj) {
    return obj.layers.mask === 1 ? true : false
}
export function showObject(obj) {
    obj.layers.set(0)
    obj.children.forEach(x => x.layers.set(0))
    const event = new Event('renderEvent')
    window.dispatchEvent(event)
}
export function showObjects(objs) {
    objs.forEach(x => {
        x.layers.set(0)
        x.children.forEach(y => {
            y.layers.set(0)
        })
    })
    const event = new Event('renderEvent')
    window.dispatchEvent(event)
}
export function hideObject(obj) {
    obj.layers.set(1)
    obj.children.forEach(x => x.layers.set(1))
    const event = new Event('renderEvent')
    window.dispatchEvent(event)
}
export function hideObjects(objs) {
    objs.forEach(x => {
        x.layers.set(1)
        x.children.forEach(y => {
            y.layers.set(1)
        })
    })
    const event = new Event('renderEvent')
    window.dispatchEvent(event)
}