import {
    Vector2
} from 'three';
import {
    EffectComposer
} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {
    RenderPass
} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {
    ShaderPass
} from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {
    CopyShader
} from 'three/examples/jsm/shaders/CopyShader.js';
import {
    OutlinePass
} from 'three/examples/jsm/postprocessing/OutlinePass.js';
import {
    FXAAShader
} from 'three/examples/jsm/shaders/FXAAShader.js';
/**
 * this is not gonna work with mulitple scenes that have postprocessing as outlinePass gets overwritten
 * you would have to pass around the outlinepass object or maybe make custom events
 */
let outlinePass = {}
export const createPostProcessing = (renderer, scene, camera) => {
    const size = renderer.getDrawingBufferSize(new Vector2());
    // create EffectComposer to add post processing effects to
    const composer = new EffectComposer(renderer);
    // create RenderPass to render scene for passing it to the effects
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    // create OutlinePass to highlight selected objects with an outline
    outlinePass = new OutlinePass(new Vector2(size.width, size.height), scene, camera)
    outlinePass.edgeStrength = 5;
    outlinePass.edgeThickness = 1;
    outlinePass.edgeGlow = 0.25;
    outlinePass.visibleEdgeColor.set('#EBEBEB');
    outlinePass.hiddenEdgeColor.set('#525252');
    composer.addPass(outlinePass);
    // shader pass for anitaliasing as the regular one is applied before the postprocessing
    const fxaaShader = new ShaderPass(FXAAShader);
    composer.addPass(fxaaShader);
    fxaaShader.renderToScreen = true

    return {
        renderComposer() {
            composer.render(scene, camera);
        },
        resizeComposer(width, height) {
            composer.setSize(width, height, false);
            fxaaShader.uniforms['resolution'].value.set(1 / width, 1 / height);
        }
    }
}

export function showOutline(obj) {
    outlinePass.selectedObjects.push(obj)
    const event = new Event('renderEvent')
    window.dispatchEvent(event)
}

export function showOutlines(objs) {
    outlinePass.selectedObjects.push(...objs)
}

export function hideOutline(obj) {
    outlinePass.selectedObjects = outlinePass.selectedObjects.filter(x => x !== obj)
}

export function hideOutlines(objs) {
    outlinePass.selectedObjects = outlinePass.selectedObjects.filter(x => !objs.includes(x))
}

export function clearOutlines() {
    outlinePass.selectedObjects = []
    const event = new Event('renderEvent')
    window.dispatchEvent(event)
}