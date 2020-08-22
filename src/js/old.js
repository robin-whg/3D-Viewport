import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'
import initRGBE from './hdrLoader'
import initGLTF from './gltfLoader'
import createPostProcessing from './postProcessing'

const createViewport = (canvas, rgbe, model) => {
    const v = {}

    v.init = async () => {
            //create WebGLRenderer to actually render something to the passed HTML canvas element
            v.renderer = new THREE.WebGLRenderer({
                canvas,
                alpha: true,
                antialias: true,
            })
            v.renderer.toneMapping = THREE.ACESFilmicToneMapping
            v.renderer.toneMappingExposure = 4 //'brightness'
            v.renderer.outputEncoding = THREE.sRGBEncoding

            //create a scene for the renderer to display (gets passed to it in render function)
            v.scene = new THREE.Scene()

            v.camera = new THREE.PerspectiveCamera(75, 2, 0.1, 50)
            v.camera.position.set(5, 5, 5)

            //OrbitControls rotate camera around a set pivot point
            v.controls = new OrbitControls(v.camera, canvas)
            v.controls.update()

            window.addEventListener('resize', v.requestRender)
            v.controls.addEventListener('change', v.requestRender)

            await initRGBE(v.renderer, v.scene, rgbe)

            const objects = await initGLTF(v.scene, model)

            v.p = createPostProcessing(v.renderer, v.scene, v.camera)

            //variable to determine wether a new frame needs to be rendered as there is no render loop
            v.renderRequested = false

            //render first frame as setup is finished
            v.requestRender()
            console.log('initialized')
            return objects
        },
        v.resizeRendererToDisplaySize = () => {
            const canvas = v.renderer.domElement
            const pixelRatio = window.devicePixelRatio
            const width = canvas.clientWidth * pixelRatio | 0
            const height = canvas.clientHeight * pixelRatio | 0
            const needResize = canvas.width !== width || canvas.height !== height
            if (needResize) {
                v.renderer.setSize(width, height, false)
                v.p.resizeComposer(width, height)
            }
            return needResize
        },
        v.render = () => {
            v.renderRequested = false
            if (v.resizeRendererToDisplaySize()) {
                v.camera.aspect = canvas.clientWidth / canvas.clientHeight
                v.camera.updateProjectionMatrix()
            }
            v.controls.update()
            //v.renderer.render(v.scene, v.camera) --> use without post processing
            v.p.renderComposer(v.scene, v.camera)
        },
        v.requestRender = () => {
            if (!v.renderRequested) {
                v.renderRequested = true
                requestAnimationFrame(v.render)
            }
        }
    return v
}

export default createViewport