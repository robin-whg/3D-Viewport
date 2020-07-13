import * as THREE from 'three';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'
import initRGBE from './rgbeLoader'
import initGLTF from './gltfLoader'

export const createViewport = (canvas, rgbe, model) => {
    canvas,
    rgbe,
    model;
    const v = {};
    v.init = async () => {
        v.renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
        });
        v.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        v.renderer.toneMappingExposure = 4;
        v.renderer.outputEncoding = THREE.sRGBEncoding;

        v.renderRequested = false;

        v.scene = new THREE.Scene();

        v.camera = new THREE.PerspectiveCamera(75, 2, 0.1, 50);
        v.camera.position.set(5, 5, 5);

        v.controls = new OrbitControls(v.camera, canvas);
        v.controls.update();

        window.addEventListener('resize', v.requestRender);
        v.controls.addEventListener('change', v.requestRender);

        // errors do not get catched!!!
        await initRGBE(v.renderer, v.scene, rgbe);
        const objects = await initGLTF(v.scene, model);

        v.requestRender();
        console.log('initialized');
    },
    v.resizeRendererToDisplaySize = () => {
        const canvas = v.renderer.domElement;
        const pixelRatio = window.devicePixelRatio;
        const width  = canvas.clientWidth  * pixelRatio | 0;
        const height = canvas.clientHeight * pixelRatio | 0;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            v.renderer.setSize(width, height, false);
        }
        return needResize;
    },
    v.render = () => {
        v.renderRequested = false;
        if (v.resizeRendererToDisplaySize()) {
            v.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            v.camera.updateProjectionMatrix();
        }
        v.controls.update();
        v.renderer.render(v.scene, v.camera);
    },
    v.requestRender = () => {
        if (!v.renderRequested) {
            v.renderRequested = true;
            requestAnimationFrame(v.render)
        }
    }
    return v;
}