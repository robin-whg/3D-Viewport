import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'
import initRGBE from './rgbeLoader'
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
        },
        v.showOutline = (object) => {
            /**
             * recreate showOutlines() form postProcessing.js
             * no need to pass down requestRender()
             * no need to call requestRender() every time you use showOutlines()
             * function for single object so the name makes sense and you don't have to wrap the object in an array
             * function for multiple objects to minimize render requests
             */
            v.p.showOutlines([object])
            v.requestRender()
        },
        v.showOutlines = (objects) => {
            v.p.showOutlines(objects)
            v.requestRender()
        },
        v.hideOutlines = () => {
            // no need for the ability to hide single objects as I don't need it
            v.p.hideOutlines()
            v.requestRender()
        },
        v.showObject = (object) => {
            /**
             * again two versions of the functions to have proper naming and minimize the render requests
             * changing the layer instead of the visibility so the objects don't have to be drawn
             * also handy for raycasters
             */
            object.layers.set(0)
            object.children.forEach(x => {
                x.layers.set(0)
            })
            v.requestRender()
        },
        v.showObjects = (objects) => {
            object.forEach(x => { //no need to make it recursive as the tree can't go deeper than 2 layers
                x.layers.set(0)
                x.chilren.forEach(y => {
                    y.layers.set(0)
                })
            })
            v.requestRender()
        },
        v.hideObject = (object) => {
            object.layers.set(1)
            object.children.forEach(x => {
                x.layers.set(1)
            })
            v.requestRender()
        },
        v.hideObjects = (objects) => {
            objects.forEach(x => {
                x.layers.set(1)
                x.children.forEach(y => {
                    y.layers.set(1)
                })
            })
        },
        v.isVisible = (object) => {
            /**
             * not necessary
             * you can use object.layers.mask but it is not 0 based even though object.layers.set() is so it is confusing
             * object.visible always returns true because the visibility attribute doesn't change
             */
            return object.layers.mask === 1 ? true : false
        }
    return v
}

export default createViewport