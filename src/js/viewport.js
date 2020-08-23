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

    requestRender()

    return {
        async loadModel(model) {
            const objects = await loadGLTF(scene, model)
            requestRender()
            return objects
        },
        isVisible(obj) {
            return obj.layers.mask === 1 ? true : false
        },
        /**
         * two versions of every function so the number of render requests is minimized
         */
        showObject(obj) {
            obj.layers.set(0)
            obj.children.forEach(x => x.layers.set(0))
            requestRender()
        },
        showObjects(objs) {
            objs.forEach(x => {
                x.layers.set(0)
                x.children.forEach(y => {
                    y.layers.set(0)
                })
            })
            requestRender()
        },
        hideObject(obj) {
            obj.layers.set(1)
            obj.children.forEach(x => x.layers.set(1))
            requestRender()
        },
        hideObjects(objs) {
            objs.forEach(x => {
                x.layers.set(1)
                x.children.forEach(y => {
                    y.layers.set(1)
                })
            })
            requestRender()
        },
        /**
         * copy functions of postProcessing.js to add render requests to them
         */
        showOutline(obj) {
            p.showOutline(obj)
            requestRender()
        },
        showOutlines(objs) {
            p.showOutlines(objs)
            requestRender()
        },
        hideOutline(obj) {
            p.hideOutline(obj)
            requestRender()
        },
        hideOutlines(objs) {
            p.hideOutlines(objs)
            requestRender()
        },
        clearOutlines() {
            p.clearOutlines(),
                requestRender()
        }
    }
}

export default createViewport